# Vue 基础
## vue挂载方式
- el
```
new Vue({
  el: '#app'
})
```
- $mount
```
new Vue({
  render: h => h(App)
}).$mount('#app')
```
## 运行时 + 编译器 vs 只包含运行时
- `vue.common.js`(Runtime Only): 用来创建Vue实例、渲染并处理虚拟DOM等代码。基本就是除去编译器的其他一切
  - 借助`webpack`的loader工具，将.vue文件编译为`Javascript`，进行了预编译
  - `template` ——`vue-template-compiler`——> `render`函数
- `compiler.js`(Runtime-compiler): 用来将模板字符串编译成为`Javascript`渲染函数的代码
  - 需要在客户端编译模板
  - 打包时不进行编译，运行时才去编译`template`
- `vue.js`: 包含编译器和运行时
```
// 需要编译器
// 1、挂载到一个元素上并以其DOM内部的HTML作为模板
new Vue({
  el: '#app'
})
// 2、传入一个字符串给`template`选项
new Vue({
  template: '<div>456</div>'
})

// 不需要编译器
new Vue({
  render (h) {
    return h('div', this.hi)
  }
})
```
## 组件注册（局部注册 和 全局注册 vs 插件）
- 全局注册: 注册之后可以应用程序的任何位置使用（包括其他组件）
```
Vue.component('my-component-name', {
  // ... 选项 ...
})
```
- 局部注册：只能在注册它的组件使用
```
import ComponentA from './ComponentA'
import ComponentC from './ComponentC'

export default {
  components: {
    ComponentA,
    ComponentC
  },
  // ...
}
```
- 插件
```
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或 property
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }

  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })

  // 3. 注入组件选项
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })

  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
}
// 调用 `MyPlugin.install(Vue)`
Vue.use(MyPlugin)
```
**Vue.use源码**
```
export function initUse(Vue: GlobalAPI) {
  Vue.use = function(plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if(this._installedPlugins.indexOf(plugin) > -1) {
      return this;
    }
    const args = toArray(arguments, 1)
    args.unshift(this);
    if(typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if(typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this;
  }
}
```
对Vue.use()源码进行解读<br>
1、首先判断插件plugin是否是对象或者函数<br>
**Vue.use = function(plugin: Function | Object)**<br>
2、判断Vue是否已经注册这个插件<br>
**this._installedPlugins.indexOf(plugin) > -1**<br>
3、取Vue.use参数<br>
**const args = toArray(arguments, 1)**<br>
除第一个参数外（第一个参数是插件plugin），其他参数都存储到一个数组中，并且将Vue对象插入到参数数组的第一位。最后参数数组就是[vue, arg1, arg2, ...]<br>
4、判断插件是否有install方法，如果有执行install方法；否则直接把plugin当install执行<br>
5、最后告知Vue该插件已经注册过**installedPlugins.push(plugin);**保证每个插件只会注册一次。<br>
## 异步更新队列
## 双向绑定原理
## 响应式原理
## 列表渲染key
## 浏览器多进程
**以Chrome为例**
在Chrome中，主要进程有4个：<br>
- 浏览器进程：主要负责界面显示、用户交互、子进程管理，同时提供存储等功能
- 渲染进程：核心任务是将 HTML、CSS 和 JavaScript 转换为用户可以与之交互的网页，排版引擎 Blink 和 JavaScript 引擎 V8 都是运行在该进程中，默认情况下，Chrome 会为每个 Tab 标签创建一个渲染进程。出于安全考虑，渲染进程都是运行在沙箱模式下。
- 插件进程：主要是负责插件的运行，因插件易崩溃，所以需要通过插件进程来隔离，以保证插件进程崩溃不会对浏览器和页面造成影响
- GPU进程：负责处理整个应用程序的GPU任务
- 网络进程。主要负责页面的网络资源加载，之前是作为一个模块运行在浏览器进程里面的，直至最近才独立出来，成为一个单独的进程。
## 垃圾回收
https://mp.weixin.qq.com/s?__biz=MzAxODE2MjM1MA==&mid=2651562406&idx=2&sn=4d4febaa377db6cd02cbb660fd88402b&chksm=80257667b752ff71c7683e88853ce4da54d5b226f675a238306e242a3dcb09dd9e7a84fe9330&scene=21#wechat_redirect

# 业务
## 一点号强制用户刷新页面（上线增加版本号概念）