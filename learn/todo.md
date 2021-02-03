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
## 生命周期
- beforeCreate: 在实例初始化之后，数据观测和event/watch配置之前调用
- created：在实例创建完成之后被立即调用。此时已完成数据观测、property和方法的运算、watch/event事件回调
- beforeMount：在实例挂载之前调用：相关的render函数首次被调用
- mounted：实例被挂载后调用，真实DOM挂载完成
- beforeUpdate：数据更新时，重新渲染之前调用
- updated：数据已经更改完成，基于数据更改而导致的DOM渲染也完成，此时调用该钩子
- beforeDestroy: 实例销毁前调用，此时实例完全可用
- destroyed: 实例销毁后调用，该钩子调用后，Vue实例的所有指令都被解绑，所有的事件监听器被移除，所有的子实例也都被销毁
- activated: 被 keep-alive 缓存的组件激活时调用。
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
Vue在更新DOM时是异步执行的。
- 当数据变化时，Vue将开启(queueWatcher)一个队列并缓存同一事件循环的数据变更（watcher）；
- 当同一watcher多次被触发时，只会缓存一次，避免不必要的计算和DOM操作；
- 在下一个事件循环时，Vue刷新队列并执行实际工作
![avatar](https://pic2.zhimg.com/v2-6e3e32823165300fe44c8c9456d31101_r.jpg)<br>

参考：https://juejin.cn/post/6844903543204216845
## nextTick实现
```
export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  // callbacks为一个数组，此处将cb推进数组，本例中此cb为刚才还未执行的flushSchedulerQueue
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  // 标记位，保证之后如果有this.$nextTick之类的操作不会再次执行以下代码
  if (!pending) {
    pending = true
    // 用微任务还是用宏任务，此例中运行到现在为止Vue的选择是用宏任务
    // 其实我们可以理解成所有用v-on绑定事件所直接产生的数据变化都是采用宏任务的方式
    // 因为我们绑定的回调都经过了withMacroTask的包装，withMacroTask中会使useMacroTask为true
    if (useMacroTask) {
      macroTimerFunc()
    } else {
      microTimerFunc()
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```
`nextTick`将update函数缓存到队列中，然后调用`macroTimerFunc`或者`microTimerFunc`；这两个函数实质是采用异步（`Promise.then`, `MutationObserve`, `setImmediate`, `setTimeout(fn, 0)`）的方式去调用callbacks中的函数
## 双向绑定原理
利用数据劫持和观察者模式，通过`Object.defineProperty()`劫持各个属性的setter和getter，在数据变动时通知通知观察者watcher进行更新（dom更新）<br>
1、实现数据监听器observer，用来劫持并监听数据对象的所有属性；如数据变化，便通知观察者<br>
2、实现观察者watcher，可以收到属性变化通知并执行相应的函数，更新视图<br>
3、实现解析器compiler，可以扫描和解析各个节点的相关指令，并根据初始化模板数据初始化对应的watcher<br>
![avatar](https://upload-images.jianshu.io/upload_images/13292193-46b64b15abed5139.png)<br>
**ps: complier实现逻辑**<br>
![avatar](https://upload-images.jianshu.io/upload_images/13292193-500489b047f4ccde.png)<br>
## 依赖收集
**以computed为例**
观察者(watcher)：computed； 观察目标：computed依赖的数据<br>
`this._watcher = new Watcher(this, render, this._update)`<br>
render: 观察者函数（render/computed）<br>
_update: 回调函数（watcher的回调函数视图更新）<br>
1、进行初始求值，调用watcher.get()方法<br>
2、初始准备工作：将当前watcher赋值给Dep.target<br>
3、执行观察者函数，进行计算。由于数据已经被劫持处理，因为在计算过程中访问数据属性时，会触发属性的getter，从而调用watcher.addDep()，将特定数据记为依赖。也就是数据属性dep中会增加当前观察者<br>
4、事后处理：依赖不会重复收集，进行校验等等<br>
5、当某个数据更新时，setter会对其观察者队列里watchers进行通知，从而执行watcher.update方法，而update()方法会重复求值过程（即为步骤2-4），从而使得观察者函数重新计算，而render()这种观察者函数重新计算的结果，就使得视图同步了最新的数据。
## prop
- 子组件为什么不可以修改父组件传递的prop
为了保证数据的单向流，便于对数据的追踪；如果子组件可以修改父组件传递的prop，子组件将修改父组件的状态，导致数据混乱。
- Vue如何监听到子组件修改了prop
Vue在对prop进行数据劫持defineReactive时，会传递一个自定义的set函数，该函数会在触发prop的set方法时执行。然后判断如果不是根组件，且不是更新子组件，那么说明更新的是props，进行警告提示
- 特别注意
如果传入props的是基本数据类型，子组件修改props会有警告提示；如果传入props的是引用类型（Object,Array）数据，那子组件修改引用类型数据的某个属性时，不会有警告提示，并且父组件对应的数据也会被修改。
## Vue父组件和子组件声明周期执行顺序
1、父组件创建：beforeCreate => created => beforeMount<br>
2、子组件创建：=> beforeCreate => created => beforeMount => mounted<br>
3、父组件：=> mounted<br>
***
1、加载渲染过程<br>
父beforeCreate->父created->父beforeMount->子beforeCreate->子created->子beforeMount->子mounted->父mounted<br>
2、子组件更新过程<br>
父beforeUpdate->子beforeUpdate->子updated->父updated<br>
3、父组件更新过程<br>
父beforeUpdate->父updated<br>
4、销毁过程
父beforeDestroy->子beforeDestroy->子destroyed->父destroyed
## 响应式原理
数据变化，视图会进行更新
![avator](https://cn.vuejs.org/images/data.png)
### 对于对象
Vue不能检测属性的添加和删除。Vue在初始化数据时，对data中属性进行getter/setter转化，所以属性必须在data中声明才可以变为响应式
```
var vm = new Vue({
  data: {
    a: 1
  }
})

vm.a  //响应式
vm.b = 3  //非响应式
```
也就是说对于已经创建的vue实例，不能动态在其根上添加响应式的属性；解决方法如下：
```
Vue.set(vm.someObject, 'b', 3);
```
或者使用`this.$set`实例方法
```
this.$set(vm.someObject, 'b', 3);
```
### 对于数组
Vue不能检测到一下变动：
1、利用索引值修改数组属性值，如vm.arr[index] = 2;
2、修改数据长度，如vm.arr.length = 3;
解决方案：
```
Vue.set(vm.arr, index, 2);
```
```
vm.arr.splice(index, 1, newValue);
```
## 列表渲染key
## 虚拟DOM为什么可以提高性能
- 虚拟DOM提高性能，并非绝对的
- 虚拟DOM不会进行重绘和回流操作
- 虚拟DOM频繁修改，然后一次性比较并修改真实DOM(需要修改的部分)，最后在真实DOM中进行重绘和回流，减少过多DOM节点的重绘和回流
- 真实DOM频繁重绘和回流效率特别低<br>
  
**虚拟DOM损耗计算**<br>
> 虚拟DOM损耗 = 虚拟DOM增删改 + 真实DOM差异增删改（diff算法）+ 较少DOM节点重绘和回流<br>

**虚拟DOM损耗计算**<br>
> 真实DOM损耗 = 真实DOM增删改 + DOM节点重绘和回流
## v-if VS v-show
- `v-if` 真正的条件渲染，确保切换过程中条件块内事件监听器和子组件被销毁和重建；惰性渲染，初始条件为false时，什么都不做，直至第一次变为真，才会开始渲染条件块
- `v-show` 不论初始条件是什么，元素都会被渲染，只是通过display来切换元素显示与否；v-show和template不能一起使用
## v-if和v-for一起使用
**v-for优先级高于v-if**
- 有意渲染部分节点
```
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo }}
</li>
```
- 有条件的跳过循环的执行
```
<ul v-if="todos.length">
  <li v-for="todo in todos">
    {{ todo }}
  </li>
</ul>
<p v-else>No todos left!</p>
```
## new Vue()做了什么
- 合并options，初始化操作（初始化事件中心，初始化生命周期，初始化渲染，初始化data、computed、props、watcher）; 如果存在options.el，执行挂载$mount(el);
- 实例挂载$mount：vue2执行渲染最终都需要render方法，因此如果不存在options.render，会将el或者template转换为render方法；接着执行mountComponent;
- mountComponent：初始化渲染watcher
```
// Watcher作用：1、初始化时执行回调函数；2、vm实例中监测到数据变化时执行回调函数
new Watch(vm, updateComponent, noop, {

}, true //isRenderWatcher);

// vm._render生成虚拟Node，最终调用_update更新DOM
updateComponent() {
  vm._update(vm._render)
}
```
- render生成虚拟Node：实质是调用实例的createElement方法；
- createElement: 1、规范化children；2、创建Vnode（包括两种：普通VNode和组件类型VNode）
```
let vnode, ns
if (typeof tag === 'string') {
  let Ctor
  ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
  if (config.isReservedTag(tag)) {
    // platform built-in elements
    vnode = new VNode(
      config.parsePlatformTagName(tag), data, children,
      undefined, undefined, context
    )
  } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
    // component
    vnode = createComponent(Ctor, data, context, children, tag)
  } else {
    // unknown or unlisted namespaced elements
    // check at runtime because it may get assigned a namespace when its
    // parent normalizes children
    vnode = new VNode(
      tag, data, children,
      undefined, undefined, context
    )
  }
} else {
  // direct component options / constructor
  vnode = createComponent(tag, data, context, children)
}
```
- update将VNode渲染成真实DOM
## vue-router hash VS history
- pushState 和 replaceState 不会触发页面刷新，也不会触发popstate，那如何进行component切换
pushState 和 replaceState 只会对历史栈数据进行更新，不会影响组件的渲染
- router-link点击后，发生了什么？<br>
**push => 执行history.transitionTo(路径切换 + 组件更新)**<br>
```
transitionTo(location,onComplete, onAbort) {
  const route = this.router.match(location, this.current);
  this.confirmTransition(route, () => {
    this.updateRoute(route);
    onComplete && onComplete(route);
  })
}

push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  const { current: fromRoute } = this
  this.transitionTo(location, route => {
    pushHash(route.fullPath)   //修改URL，并操作历史栈
    handleScroll(this.router, route, fromRoute, false)
    onComplete && onComplete(route)
  }, onAbort)
}
```
1. 路径切换<br>
根据location找到对应的route，然后进行路径切换；主要工作：对比目标route和当前route，然后执行调用一系列钩子函数<br>
   - 在失活组件调用离开守卫
   - 调用全局的beforeEach守卫
   - 在重用组件里调用beforeRouterUpate守卫
   - 在激活的路由配置中调用beforeEnter守卫 ？？
   - 解析异步路由组件
   - 在被激活的组件中调用beforeRouterEnter守卫
   - 调用全局的beforeResolve守卫  ？？？
   - 调用全局的afterEach钩子
2. 组件更新渲染<br>
`this.updateRoute(route)`用于组件更新渲染
```
updateRoute(route) {
  // ...
  this.current = route;
  this.cb && this.cb(route);
}
```
**cb来源：** 回调函数中修改了Vue跟实例的_route值
```
listen(cb) {
  this.cb = cb;
}
history.listen(route => {
  this.apps.forEach(app => {
    app._route = route;
  })
})
```
**Vue-router初始化:**在beforeCreate钩子函数中逻辑
```
Vue.mixin({
  beforeCreate () {
    if (isDef(this.$options.router)) {
      // 对_route做了数据劫持
      Vue.util.defineReactive(this, '_route', this._router.history.current)
    }
    // ...
  }
})
```
也就是说：`<router-view>`执行`render`函数时，访问`this._routerRoot._route`，触发其`getter`，然后`_route`收集依赖；当`transitionTo`修改`app._route`时，触发其`setter`，然后通知`<router-view>`的渲染watcher接收更新通知，重新渲染组件。
## vue3新特性
- 数据劫持：Proxy
  - 对添加、删除属性的监测
  - 对数组基于下标的修改，对于length修改的监测
  - 对Map、Set的支持
  - 默认惰性监测<br>
    1. vue2实例初始化时，对所有响应式数据进行监测，如果数据量较大，性能消耗严重；
    2. vue3只有应用初始可见部分所用数据才会被监测
  - 更精准的变动通知
    1. vue2，通过Vue.set添加响应式属性时，所有依赖该对象的watcher都会重新计算
    2. vue3，只有依赖这个具体属性的watcher才会被通知
- 性能优化
  - 重写虚拟DOM：将vdom更新性能由与模板整体大小相关提升为与动态内容数量有关
  - 优化插槽生成
    1. vue2，当父组件重新渲染时，子组件也会重新渲染
    2. vue3，可以单独渲染父组件和子组件
  - 静态树提升：vue3编辑器能够检测到什么是静态组件，然后将其提升，从而降低了渲染成本
  - 静态属性提升
- tree-shaking使Vue更小：可以支持按需引入，需求的模块才会被打包进去
- ps：静态节点，如果子节点都为静态节点，那么父节点为静态节点，否则就不是
# 其他
## 浏览器缓存
![avatar](https://upload-images.jianshu.io/upload_images/3174701-8e74b69ad9376710?imageMogr2/auto-orient/strip|imageView2/2/format/webp)<br>
- 浏览器每次发起请求时，都会先在浏览器缓存中查询该请求结果和缓存标识
- 浏览器每次拿到返回结果，都会将返回结果和缓存标识存入浏览器缓存中
### 缓存位置
- memory cache: 内存缓存，读取高效，缓存持续性比较短，随着进程结束而结束
- disk cache：存储在硬盘中的缓存，读取缓存，但是胜在存储容量和时效上
- push cache：推送缓存（http2），前边缓存没有命中的情况下，才会使用此缓存；一旦会话结束，缓存就会被释放，缓存时间也比较短。在Chrome只有5分钟
### 缓存策略
- 强缓存
  1. expire：过期时间，`expire = max-age + 请求时间`，在过期之前浏览器都会从浏览器缓存中获取返回结果
  2. cache-control：`no-cache`客户端缓存内容，是否使用缓存则需要经过协商缓存来验证决定。**设置了no-cache，浏览器也会缓存结果，只是需要通过协商缓存确定数据是否和服务器还保持一致 **
  3. cache-control优先于expire；强缓存只关心缓存的数据是否超出某个时间或者时间段，而并不关心服务器数据是否已经更新；所以可能导致浏览器并没有获取到服务器端最新数据
- 协商缓存：强缓存失效后，浏览器端携带缓存标识向服务器发起请求，服务器会根据缓存标识判断是否需要是否缓存
  - 协商缓存生效，返回304和Not Modified
  - 协商缓存失效，返回200和请求结果
  1. `Last-Modified 和 If-Modified-Since`
  浏览器第一次访问资源时，返回结果中，response header中携带Last-Modified，此值是资源在服务器上的最后修改时间，浏览器收到后缓存结果和header。<br>
  浏览器下次请求此资源时，检测到缓存了`Last-Modified，会在请求头中携带If-Modified-Since = Last-Modified，向服务器发送请求；服务器收到后将If-Modified-Since和服务器上资源的最后修改时间作对比，如果没有修改，返回304和空响应体；否则返回200和新的资源；
  2. `ETag 和 If-None-Match`
  **Etag是服务器响应请求时，返回当前资源文件的一个唯一标识(由服务器生成)，只要资源有变化，Etag就会重新生成。**当浏览器下次请求资源时，会携带If-None-Match=ETag，服务器只要将If-None-Match和服务器上该资源的ETag作对比就行。
  3. 对比
  - 精度上，ETag高于Last-Modified
  `Last-Modified`时间是秒级别，如果资源修改时间小于一秒，那么Last-Modified并不能体现出资源的修改；如果是负载均衡的服务器，各个服务器生成的Last-Modified也有可能不一致
  - 性能上，Etag要逊于Last-Modified，毕竟Last-Modified只需要记录时间，而Etag需要服务器通过算法来计算出一个hash值。
  - 优先级：服务器校验优先考虑Etag
### 用户行为对浏览器缓存的影响
- 打开网页，输入地址栏：查找disk cache中是否有匹配，有就是用；没有的话发送网络请求
- 普通刷新：因为没有关闭tab，所以memory cache是可用的，优先使用；其次才是disk cache
- 强制刷新：浏览器不使用缓存，服务器直接返回200和请求内容
## url输入到浏览器网址中，到页面加载出来 发生了什么
- 查看缓存，有的话直接访问；
- DNS解析，将域名解析为具体的IP
- 建立TCP链接
- 浏览器发送http请求
- 服务器接收请求数据处理并返回
- 浏览器接收返回结果，并对返回结果HTML进行解析，渲染页面
- 释放连接
### tcp三次握手
- 客户端发送请求，要求建立链接(syn=1)，并发送数据包seq: 客户端SYN-sent, 服务器LISTEN
- 服务器收到请求后，确认建立链接（ACK=1），并发送数据包seq和ack:服务器SYN_RECV
- （再次核对）客户端收到返回，确认ACK和第一次发送的数据包seq；确认后再次发送服务器的数据包和ACK，服务器收到确认后连接建立成功: 客户端和服务器端都进入ESTABLISHED状态
  1.SYN：用于建立连接。
  2.ACK：用于确定收到了请求。
  3.seq：发送自己的数据。
  4.ack：发送接收到的对方的数据。
### tcp四次挥手
- 客户端发送请求，要求释放连接（FIN），并发送数据包seq: 此时客户端停止向服务端发送数据，但是依然可以接收服务端返回的数据
- 服务端收到请求后，确认客户端想要释放连接（ACK = 1）,服务器进入半关闭状态
- 服务端自从发送ACK确认报文后，做好了释放连接的准备，再次向客户端发送报文（FIN,ACK）：告诉客户端已经做好释放连接的准备了
- 客户端收到请求后，确认服务端已经做好准备，并向服务端发送请求；服务端收到后，正式确认关闭服务端到客户端的连接
## 浏览器渲染
### DOMContentLoaded VS load
- DOMContentLoaded: HTML文档解析并加载完成，当所有js同步代码执行完毕，触发DOMContentLoaded；无需等待样式表、图像和子框架完成加载
- load: 页面js、css、图片等所有资源都加载完成后触发load事件<br>

**重要概念**
- DOM构建
  将文档中的所有DOM元素构建成一个树形结构，DOM树构建是自上而下进行构建的，会受到js执行的干扰
- CSS构建
  将文档中所有的css资源合并
- render树
  将DOM树和CSS合并为一课渲染树，render树会在合适的时机渲染到页面上<br>

**DOM解析过程**
1. 解析HTML结构
2. 加载外部脚本和样式表文件
3. 解析并执行脚本代码
4. DOM树构建完成     //DOMContentLoaded
5. 加载图片等外部文件
6. 页面加载完毕      //load
```
<body>
  <!-- 白屏 -->
  <div id="div1"></div>
  <!-- 白屏 -->
  <link rel="stylesheet" href="./c1.css" />
  <!-- 白屏 -->
  <link rel="stylesheet" href="./c3.css" />
  <!-- 如果此时 j1.js 尚未下载到本地，则首次渲染，此时的 DOM 树 只有 div1 ，所以页面上只会显示 div1，样式是 c1.css 和 c3.css 的并集。-->
  <!-- 如果此时 j1.js 已经下载到本地，则先执行 j1.js，页面不会渲染，所以此时仍然是白屏。-->
  <!--下面的 js 阻塞了 DOM 树的构建，所以下面的 div2 没有在文档的 DOM 树中。 -->
  <script src="http://test.com:9000/mine/load/case2/j1.js
  "></script>
  <!-- j1.js 执行完毕，继续 DOM 解析，div2 被构建在文档 DOM 树中，此时页面上有了div2 元素，样式仍然是 c1.css 和 c3.css 的并集 -->
  <link rel="stylesheet" href="./c4.css" />
  <!-- c4.css 加载完毕，重新构建render树，样式变成了 c1.css、c3.css 和 c4.css 的并集 -->
  <div id="div2"></div>
  <script>
  // 利用 performance 统计 load 加载时间。
    window.onload=function(){console.log(performance.timing.loadEventStart - performance.timing.fetchStart);}
  </script>
</body>
```
**渲染进程**
- GUI渲染线程
  1. 解析HTML文档为DOM树
  2. 解析CSS构建cssom树
  3. 合并DOM树和cssom树为渲染树
  4. 计算布局样式，绘制在页面上
- js引擎线程：负责处理执行JavaScript脚本
- 事件触发线程：控制事件，当事件触发时，将事件的处理函数放入到任务队列中，等待js引擎线程空闲时执行
- 定时器触发线程：开了单独的线程来计时，符合条件的定时器处理函数会被放入到任务队列中
- 异步http请求线程：当请求readyState状态变更时，将回调函数放入到任务队列中<br>

**注意事项**
- GUI渲染线程和js引擎线程是互斥的：Javascript可以操作DOM，如果js引擎线程修改元素时，渲染线程依然执行，那会导致渲染线程前后获得的元素数据可能不一致
- css加载不会阻塞DOM树解析，但是会阻塞DOM树渲染：加载css时，可能会修改DOM节点样式，如果css加载不阻塞DOM树渲染，那么当css加载完之后，render树可能要重绘或者回流<br>

**减少白屏时间**
- 减少渲染阻塞
  1. 减少head标签的JS阻塞：将script标签放在body之后；给script标签加defer属性，异步加载
  2. 减少head标签中css资源：尽可能减少css代码量；css中尽量不要放太多base64图片
- 压缩和缓存：利用压缩减少文件的体积；使用etag开启缓存
  1. 静态文件缓存方案：hash+强缓存方案
- 使用CDN(基于http2协议)：提高资源加载速度
- 使用骨架层：在首屏加载完成之前，只用占用符元素进行占位（如loading等）
- 其他：
  1. HTML结构不要嵌套太多层
  2. css选择器尽量简单，别太复杂
  3. js不要滥用闭包，会加长作用域链变量查找时间<br>

**JS加载 defer&async**<br>
https://www.cnblogs.com/jiasm/p/7683930.html
- 普通js：一旦遇到js文件，会阻塞后续DOM渲染，开始加载js文件，加载完之后执行<br>
![avatar](https://user-images.githubusercontent.com/9568094/31621391-39849b1a-b25f-11e7-9301-641b1bc07155.png)
- defer：不会阻塞后续DOM渲染。文档解析时，遇到defer脚本，会在后台异步进行下载；当页面解析&渲染完毕后，会等所有defer脚本加载完成后按照顺序执行，执行完毕后触发DOMContentLoaded<br>
![avatar](https://user-images.githubusercontent.com/9568094/31621324-046d4a44-b25f-11e7-9d15-fe4d6a5726ae.png)
- async：不会阻塞后续DOM渲染。文档解析时，遇到async脚本，会在异步进行下载，下载完成后立即执行，不计入DOMContentLoaded事件统计<br>
![avatar](https://user-images.githubusercontent.com/9568094/31621170-b4cc0ef8-b25e-11e7-9980-99feeb9f5042.png)
## 浏览器多进程
**以Chrome为例**
在Chrome中，主要进程有4个：<br>
- 浏览器进程：主要负责界面显示、用户交互、子进程管理，同时提供存储等功能
- 渲染进程：核心任务是将 HTML、CSS 和 JavaScript 转换为用户可以与之交互的网页，排版引擎 Blink 和 JavaScript 引擎 V8 都是运行在该进程中，默认情况下，Chrome 会为每个 Tab 标签创建一个渲染进程。出于安全考虑，渲染进程都是运行在沙箱模式下。
- 插件进程：主要是负责插件的运行，因插件易崩溃，所以需要通过插件进程来隔离，以保证插件进程崩溃不会对浏览器和页面造成影响
- GPU进程：负责处理整个应用程序的GPU任务
- 网络进程。主要负责页面的网络资源加载，之前是作为一个模块运行在浏览器进程里面的，直至最近才独立出来，成为一个单独的进程。
## 垃圾回收
### 垃圾回收策略
- 标记清除
当变量进入环境时，就将这个变量标记为“进入环境”。从逻辑上讲，永远不能释放进入环境的变量所占用的内存，因为只要执行流进入相应的环境，就可能会用到它们。而当变量离开环境时，则将其标记为“离开环境”。<br>
垃圾收集器在运行的时候会给存储在内存中的所有变量都加上标记（当然，可以使用任何标记方式）。然后，它会去掉环境中的变量以及被环境中的变量引用的变量的标记。而在此之后再被加上标记的变量将被视为准备删除的变量，原因是环境中的变量已经无法访问到这些变量了。最后，垃圾收集器完成内存清除工作，销毁那些带标记的值并回收它们所占用的内存空间。<br>
- 引用计数（不常用）
无法解决循环引用问题：如果循环引用导致两个变量的引用次数不为0，而不被回收
### 内存泄漏
- 意外的全局变量导致内存泄漏
```
function fun() {
  a = 2;
}
fun();
console.log(a);
```
- 未销毁的定时器造成内存泄漏
```
function fun() {
  return 2;
}
let txt = fun();
setTimeout(function() {
  let el = document.getElementById('app');
  app.innerHTML = txt;
}, 3000)
```
如果之后删除了appDOM元素，那么定时器失效；如果没有删除定时器，那么定时器依然有效，占据内存，也会使得定时器函数中的依赖不能回收；并且函数fun也不能回收；
- DOM引用
- 闭包，如事件处理回调
https://mp.weixin.qq.com/s?__biz=MzAxODE2MjM1MA==&mid=2651562406&idx=2&sn=4d4febaa377db6cd02cbb660fd88402b&chksm=80257667b752ff71c7683e88853ce4da54d5b226f675a238306e242a3dcb09dd9e7a84fe9330&scene=21#wechat_redirect
## git reset && git revert
https://segmentfault.com/a/1190000019153248
- git reset [commitid]: 将版本回退至指定的commit，指定commit后的操作将被撤销
- git revert [commit]：撤销指定commit的操作，并生成一个新的commit；指定commit版本之后的操作不受影响
**`git revert -n [commit]`** -n表示 --no-commit 不会生成新的commit
## git reset 
https://www.cnblogs.com/little-ab/p/11405672.html
- hard: 清空暂存区和工作区
- soft：将reset的内容放到暂存区，工作区保持不变
- mixed: 将reset的内容放到工作区，暂存区清空
## git checkout
https://www.jianshu.com/p/37f3a7e4a193
## 浏览器进程/线程模型
https://blog.csdn.net/qiuchangjun/article/details/79761242
## 事件循环
### 浏览器事件循环
浏览器事件循环异步队列：宏任务队列和微任务队列。
- 宏任务队列：setTimeout、setInterval、script整体代码、I/O操作等
- 微任务队列：new Promise.then、mutationObserver(监测DOM变化)
![avatar](https://user-gold-cdn.xitu.io/2019/1/10/1683863633586974?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
### node事件循环
https://zhuanlan.zhihu.com/p/54882306
Node事件循环异步队列：宏任务队列和微任务队列
- 宏任务队列：setTimeout、setInterval、 setImmediate、script（整体代码）、 I/O 操作
- 微任务队列：process.nextTick、new Promise().then(回调)

### 区别
- microtask执行时机：浏览器环境，微任务队列是在每个宏任务执行完后执行；Node环境，微任务队列是在事件循环的各个阶段之间执行，也就是一个阶段执行完，就会执行微任务队列
```
setTimeout(()=>{
    console.log('timer1')
    Promise.resolve().then(function() {
        console.log('promise1')
    })
}, 0)
setTimeout(()=>{
    console.log('timer2')
    Promise.resolve().then(function() {
        console.log('promise2')
    })
}, 0)
```
**浏览器执行结果：** `timer1、promise1、timer2、promise2`<br>
**node执行结果：**<br>
1、node11版本：`timer1、promise1、timer2、promise2`，和浏览器环境一致<br>
2、node10及以下版本：<br>
如果是第二个定时器还未在完成队列中，最后的结果为timer1=>promise1=>timer2=>promise2<br>
如果是第二个定时器已经在完成队列中，则最后的结果为timer1=>timer2=>promise1=>promise2<br>
- process.nextTick：node环境中每个阶段完成后，如果存在nextTick队列，就会清空队列中所有回调函数，并且优先于其他微任务队列执行
# 网络
## http2
## tcp三次握手 四次挥手
## http 和 https的区别
- http是超文本传输协议，使用明文进行信息传输；https是基于ssl的加密传输协议
- http和https使用的端口不同， http是80端口，https是403端口
- http连接简单，无状态；https是由ssl和http构建的可进行加密传输、身份认证的网络协议，比http更安全
### 对称加密 和 非对称加密
- 对称加密：进行加解密的密钥是一样的
- 非对称加密：使用公钥加密，私钥解密；公钥是公开的，私钥是私密的
### https建立过程
- 客户端向服务器发送请求（并携带客户端可支持的加密协议和版本）
- 服务器返回到客户端ssl证书（证书中携带公钥、服务器IP、证书过期时间等）
- 客户端接收到证书之后，到第三方证书验证中心进行验证，验证通过之后获取到服务器公钥；并随机生成随机数，用服务器公钥进行加密，发送给服务器
- 服务器收到加密后的随机数，利用私钥解密得到真正的随机数；随后这个随机数当做私钥对传输的数据进行加密
- 客户端收到数据后，利用私钥（生成的随机数）进行解密并且呈现给用户
- ssl加密建立
## keep-alive
希望在短时间内复用连接，在加载同一个网页中的内容时，尽量复用连接
```
HTTP的Keep-Alive是HTTP1.1中默认开启的功能。通过headers设置"Connection: close "关闭
在HTTP1.0中是默认关闭的。通过headers设置"Connection: Keep-Alive"开启。
```
### http1.1存在的效率问题
- 串行的文件传输
- 连接数过多

### http2多路复用
- 并行传输数据：http2基于二进制数据帧和流的概念，对数据实现并行传输；其中帧可对数据进行顺序标识，浏览器在收到数据后可按照序列对数据进行排序合并。
- 减少连接数：对同一域名只建立一路连接
# node
## koa
- 创建http server
- 构造request、response、context对象
- 中间件处理机制
```
app.use(async function(ctx, next) {
  console.log('f1 start');
  await next();
  console.log('f1 end');
})
app.use(async function(ctx, next) {
  console.log('f2 start');
  await next();
  console.log('f2 end');
})
app.use(async function(ctx, next) {
  console.log('f3 start');
  await next();
  console.log('f3 end');
})

f1(ctx, next) {
  console.log('f1 start');
  async f2(ctx, next) {
    console.log('f2 start');
    async f3(ctx, next) {
      console.log('f3 start');
      await Promise.resolve();
      console.log('f3 end');
    }
    console.log('f2 end');
  }
  console.log('f1 end');
```
- 错误处理
  
## koa和express的区别
- 中间件区别
  1. koa中间件执行是洋葱圈模型：基于async/await（promise）以同步的方式管理异步代码，可以等待异步操作
  2. express中间件：基于回调函数同步的，不会等待异步；如果有异步，会引起执行顺序上的困惑
```
const Express = require('express')
const app = new Express();
const sleep = () => new Promise(resolve => setTimeout(function(){resolve(1)}, 2000))
const port = 3000

function f1(req, res, next) {
  console.log('f1 start ->');
  next();
  console.log('f1 end <-');
}

function f2(req, res, next) {
  console.log('f2 start ->');
  next();
  console.log('f2 end <-');
}
async function f3(req, res) {
  //  express不会等待异步
  await sleep();
  console.log('f3 service...');
  res.send('Hello World!')
}

app.use(f1);
app.use(f2);
app.use(f3);
app.get('/', f3)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//执行结果：f1 start -> f2 start -> f2 end <- f1 end <- f3 service...
```
- 响应处理
  1. Koa：以ctx.body进行设置，但是**并不会立即响应**，等到所有中间件执行完之后才会响应
```
fnMiddleware(ctx).then(handleResponse)

function respond(ctx) {
  ctx.send(ctx.body);
}
```
  2. express：直接操作res对象，直接ctx.send就响应了；虽然剩余中间件还会继续执行，但是不能影响最终的响应结果；所以express通常在最后一个中间件设置响应结果
## npm install
### npm模块安装机制
- 发出npm install命令
- 查询node_modules目录中是否存在该模块
  - 若存在，不再重新安装
  - 若不存在，
    1. npm向registry查询模块压缩包的网址
    2. 下载压缩包，存放到根目录的.npm目录里
    3. 解压压缩包到当前的node_modules的目录中
### npm install下载原理
- 执行工程自身npm preinstall
- 确定首层依赖模块<br>
  确定工程中的首层依赖模块，也就是dependencies和devDependencies中指定的模块；工程本身是整棵依赖书的根节点，每个首层依赖模块都是根节点下的一课子树，npm会开启多进程从每个首层依赖模块开始逐步查找更深层级的节点
- 获取模块
  1. 获取模块信息<br>
    首先确定版本信息，如果有版本描述文件（如package-lock.json)，直接获取模块信息即可；否则从远程仓库获取。
  2. 获取模块实体<br>
    模块信息中包含模块压缩包地址（resolve字段），npm用此地址检查本地缓存，如果有直接从缓存中拿，否则从远程获取
  3. 查找该模块依赖
    如果该模块有依赖，回到第1步
- 模块扁平化<br>
  上一步获取到完整的模块依赖树，但是其中有重复模块，因为需要对齐进行去重<br>

**原本依赖树：**
```
node_modules
-- foo
---- lodash@version1

-- bar
---- lodash@version2
```
**如果version1和version2是兼容版本，则**
```
node_modules
-- foo

-- bar

-- lodash（保留的版本为兼容版本）
```
**如果version1和version2是不兼容版本，则**
```
node_modules
-- foo
-- lodash@version1

-- bar
---- lodash@version2
```
- 安装模块<br>
  更新工程中node_modules目录，并执行模块中的声明周期函数（preinstall, install, postinstall）
- 执行自身声明周期<br>
  当前 npm 工程如果定义了钩子此时会被执行（按照 install、postinstall、prepublish、prepare 的顺序）
- 生成或更新版本描述文件
# ES6
## Array.from
`Array.from`用于将类数组对象（如DOM集合nodeList）和可遍历（iterable）对象（如Set和Map)转换为真正的数组
**用法：** `Array.from(arrayLike[, mapFunction[,thisArg]])`
- arrayLike: 必传参数，表示类数组对象或者可遍历对象
- mapFunction: 可选参数，`mapFunction(item, index){...}`是在集合中的每个项目上调用的函数。返回中将插入到新集合中
- thisArg: 可选参数，执行回调函数`mapFunction`时this对象，此参数很少用
### 1、将类数组转换为数组
```
Array.from(arguments)   //将类数组对象arguments转换为数组
Array.from('hello')     // ['h', 'e', 'l', 'l', 'o']
var set = new Set(['a', 'b'])
Array.from(set)         // ['a', 'b']

var map = new Map();
map.add('one', 1)
map.add('two', 2);
Array.from(map);        // [['one', 1], ['two', 2]]
```
### 2、克隆数组
**数组浅拷贝**
```
var arr = [1,2,3]
var cloneArr = Array.from(arr)

arr === cloneArr  //false
```
**数组深拷贝**
```
function recursiveClone(val) {
  return Array.isArray(val) ? Array.from(val, recursiveClone) : val;
}
var arr = [1, [2, 2.2], 3, [4, [5,6]]]
var arr1 = recursiveClone(arr);
arr[1] === arr1[1]    //false
```
### 3、数组去重
```
function unique(arr) {
  return Array.from(new Set(arr));
}
var arr = [1, 2, 3, 3, 2, 4, 5, 6]
unique(arr)   // [1,2,3,4,5,6]
```
### 4、使用值填充数组
```
let length = 3;
let init = 1;
Array.from({length}, () => init)  //[0, 0, 0]
```
## 观察者模式 VS 发布订阅模式
观察者模式：由观察目标直接触发观察者的处理函数进行相关处理；观察者和观察目标之间存在依赖
发布订阅模式：有统一的调度中心，由调度中心负责发布和订阅相关事宜。如nodeJS和jQuery中的事件模型
## class
### 对比ES5
```
/* 
1) 类内部定义的方法不可枚举
2) 不存在提升，保证继承性
3）静态方法通过类访问，不可通过类构造的实例访问
4）class声明中使用严格模式
5）必须使用new调用class类
6）class中所有方法没有prototype属性
*/
class Person {
  static fun() {
    return 'hello world';
  }
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}

typeof(Person)  //function
Person.prototype.constructor === Person  //true
```
等价于
```
//es5中原型对象上的方法是可枚举的
function Person(name) {
  this.name = name;
}
Person.prototype.getName = function() {
  return this.name;
}
```
### class继承
```
class A {}
class B extends A {}

B.__proto__ === A  // true
B.prototype.__proto__ = A.prototype
```
extends继承实现
```
class A {
}

class B {
}

// B 的实例继承 A 的实例
Object.setPrototypeOf(B.prototype, A.prototype);

// **B 继承 A 的静态属性** 
Object.setPrototypeOf(B, A);

const b = new B();
```
`Object.setPrototypeOf`的实现
```
Object.setPrototypeOf = function(obj, proto) {
  obj.__proto__ = proto;
  return obj;
}
```
## 箭头函数
- 函数体内this对象，指的是定义时所在的对象，而不是使用时的对象
- 不可以使用arguments对象，函数体内不存在该对象；可以用rest代替
- 不可使用yield命令，箭头函数不能用作Generator函数
- 不可使用new命令
1）没有自己的this，无法调用call、apply；从自己的作用域链的上一层继承this<br>
2）没有prototype属性
## for in 和 for of的区别
- for in遍历的是索引即键值，for of遍历的是value值
- for in遍历顺序有可能不是按照数组内部的实际顺序
- for in会遍历原型上的属性和方法，需要配合hasOwnProperty判断某属性是否是该对象的实例属性
- for of不能遍历普通对象，只能遍历拥有迭代器对象的集合
## 模块化
### 运行时加载 VS 编译时加载
- 运行时加载：CommonJS 和 AMD
```dotnetcli
// CommonJS模块
let { stat, exists, readfile } = require('fs');

// 等同于
let _fs = require('fs');
let stat = _fs.stat;
let exists = _fs.exists;
let readfile = _fs.readfile;
```
整体加载fs模块，生成一个对象_fs;然后再从_fs对象上读取方法
- 编译时加载：ES6
```dotnetcli
import { stat, exists, readFile } from 'fs';
```
从fs模块直接加载3个方法，其他方法不加载

### node模块 和 es6 模块区别
# webpack
## webpack构建流程
- 1、初始化参数：从配置文件和shell语句读取参数并合并，得出最终参数；
- 2、开始编译：用上一步得到的参数初始化compiler对象，加载所有配置的插件，执行对应的run方法开始编译
- 3、确定入口：通过entry找到所有入口文件
- 4、编译过程：从入口文件出发，调用对应的loader对模块进行编译；再找出该模块所有依赖的模块，递归本步骤直至所有入口文件都经过了本步骤的处理
- 5、完成编译模块：经过第4步使用loader编译所有模块后，得到了每个模块编译后的内容和他们之间的依赖关系
- 6、输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的chunk，再把每个chunk转换成一个单独的文件加入到输出列表中
- 7、完成输出：确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统
## HMR相关中间件
- webpack-dev-middleware<br>
一个express的中间件，主要核心功能：通过`file-loader`内部集成了node的`memory-fs/memfs`内部文件系统，直接将资源存储到内存中；通过watch监听文件的变化，动态编译
- webpack-hot-middleware：实现页面的热重载<br>
核心是为webpack提供服务端和客户端的通信机制，内部通过`window.EventSource`实现。<br>
在webpack第一次打包时，除了代码本身之外，还包含一部分HMRruntime订阅服务代码；HMRruntime订阅服务端的变化，触发HMR runtime API拉取最新的资源模块
- webpack-dev-server<br>
内置了`webpack-dev-middleware`和`express`服务，通过`webpack-dev-middleware`提供文件的监听和编译；利用express提供http服务，底层利用websocket代替`window.EventSource`实现服务端和客户端之间的通信机制
## webpack热更新
**热更新配置**<br>
- 1、使用`hotModuleReplacementPlugin`插件
在`webpack.config.js`中加入：
```
module.exports = {
  // ...
  plugins: {
    new webpack.hotModuleReplacementPlugin(),
    // ...
  }
}
```
- 2、开启`webpack-dev-server`热更新开关
```
module.exports = {
  // ...
  devServer: {
    hot: true,
    // ...
  }
}
```
**原理解析**
![avatar](https://segmentfault.com/img/remote/1460000022485389/view)
- `webpack` webpack第一次编译打包，将结果存储在内存中（相对于磁盘读写速度更快），使得浏览器能够通过访问服务器获取资源（bundle.js）; 浏览器获取的资源除了代码本身之外，在打包阶段还被注入了HMR runtime代码，作为浏览器和webpack服务端通信的客户端
- 更新：文件系统中文件发生变化，webpack监听到文件变化重新编译打包；每次编译生成唯一的hash值，根据变化的内容生成两个补丁文件：说明变化内容的manifest（文件格式为hash.hot-update.json, 包含了hash和chunkId）和chunk.js(hash.hot-update.js)
- webpack-dev-middleware 调用 webpack 暴露的API对代码变化进行监控， 一旦监听到文件变化，便通知浏览器进行live reload
- HMR-server通过websocket将manifest推送给浏览器
- 浏览器端HMR runtime根据manifest的hash和chunkId拉取最新的chunk.js(通过jsonp请求)
- HotModuleReplacement.runtime 对模块进行热更新
## 常见loader
- file-loader: 把文件输出到一个文件夹中，在代码中通过相对URL去引用输出的文件
- url-loader: 和file-loader类似，但是能在文件很小的情况下，将文件以base64方式把文件内容注入到代码中去
- babel-loader: 将es6转换成es5
- css-loader: 加载css，支持模块化、压缩、文件导入等特性
- style-loader: 将css代码注入到JavaScript中，通过DOM操作去加载css(在DOM中插入style标签)
- vue-loader: 解析和转化.vue文件，提取出每个语言快（js、css和模板），有必要就交给对应的loader进行解析
## 利用webpack优化前端性能
指的是优化webpack的输出结果，使得打包的最终结果可以在浏览器快速高效运行<br>
- 压缩代码。删除多余的代码、注释、简化代码的写法等等方式。可以利用webpack的UglifyJsPlugin和ParallelUglifyPlugin来压缩JS文件， 利用cssnano（css-loader?minimize）来压缩css
- 利用CDN加速。在构建过程中，将引用的静态资源路径修改为CDN上对应的路径。可以利用webpack对于output参数和各loader的publicPath参数来修改资源路径
- 删除死代码（Tree Shaking）。将代码中永远不会走到的片段删除掉。可以通过在启动webpack时追加参数--optimize-minimize来实现
- 提取公共代码。
## 按需加载
## webpack plugin实现原理
## webpack loader实现原理
# css
## BFC：块级格式上下文，相当于独立的容器，里边的元素和外部的元素相互不受影响
### 创建BFC的方式
- html根元素
- float浮动
- 绝对定位（absolute和fixed）
- overflow不为visible
- display为表格布局或者弹性布局
### BFC特性
- 内部box在垂直方向一个接一个放置；同一个BFC内，相邻块级盒子外边距垂直外边距会有重叠
- 形成了BFC的区域不会与float box重叠
- BFC在计算高度时，会把浮动元素也计算在内（可解决高度塌陷问题）
## flex
### flex容器属性
- flex-direction: 主轴方向 row | row-reverse | column | column-reverse
- flex-wrap: 换行方式 nowrap(不换行) | wrap(换行，第一行在上方) | wrap-reverse（换行，第一行在下方）
- flex-flow: <flex-direction> || <flex-wrap>;
- justify-content: 项目在主轴的对齐方式 flex-start | flex-end | center | space-between | space-around
- align-items: 项目在交叉轴的对齐方式 flex-start | flex-end | center | baseline | stretch
### 项目的属性
- order：项目的排列顺序，数值越小，越往前排；默认为1
- flex-grow：项目的放大比例，默认为0，即如果有剩余空间，也不会放大
- flex-shrink：项目的缩小比例，默认为1，剩余空间不足时，会缩小
- flex-basis：在分配多余空间之前，项目占据的主轴空间
- flex：none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
- align-self：允许项目与其他项目不一样的对齐方式，可覆盖align-items属性
# js基础
## 事件委托
### 原理
利用事件的冒泡机制，在具有冒泡行为的事件上，子元素的事件触发会冒泡到父元素上，因为可以通过监听父元素的触发事件来实现对子元素事件的委托
### 常用场景
- 需要对大量子元素进行事件绑定时，可以讲事件委托到父元素上
```
<ul id="parent">
<li>1</li>
<li>2</li>
<li>3</li>
<li>4</li>
</ul>
<script>
// 与其对li逐个监听，可以使用委托其父元素完成一次监听
parent.addEventListener("click",(e)=>{
  if(e.target.nodeName === 'LI'){
     // 对点击的li元素的逻辑处理
  }
})
</script>
```
- 监听动态生成的元素
# 业务
## 一点号强制用户刷新页面（上线增加版本号概念）