import Manager from "./Manager";
const electron = require('electron');
const remote = electron.remote;
/**
 * Manager avec quelques options Electron en plus
 */
export default class ManagerElectron extends Manager{
    /**
     * Ouvre ou ferme Dev Tools
     */
    toggleDevTools(){
        console.log("toggleDevTools");
        remote.getCurrentWebContents().toggleDevTools()
    }
}