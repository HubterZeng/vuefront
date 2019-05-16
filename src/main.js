// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import qs from 'qs'
import global_ from './components/Global'//引用文件
Vue.prototype.$qs = qs;
Vue.use(VueAxios, axios);
Vue.config.productionTip = false
Vue.use(ElementUI);

Vue.prototype.GLOBAL = global_//挂载到Vue实例上面

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  render: h => h(App)
})

