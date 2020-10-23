import Vue from 'vue'
import App from './mobile.vue'
import './mobile.less'
import axios from '../../plugins/axios'

Vue.use(axios)

// new Vue({
//   el: '#app', //存在el这个选项，Vue实例将立即进入编译过程
//   router,
//   render: h => h(App)
// })

//手动进行挂载，开启编译
new Vue({
  render: h => h(App),
}).$mount('#mobile')