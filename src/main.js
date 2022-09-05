import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'


window.apiUrl="http://localhost/github/tilty-server/api";
window.apiUrl="https://001.tilty.io/herbier-pradeau/server/api";

Vue.config.productionTip = false;
Vue.use(VueRouter);
window.$router=router;


const isElectron = typeof __static !== "undefined"

if(isElectron){
    require("./main-electron")
}else{
    require("./main-web")
}
Vue.prototype.$api = Vue.observable(window.$api);

/**
 * Variables et méthodes globales
 * @type {Manager}
 */
Vue.prototype.$manager = Vue.observable(window.$manager);


new Vue({
    router,
    render: h => h(App)
}).$mount('#app')




