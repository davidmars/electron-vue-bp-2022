import VueRouter from "vue-router";
import PageVeille from  "./pages/page-veille";
import PageHome from    "./pages/page-home";
import PageParam from   "./pages/page-param";

const router = new VueRouter({
    mode:"hash",
    routes: [
        {
            name:'veille',
            path: '/veille',
            component: PageVeille
        },
        {
            name:'home',
            path: '/',
            component: PageHome
        },
        {
            name:'pageParam',
            path: '/page-param/:param',
            component: PageParam
        }
    ]
})
router.beforeEach((to, from, next) => {
    window.$manager.manageRoute(to,from);
    next();
})


export default router;