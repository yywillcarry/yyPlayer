import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/music'
}, {
    path: '/music',
    component: () =>
        import ('pages/music'),
    redirect: '/music/playlist',
    children: [{
            path: '/music/playlist',
            component: () =>
                import ('pages/playList'),
            meta: {
                keepAlive: true
            }
        }, {
            path: '/music/userlist',
            component: () =>
                import ('pages/userList'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/music/toplist',
            component: () =>
                import ('pages/topList'),
            meta: {
                keepAlive: true
            }
        }, {
            path: '/music/details/:id',
            component: () =>
                import ('pages/details'),

        }, {
            path: '/music/historylist',
            component: () =>
                import ('pages/historyList'),

        },

        {
            path: '/music/search',
            component: () =>
                import ('pages/search'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/music/comment/:id',
            component: () =>
                import ('pages/comment'),
        }
    ]
}]

const router = new VueRouter({
    routes
})

export default router