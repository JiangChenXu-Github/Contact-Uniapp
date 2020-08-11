import Vue from 'vue'
import App from './App'
import io from '@/static/js/tools/weapp.socket.io.js'

Vue.config.productionTip = false
Vue.prototype.$baseURL = 'http://3116d5539s.qicp.vip/'
Vue.prototype.$socket = io('http://3116d5539s.qicp.vip/')

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
