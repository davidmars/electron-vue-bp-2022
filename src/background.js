'use strict'
import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
const {ipcMain} = require('electron');
const { ipcRenderer } = require('electron');
const path=require("path");
const { autoUpdater } = require("electron-updater");
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import * as electron from "electron";

const isDevelopment = process.env.NODE_ENV !== 'production'
//const isDevelopment = process.mainModule.filename.indexOf('app.asar') === -1;




// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } }
])
let mainWindow;

/**
 * Ouvrir une fenêtre de l'app
 * @param {*} args options de la fenêtre
 * @return {Electron.BrowserWindow}
 */
function createWindow(args={}) {
    let winOptions={
        width: 1200,
        height: 800,
        show:false,
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: true,
            //nodeIntegration: false
            webSecurity: false,
            contextIsolation: false,
            allowRunningInsecureContent: true,
            enableRemoteModule: true
        }
    }
    Object.assign(winOptions,args);
    // Create the browser window.
    let win= new BrowserWindow(winOptions)

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        console.log("url is "+process.env.WEBPACK_DEV_SERVER_URL)
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        console.log("url is "+'app://./index.html')
        win.loadURL('app://./index.html')
    }

    //url à utiliser pour les vidéos dans le répertoire public
    protocol.registerFileProtocol('local-video', (request, callback) => {
        const url = request.url.replace(/^local-video:\/\//, '')
        // Decode URL to prevent errors when loading filenames with UTF-8 chars or chars like "#"
        const decodedUrl = decodeURI(url) // Needed in case URL contains spaces
        return callback(path.join(__static, decodedUrl))
    })

    win.removeMenu();

    if(isDevelopment){
        //en dev on balance sur le deuxième écran à droite
        win.webContents.openDevTools();
        if(electron.screen.getAllDisplays().length>1){
            win.setPosition(electron.screen.getPrimaryDisplay().bounds.width,0);
        }
        win.maximize();

    }else{
        //win.maximize();
        win.setFullScreen(true);
    }

    return win;
}
/**
 * Ouverture de fenêtres enfant depuis le renderer
 */
ipcMain.on('OPEN_NEW_WINDOW', (event, args) => {
    let videoWindow=createWindow(args);
    if(mainWindow){
        mainWindow.webContents.send("OPEN_NEW_WINDOW_DONE",
            args.winId,
            videoWindow.id
        );
    }
});


// Quitter l'app quand toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
    app.quit()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    protocol.registerFileProtocol('file', (request, callback) => {
        let pathname = request.url.replace('file:///', '');
        pathname=pathname.replace(/\//g,"\\");
        pathname=pathname.replace(/%20/g," ");
        callback(pathname);
    });
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }
    mainWindow=createWindow();
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send("IS_MAIN");
        mainWindow.maximize();
    });
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
    //quite l'app quand la fenêtre principale est fermée
    mainWindow.once("closed",function(){
        app.quit();
    })
    checkUpdate(20);
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}

let timeout=null;

// Fonction reçue de CMD.INSTALL_AND_REBOOT
ipcMain.on('INSTALL_AND_REBOOT', (event, arg) => {
    autoUpdater.quitAndInstall();
});
// Fonction reçue de la sync web pour autoriser ou non l'installation de pre-releases
ipcMain.on('ALLOW_PRE_RELEASE', (event, allow) => {
    autoUpdater.allowPrerelease=allow;
});
//envoie un UpdaterStatus à renderer
function sendUpdaterStatus(message="",nextVersion=null,downloadProgress=null,available=null) {
    if(mainWindow){
        mainWindow.webContents.send("UpdaterStatus", message,nextVersion,downloadProgress,available);
    }
}

/**
 * Vérifie les mises à jour avec un délai
 * @param delaySeconds
 */
function checkUpdate(delaySeconds=60){
    sendUpdaterStatus('Recherche de nouvelle version dans '+delaySeconds+"sec");
    if(timeout){
        clearTimeout(timeout);
    }
    timeout=setTimeout(function(){
        autoUpdater.checkForUpdatesAndNotify();
    },delaySeconds*1000);
}
autoUpdater.on('checking-for-update', () => {
    sendUpdaterStatus('Recherche de nouvelle version');
    setTimeout(function(){
        sendUpdaterStatus("");
    },3*1000);
});
autoUpdater.on('update-available', (info) => {
    sendUpdaterStatus(`Nouvelle version disponible`,info.version);
});
autoUpdater.on('update-not-available', (info) => {
    sendUpdaterStatus("Le programme est à jour");
    setTimeout(function(){
        sendUpdaterStatus("");
    },3*1000);
    checkUpdate(60);
});
autoUpdater.on('error', (err) => {
    sendUpdaterStatus('Erreur de mise à jour ' + err);
    setTimeout(function(){
        sendUpdaterStatus("");
    },5*1000);
    checkUpdate(120);
});
autoUpdater.on('download-progress', (progressObj) => {
    //let log_message = "Download speed: " + progressObj.bytesPerSecond;
    //log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    //log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    //sendStatusToWindow(`Mise à jour ${Math.round(Number(progressObj.percent))}%`);
    sendUpdaterStatus(
        "Téléchargement en cours",
        null,
        Math.floor(Number(progressObj.percent))
    );
});
autoUpdater.on('update-downloaded', (info) => {
    autoUpdater.quitAndInstall(); //ou pas...
    sendUpdaterStatus(
        `Mise à jour prête à être installée`,
        info.version,
        0,
        true
    );
});
