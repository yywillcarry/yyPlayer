import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/styles/index.less'
import musicIcon from '@/components/musicIcon'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
    loading: require('assets/img/default.png')
})
Vue.config.productionTip = false
Vue.component(musicIcon.name, musicIcon)
new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')