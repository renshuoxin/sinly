import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './app.vue'
import routes from './router'
import '../../css/base.css'

Vue.use(VueRouter);

// 工厂函数，为每个请求创建一个新的应用程序实例
export default function createApp() {
  const router = new VueRouter({
    routes
  })

  const app = new Vue({
    router,
    render: h => h(App)
  })

  return { app, router }
}