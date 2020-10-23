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
## 组件注册（局部注册 和 全局注册）
## 异步更新队列
## 双向绑定原理
## 响应式原理
## 列表渲染key

# 业务
## 一点号强制用户刷新页面（上线增加版本号概念）