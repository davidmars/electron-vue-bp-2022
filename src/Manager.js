
export default class Manager{



    constructor() {


        /**
         * Est-on connecté à internet ?
         * @type {boolean}
         */
        this.onLine=navigator.onLine;
        window.addEventListener('offline', ()=>{ this.onLine=false });
        window.addEventListener('online', ()=>{ this.onLine=true });

        /**
         * Faut il afficher la version ou non?
         * @type {boolean}
         */
        this.displayVersion=true;
        //masque la version au bout de 30s
        const displayVersionTime=30*1000
        setTimeout(()=>{
            this.displayVersion=false
        },displayVersionTime)

        /**
         * Nombre de MS avant l'inactivité
         * @type {number}
         */
        const inactiveTime=1*60*1000

        this._veilleTimeOut=null;
        let restartVeille=(goHome=true)=>{

            if(this._veilleTimeOut){
                clearTimeout(this._veilleTimeOut)
            }
            if(goHome){
                if(window.$router.currentRoute.name==="veille"){
                    console.log("sort de veille")
                    window.$router.push({name:'langues'})
                }
            }
            this._veilleTimeOut=setTimeout(()=>{
                console.log("sleep")
                if(window.$router.currentRoute.name!=="veille"){
                    console.log("sleep go veille")
                    window.$router.push({name:'veille'})
                }
            },inactiveTime)
        }
        restartVeille(false);

        window.addEventListener("mousedown",()=>{restartVeille(true)})
        window.addEventListener("mouseup",()=>{restartVeille(true)})
        window.addEventListener("touchstart",()=>{restartVeille(true)})
        window.addEventListener("mousemove",()=>{restartVeille(true)})

    }

    /**
     * Renvoie true si on est sur electron et false si on est en mode web
     * @returns {boolean}
     */
    get isElectron(){
        return typeof __static !== "undefined"
    }

    /**
     * Pour obtenir le chemin d'un asset dans le répertoire public
     * @param {string} path
     * @return {string}
     */
    publicPath(path,video=false){
        if(video && this.isElectron){
            return "local-video://"+path.trim();
        }else{
            return process.env.BASE_URL+path.trim();
        }

    }

    /**
     * La version
     * @returns {string}
     */
    get version(){
        return require("../package.json").version;
    }

    /**
     * Renvoie l'erreur à afficher s'il y a lieu
     * @return {String|false}
     */
    get error(){
        if(this.errors.length){
            return this.errors[0];
        }
        return false;
    }

    /**
     * Est-on sur localhost ou non?
     * @returns {boolean}
     */
    get isLocalhost(){
        return document.location.host.indexOf("localhost")>-1;
    }

    manageRoute(to,from){
        this.routeName=to.name;
        console.log("manageRoute",to,from);
        //TODO faire un truc quand on change de page
    }


}