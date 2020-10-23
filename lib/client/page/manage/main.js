import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router'
import App from './app.vue'
import '../../css/base.css'

Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

// new Vue({
//   el: '#app', //存在el这个选项，Vue实例将立即进入编译过程
//   router,
//   render: h => h(App)
// })

// 手动进行挂载，开启编译
new Vue({
  render: h => h(App),
  router,
}).$mount('#app')