# es6
## Set、Map、WeakSet、WeakMap
### Set
- Set成员值都是唯一的
### WeakSet
- 成员只能是对象
- 不能遍历，这决定了其没有values、keys、entries方法，同时也没有size属性<br>
原因：因为WeakSet成员对象都是弱引用，随时可能被垃圾回收（垃圾回收机制运行时间取决于浏览器）。这意味着其成员个数不固定，可能会随时消失
## `for in` VS `for of`
- for in可遍历对象，也可遍历数组，但更适合遍历对象
- for in遍历数组所有可枚举属性，包括原型；若不想遍历原型方法和属性，可用`hasOwnProperty`进行过滤
```
var arr = [1, 2, 3];

// for in遍历数组可能的问题
for(let i in arr) {
  console.log(i + 1); // 01 11 21
}

// 遍历可枚举属性
Array.prototype.a = 'a';
for(let i in arr) {
  console.log(arr[i]); // 1, 2, 3, a
}
```
- for of遍历数组元素值，不包括原型属性和索引
## rest参数
- 表示方式：`...变量名`
- 用途：用于获取函数的多余参数；变量是一个数组，将函数多余参数都放入数组中
- 和arguments对比：arguments是类数组对象，若要使用数组方法，需要使用`Array.from`将其转换为数组；但rest参数本身就是数组，可以使用数组任何方法
```
// arguments变量
function sort() {
  Array.from(arguments).sort();
}

// rest变量
function sort(...numbers) {
  numbers.sort();
}
```
## 观察者模式 VS 发布订阅模式
- 观察者模式：观察者(Observer)直接订阅主题(Subject)，当主题被激活时，触发观察者里的事件
```
// 观察者对象
class Observer {
  name = '';
  constructor(name) {
    this.name = name;
  }
  
  update() {
    console.log(`目标对象通知更新，我是${this.name}`);
  }
}

// 目标对象
class Subject {
  observers = [];
  constructor() {
    this.observers = [];
  }
  add(ob) {
    this.observers.push(ob);
  }

  remove(ob) {
    const idx = this.observers.findIndex(item => item === ob);
    idx > -1 && this.observers.splice(idx, 1);
  }

  notify() {
    for(const ob of this.observers) {
      ob.update();
    }
  }
}

const sub = new Subject();
const ob1 = new Observer('观察者1号');
const ob2 = new Observer('观察者2号');

sub.add(ob1);
sub.add(ob2);

sub.notify();

```
- 发布订阅模式：订阅者将自己想要订阅的事件注册到调度中心，当发布者发布事件到调度中心，也就是触发事件时，由调度中心统一调度订阅者注册到调度中心的回调。
```
# vue.js响应式的实现
# 发布者(观察者)
function defineReactive() {

}

# 调度中心
class Dep {

}

# 订阅者
class Watcher {

}
```
## es5类和es6 class区别
- class中定义的方法和属性不可枚举
- class中定义的方法没有prototype属性
- class类必须使用new调用，不能直接执行
- class类不存在变量提升
```
let p = new Person();

function Person(name) {
  this.name = name;
}

Person.prototype.getName = function() {
  console.log('name is:', this.name);
  return this.name;
}

p.getName(); // name is: undefined

let p1 = new Person();

class Person {
  constructor(name) {
    this.name = name;
  }

  getName() {
    console.log('es6 class name is:', this.name);
  }
}

p1.getName(); // Uncaught ReferenceError: Person is not defined
```
- class声明中使用严格模式
- class类中有静态方法，通过类直接访问
  
## es6 extends继承
```
class A {}

class B extends A {}

let a = new A(); // a.__proto__ === A.prototype
let b = new B(); // b.__proto__ === B.prototype

# 属性和实例方法继承(实例继承): B.prototype.__proto__ === A.prototype;
Object.setPrototypeOf(B.prototype, A.prototype);

# 由B.prototype.__proto__ === A.prototype === a.__proto__ => B.prototype 等同于a, 也就是说B.prototype是A的一个实例（类似es5的组合继承）

# 静态方法继承: B.__proto__ === A;
Object.setPrototypeOf(B, A);
```
## 箭头函数
- this指向定义时所在的对象，而不是使用时的对象
- 箭头函数没有arguments对象，可用rest参数代替
- 不可使用yield命令，箭头函数不能用作Generator函数
- 不能使用new命令
  - 没有自己的this，无法调用call、apply；从自己的作用域链的上一层继承this
  - 没有prototype属性
## Iterator
- 定义：是一种接口，为各种不同的数据结构提供统一的访问机制
- 作用
  - 为各种数据结构提供统一、简便的访问接口
  - 使得数据结构的成员能够按照某种次序排列
  - 新的遍历命令for...of循环，Iterator接口主要供for...of消费
- 可遍历：一种数据结构只要部署了Iterator接口，就称为可遍历；
  - es6规定，默认的Iterator接口部署在数据结构的Symbol.iterator属性上，也就是说数据结构若有Symbol.iterator属性，便可认为是“可遍历的”
  - Symbol.iterator属性值是一个**函数**，就是遍历器生成函数
- 原生具备Iterator接口的数据结构
  - Array
  - Map
  - Set
  - String
  - TypedArray
  - 函数的arguments对象
  - NodeList对象
```
function makeIterator2(arr) {
  let nextIndex = 0;
  return {
    next: function() {
      return nextIndex < arr.length
      ? { value: arr[nextIndex++]}
      : { done: true };
    }
  }
}
```
# 高阶函数
- 定义：对其他函数进行操作的函数，可以将他们作为参数传递或者直接返回。
- 条件：1、接受一个或者多个函数作为输入；2、输出一个函数；两者至少满足其一。
## 柯里化
```
柯里化是一种将多个参数的函数转换成一系列使用一个参数的函数，并且返回接受余下参数而且返回结果的新函数的技术
```
简言之，只传递函数一部分参数来调用它，让它返回一个新函数处理剩余参数。<br>
### 实际应用
- 延迟计算
```
```
# vue
## MVVM
- M(model)：数据层，关注数据本身  
  对应vue中的data、props属性  
- V(view)：视图层  
  对应vue中的template和style部分  
- VM(view-model)：业务逻辑层，实现双向绑定，保证view和model不会直接联系
  对应Vue的组件实例
### MVVM数据绑定实现要素
- 发布-订阅模式
- 数据劫持
### MVVM双向绑定实现要点
- 实现Observer，对数据对象所有属性进行劫持监听；
- 实现指令解析器compiler，对Vue每个元素节点的指令进行解析和执行，将指令模板的变量都替换成数据，然后渲染初始页面；并将每个指令对应的节点绑定更新函数，添加数据订阅者；一旦数据发生变化，收到通知更新视图；
- 实现订阅者watcher，watcher是observer和compiler的桥梁。主要任务：
  - 在自身实例化时在属性订阅器中添加自己
  - 数据发生变化收到通知时，调用自身update，并触发compiler中绑定的回调更新视图
## 生命周期
![avatar](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3eadd1ec0ac94343951ae2453cf41fce~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)  
### vue3
- onBeforeMount: 在组件挂载之前调用；组件已经完成响应式设置，但是还没有创建DOM节点，即将开始首次DOM渲染过程。在服务端渲染期间不会被调用
- onMounted: 在组件挂载完成后执行；通常用于执行需要访问组件所渲染的DOM树相关的副作用。**在服务端渲染期间不会被调用**
- onUnmounted: 组件实例卸载之后调用；子组件已经都被卸载，同时所有相关的响应式作用都已经停止；**通常用于清理副作用，如定时器、DOM事件监听器或者与服务器的连接等。**在服务端渲染期间不会被调用
- onBeforeUpdate: 在组件因响应式状态变更而需要更新其DOM树之前调用。在服务端渲染期间不会被调用
- onServerPrefetch: 注册一个异步函数，在组件实例在服务器上被渲染之前调用；通常用于执行一些服务端数据获取过程
### vue2
- beforeCreate: 在实例初始化之后，数据观测和响应式设置之前
- created: 在实例创建之后被立即调用，此时已完成数据观测、属性和方法的运算、响应式设置
- beforeMount: 在实例挂载之前调用，即将开始首次DOM渲染
- mounted: 实例挂载之后调用，真实DOM挂载完成
- beforeUpdate: 响应式状态变更导致DOM需要更新之前调用
- updated: 响应式状态变更导致DOM更新完成之后调用
- beforeDestroy: 组件实例卸载之前调用
- destroyed: 组件实例卸载之后调用，此时所有子组件都已被卸载 
## Vue父组件和子组件生命周期执行顺序
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
## vue插件
- 使用插件
```
Vue.use(MyPlugin);

new Vue({});
```
- 开发插件
```
MyPlugin.install = function(Vue, options) {
  // 添加全局属性或方法
  Vue.globalMethod = function() {};

  // 添加全局资源，如指令/组件等
  Vue.directive('my-directive', {

  });

  // 添加全局mixin
  Vue.mixin({
    created: function() {},
  })

  // 为Vue实例添加全局属性或方法
  Vue.prototype.$method = function() {}; // 继承
}

Vue.use(MyPlugin);
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
## vue3新特性
- 组合式API
  - 将零散的逻辑整合起来一起维护
  - 可将单独的功能逻辑拆分到单独的文件  
  - 对应vue2中mixin，缺点：1、命名冲突问题；2、暴露出来的变量作用不明确；
```
# 实现方式一: setup钩子
export default {
  setup() {
    const message = ref('');
    const showMessage = () => {
      console.log('message:', message);
    }

    return {
      message,
      showMessage,
    };
  }
}
# 实现方式二
<script setup>
```
- 生命周期变化
  - setup：在beforeCreate之前执行
  - beforeDestroy -> beforeUnmount、destroyed -> unmount
- 响应式数据声明：ref、reactive、toRefs(vue2定义在data属性中)
  - reactive: 本质是将普通对象封装为proxy；参数只能是对象或数组；
  - ref: 可将基本数据类型封装为响应式；如果是对象，底层本质还是reactive
```
ref(1) => reactive({value: 1});
```
- 数据侦听：watchEffect
  - 不需要手动传入依赖
  - 在实例初始化时会先执行一次收集依赖
  - watchEffect只能获取到更新后的值，不能获取更新前的值
- css中使用v-bind  
  - 支持javascript表达式，如v-bind('theme.fontSize')
  - 支持响应式
  - 实现原理：将自定义属性通过style应用于组件根元素，并在源值变更时响应式更新
- 响应式: vue3--proxy; vue2--Object.defineProperty
  1. proxy代理整个对象；Object.definedProperty监听对象的某个属性，在初始化时需要递归遍历进行绑定
  2. proxy只是原对象的代理，不会对原对象进行改动；Object.defineProperty是在原对象的基础上操作属性实现监听的效果，会改动原对象
  3. Object.defineProperty不能实现对新增对象属性的监听
  4. Object.defineProperty无法监听数组长度变化，同时也不能监听通过数组下标修改属性的行为；只能通过$set实现
- 组件
  1. teleport: 传送门 主要是用于类似dialog，希望在组件内使用dialog，但又希望渲染的dialog DOM结构不在组件内。此时便可以通过teleport传送到外层结构
  2. suspense: 异步组件，提供default和fallback两种状态；在异步等待时，渲染后备内容fallback；异步结束或者没有异步情况下渲染默认内容
- vue3组件可以有多个根节点
- 更好的tree-shaking，如Vue.nextTick,Vue.observable等，打包体积变化
- vue3提供更好的ts支持
```
<template>
  <div class="mod-bind-css">
    <div class="text">hello world</div>
    <div @click="changeColor">change color</div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
let color = ref('red');
const theme = {
  fontSize: '20px',
};

const changeColor = () => {
  color.value = 'green';
};
</script>
<style lang="scss">
.text {
  color: v-bind(color);
  font-size: v-bind('theme.fontSize');
}
</style>
```
## vue组件间通信
1. props和$emit(父子组件通信)
  - 父组件通过props传递数据到子组件
  - 子组件通过$emit向父组件通知消息
2. 事件总线Bus(父子通信、兄弟通信、跨级通信)  
**Vue2实现方式**
```
const eventBus = new Vue();
eventBus.$on('eventName', (data) => {});
eventBus.$emit('eventName', data);
```
**Vue3实现方式**
```
# 第三方插件：https://github.com/developit/mitt
import mitt from 'mitt';

const emitter = mitt();
emitter.on('eventName', (data) => {});
emitter.emit('eventName', data);
```
3. Vuex(父子通信、兄弟通信、跨级通信)  
Vuex和localStorage可配合使用。Vuex存储的数据是响应式的，不会保存起来，刷新之后会恢复到初始状态。因此**可在Vuex数据改变时将数据拷贝到localStorage中，刷新之后如果localStorage中有保存的数据，取出替换store中的state**
- Vuex集中存储和管理应用中所有组件的状态，主要用于组件间通信
- localStorage是一种本地存储，主要用于跨页面间通信
```
setStorage(key, data) {
  if (data === null) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, data);
  }
}
# 跨页面（监听窗口你）
subscribe(event, callback) {
  window.addEventListener('storage', (e) => {
    if (!e.newValue) return;
    if (e.key === event) {
      let { newValue } = e;
      try {
        newValue = JSON.parse(e.newValue);
      } catch (e) {}
      // console.error('Api subscribe', e.key, newValue);
      callback(newValue);
      this.setStorage(e.key, null);
    }
  });
}
# 跨页面（通知窗口）
notify(event, value) {
  let data = value;
  if (!data) {
    data = this.random(8);
  }
  if (Object.prototype.toString.call(data) === '[object Object]') {
    data = JSON.stringify(data);
  }
  // console.error('Api notify:', event, data);
  this.setStorage(event, data);
}
```
- Vuex可实现数据响应式，但localStorage不能
4. provide/inject(父子通信、跨级通信)  
允许父组件向其子孙组件注入依赖，不论组件层级有多深；提供了跨级组件间通信，主要是用于子组件获取上级组件的状态，跨级组件间建立了一种主动提供和依赖注入的关系。  
**注意：**provide/inject绑定并不是响应式的。
5. $parent/$children 与 ref(父子通信)  
- ref：如果在普通元素上使用，引用指向DOM元素；如果在组件上使用，引用指向组件实例
- $parent/$children: 访问父/子实例
## 插槽
用于组件接受模板内容，`<slot>`元素是一个**插槽出口**，标示了父元素提供的**插槽内容**将在哪里渲染  
### 作用域
插槽内容可以访问父元素的数据作用域，不可以访问子组件的数据。
### 插槽分类  
**1、默认插槽**  
```
// 子组件 submitButton
<button class="submit-btn"><slot></slot></button>

// 父组件
<submitButton>submit</submitButton>

// 解析后
<button class="submit-btn">submit</button>
```
**2、具体插槽**  
```
// 子组件 baseLayout
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>

// 父组件
<base-layout>
  <template v-slot="header">title</template>
  <div>main-content</div>
  <template v-slot="footer">footer</template>
</base-layout>
```
**3、动态插槽名**  
动态指令参数在v-slot也可以生效  
```
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>

  <!-- 缩写为 -->
  <template #[dynamicSlotName]>
    ...
  </template>
</base-layout>
```
**4、作用域插槽**  
默认情况下，插槽内容无法访问子组件数据，因此作用域插槽提供了一种方式，可以让插槽内容访问子组件数据  
```
# 子组件
<div>
  <slot :text="greetingMessage" :count="1"></slot>
</div>

# 父组件
<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>
```
## nextTick
https://juejin.cn/post/7089980191329484830  
![avatar](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5c6403a0259491fbe1d21fba66b4055~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)  
**作用**：延迟执行  
- DOM异步批量更新
  1. 当数据发生变化时，Vue开启一个队列(queueWatcher)缓存同一事件循环中的数据更新watcher
  2. 对于同一数据的更新只会缓存一次
  3. 当执行栈清空或者下次事件循环时，取出queueWatcher中回调执行实际操作，更新DOM
- 保证能够获取到更新后的DOM
## computed实现原理：响应式 && 缓存
https://zhuanlan.zhihu.com/p/357250216  
- computed是响应式
- computed具备缓存功能
- 依赖的data改变了，computed如何更新
case: 页面A引用computed B, computed B依赖data C  
1. data数据C改变 -> 通知computed B watcher更新，只会重置脏数据标志位dirty=true，不会计算值  
2. 通知页面watcher进行渲染更新，读取computed B, 然后computed B进行重新计算
## keep-alive
keep-alive是Vue的内置组件，可以将组件缓存在内存中，不需要重复创建组件
### 生命周期
- 首次渲染
beforeRouterEnter -> beforeCreate -> created -> beforeMount -> mounted -> activated -> …… -> beforeRouterLeave -> deactivated
- 激活
beforeRouterEnter -> activated -> …… -> beforeRouterLeave -> deactivated
### 原理实现
- 实现算法LRU(最近最少使用)
```
export default {
  created() {
    <!-- 创建缓存对象 -->
    this.cache = Object.create(null);
    this.keys = [];
  }

  mounted() {
    <!-- 监听include和exclude属性，根据规则变化进行缓存列表更新，将不需要的组件从缓存中删除 -->
    this.$watch('include', (val) => {
      pruneCache(this, name => matches(val, name));
    })

    this.$watch('exclue', (val) => {
      pruneCache(this, name => matches(val, name));
    })
  }

  destroyed() {
    <!-- 组件销毁时，将组件进行销毁 -->
    for (let key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  }

  render() {
    <!-- 在组件渲染时，会自动执行render函数，利用LRU算法对组件进行缓存 -->
    // 1、缓存的是VNode
    // 2、如果当前组件在缓存中，直接获取缓存 并更新其位置(将其放到队列的尾部)
    // 3、如果当前组件不在缓存中，对其进行缓存，若超出缓存列表长度，删除缓存中第一个
  }
}
```
## vue-router
为vue应用提供路由管理器，描述URL和UI的映射关系，即URL变化引起UI更新（无需刷新页面）
### 核心点
1. 如何实现改变URL而不引起页面刷新
2. 如何监听URL变化
### hash模式
1. url中hash以#开头，**hash改变时，页面不会刷新同时也不会向服务器发送请求**  
2. 通过`hashChange`事件来监听URL变化
### history模式
1. HTML5中提供了`pushState` 和 `replaceState`方法，**这两个方法改变URL不会引起页面刷新**
2. 通过`popState`事件来监听URL变化
   - 通过浏览器前进后退改变URL会触发popState
   - 通过pushState/replaceState 或者 a标签跳转不会触发popState;需要通过拦截pushState/replaceState和a标签的点击事件来监听URL的变化
   - 通过js调用history的back、go、forward触发popState
3、需要后端配合，提供404页面
### 完整的导航守卫流程
- `beforeRouterLeave`: 失活的组件中调用离开守卫
- `beforeEach`: 全局守卫
- `beforeRouterUpdate`: 在重用组件中吊样
- `beforeEnter`: 在路由配置里调用路由独享守卫
- 解析路由组件
- `beforeRouterEnter`: 在被激活的组价中调用
- `beforeResolve`: 在所有组件内守卫和异步路由组件被解析后调用全局守卫
- 导航被确认
- `afterEach`: 调用全局守卫
- 触发DOM更新
### 全局守卫
- beforeEach: 全局前置守卫
- afterEach: 全局后置守卫
- beforeResolve: 全局解析守卫
### route 和 router
- route: 路由信息对象，包括path、params、hash、query、name等
- router: 路由实例对象，包括路由跳转方法、钩子函数等
### 路由如何跳转
- 通过内置组件`<router-link to="/home"></router-link>`
- 编程式方式：`router.push` 和 `router.replace`
# js基础
## 数据类型
- 基本数据类型包括：String、Number、Boolean、undefined、null、Symbol(es6，表示独一无二的值)
- 引用类型：Object、数组、函数
## 特点
### 基本数据类型
- 值是不可变的
- 存放在栈区(栈：有结构，每个区块按照一定次序进行存放<后进先出>；栈的大小是固定的，超出浏览器规定的栈限制，就会报错Stack Overflow)
原始数据类型存放在栈区的简单数据段，占据空间小、大小固定、属于被频繁使用数据
- 比较：值的比较
```
var a = 1;
var b = true;

console.log(a == b); // true
console.log(a === b); // false

# == 只进行值的比较，会进行数据类型的转换
# === 不只进行值的比较，也会进行数据类型的比较
```
### 引用类型
- 值是可变的
- 存在在栈区(引用指针)和堆区(引用值)  
  堆：占据空间大，大小不固定；没有结构
- 比较：引用的比较
## 检查数据类型
- typeof：返回表示数据类型的字符串，返回结果包括string、number、boolean、undefined、symbol、function、object
```
typeof ''; // string
typeof 2; // number
typeof true; // boolean
typeof undefined; // undefined
typeof Symbol(); // symbol
typeof function() {}; // function
typeof null; // object
typeof []; // object
typeof {}; // object
typeof new Date(); // object
typeof new RegExp(); // object
```
- instanceof：A是否是B的实例，`A instanceof B`;
- 
## instanceof
`A instanceof B`, A是否是B的实例，也就是说A.__proto__ === B.prototype.  
缺点：  
- 对于基本数据类型，字面量方式创建的变量和实例方式创建的变量结果不一样
```
var a = 2;
var b = new Number(3);

a instanceof Number; // false
b instanceof Number; // true
```
- 只要在当前实例的原型链上，通过instanceof返回结果均为true。存在一定的不准确性
```
var arr = [];
arr instanceof Array; // true
arr instanceof Object; // true
```
- 不能检测null和undefined
## Object.prototype.toString.call()
- 对于Number、String、Boolean、Array、RegExp、Date、Function原型上的toString方法都是把当前数据转换为字符串
```
var arr = [1, 2]
arr.toString(); // "1, 2"

var date = new Date();
date.toString(); // "Mon Feb 20 2023 19:24:46 GMT+0800 (中国标准时间)"
```
- Object上的toString方法并不是用来转换为字符串: 返回当前方法执行主体(方法中的this)所属类的详细信息`[object Object]`
  - 第一个object: 代表当前实例是对象数据类型的
  - 第二个Object: 代表当前this所属的类是Object
```
Object.prototype.toString.call('') ;   // [object String]
Object.prototype.toString.call(1) ;    // [object Number]
Object.prototype.toString.call(true) ; // [object Boolean]
Object.prototype.toString.call(undefined) ; // [object Undefined]
Object.prototype.toString.call(null) ; // [object Null]
Object.prototype.toString.call(new Function()) ; // [object Function]
Object.prototype.toString.call(new Date()) ; // [object Date]
Object.prototype.toString.call([]) ; // [object Array]
Object.prototype.toString.call(new RegExp()) ; // [object RegExp]
Object.prototype.toString.call(new Error()) ; // [object Error]
Object.prototype.toString.call(document) ; // [object HTMLDocument]
Object.prototype.toString.call(window) ; //[object global] window是全局对象global的引用
```
## var && let && const
1. var定义的变量，`没有块的概念，可以跨块访问`，不能跨函数访问  
   let定义的变量，只能在块作用域进行访问，不能跨块访问，也不能跨函数访问  
   const用来定义常量，使用时必须初始化(必须赋值)，只能在块作用域访问，且不能修改
2. var可以`先使用，再声明`，因为存在变量提升；let必须声明后再使用
3. var允许在相同作用域中声明同一变量，而let和const不允许
4. 在全局上下文中，基于let声明的变量和全局对象没有任何关系；var声明的变量和全局对象有关系
5. let和const会产生暂时性死区：在变量声明之前，该变量都是不可用的
## 包装类型
包装类型即包装对象，当基本数据类型以对象的方式去使用时，js会将其先转换成对应的包装类型，操作完成后即刻销毁。  
`number`、`boolean`、`string`都有对应的包装类型
```
var str = 'hello world';
str.charAt(0); // 执行此语句时，js自动完成以下操作
(
  var _str = new String('hello world'); // 1. 通过对应的包装类型创建一个和基本类型值相同的对象
  _str.charAt(0); // 2. 通过包装类型对象调用对象下的方法
  _str = null; // 3. 销毁临时创建的包装类型对象
)
```  
**注意事项：** 对象的生存期，包装类型对象生存期只存在于代码执行的瞬间，执行完毕就会被销毁。  
## JS垃圾回收机制
### 垃圾回收机制
不再使用的变量，浏览器垃圾回收器会对其进行回收，释放内存。  
**1、如何回收垃圾**  
- 对垃圾进行标记，标记[不可达]变量
- 回收不可达值占用的内存空间
- 内存整理：频繁回收垃圾之后会产生内存碎片(不连续空间)；如果不进行内存整理，当需要较大连续内存时，就会出现内存不足。因此需要将空闲内容整理成连续空间  
**2、何时进行垃圾回收**  
- 浏览器进行垃圾回收的时候，会暂停 JavaScript 脚本，等垃圾回收完毕再继续执行  
- 分代收集、增量收集、闲时收集
### 垃圾回收算法
- 标记清除：变量在进入执行环境时，被标记为“进入环境”，当变量离开执行环境时，被标记为“离开环境”。垃圾回收机制会销毁那些带标记的值并回收它们所占的内存空间
- 查找引用(谷歌浏览器)：浏览器会不定时去查找当前内存的引用，如果没有被占用了，浏览器就会回收它
- 引用计数法：当前内存被占用1次，计数累加1，移除占用就减1，减到0时，浏览器就回收
### 内存泄漏
- 意外的全局变量
- 定时器
- 闭包
- DOM引用
- 事件绑定
## js中this应用场景
- 普通函数中this：指向window
- 当函数作为对象的方法访问：this指向当前对象
- 箭头函数中this: 指向箭头函数定义时所在的对象，若有嵌套，则this绑定在最近一层对象上
- apply、call、bind可改变this指向
  - apply接收的参数是数组
  - call接收的参数是参数列表
  - bind返回一个绑定特定对象的新函数
## 事件循环
js是单线程的，为了防止一个函数执行时间过长阻塞后续的代码，所以先将同步代码压入执行栈中，依次执行，将异步代码推入异步队列；而异步队列分为宏任务队列和微任务队列，微任务队列主要包括`promise.then`、`mutationObserver`，宏任务队列主要包括`setTimeout`、`setInterval`、`setImmediate`  
### 浏览器中事件循环
事件循环运行机制，先执行栈中的代码，栈中代码执行完之后执行微任务，微任务清空后再执行宏任务；先取出一个宏任务执行，再执行微任务，然后再取宏任务清空微任务如此循环。主要步骤如下：  
1. 函数入栈，当Stack中遇到异步任务时便将其交给WebAPIs，然后接着执行同步任务，直到清空栈
2. 在此期间WebAPIs，将异步任务的回调函数放入异步队列等待执行
3. 执行栈为空时，开始执行微任务队列直至清空
4. 微任务队列清空后，进入宏任务队列，取队列中第一项任务放入栈中执行；执行完成后，查看微任务队列是否有任务，有的话清空微任务队列。重复步骤4，直至清空所有任务
### 浏览器中异步任务源  
**宏任务**  
ajax、setTimeout、setInterval、setImmediate、requestAnimationFrame、messageChannel、UI渲染  
**微任务**  
promise.then、mutationObserver、queueMicrotask
### setTimeout、promise、async/await
- setTimeout: setTimeout任务放在宏任务队列中，等到执行栈清空后执行
- Promise  
Promise本身是`同步的立即函数`，当执行器执行resolve或者reject时，才是异步操作，将异步回调放入到微任务队列  
```
console.log('script start')
let promise1 = new Promise(function (resolve) {
    console.log('promise1')
    resolve()
    console.log('promise1 end')
}).then(function () {
    console.log('promise2')
})
setTimeout(function(){
    console.log('settimeout')
})
console.log('script end')
// 输出顺序：script start -> promise1 -> promise1 end -> script end -> promise2 -> settimeout
```
- async/await  
async函数返回一个Promise对象，当函数执行时，遇到await就会先返回，等到触发的异步操作完成，再执行后面的语句  
```
async function async1(){
   console.log('async1 start');
    await async2();
    console.log('async1 end')
}
async function async2(){
    console.log('async2')
}

console.log('script start');
async1();
console.log('script end')
// 输出顺序：script start -> async1 start -> async2 -> script end -> async1 end
```
## 尾调用
在某个函数的最后一步操作是调用另一个函数
### 尾调用优化
因为在最后一步执行时，外层函数的变量、调用位置不会再用到，因此可以只保留内层函数的调用记录。如果所有函数都是尾调用，可以做到每次执行时调用记录只有一项，大大节省内存
### 尾递归
在函数最后一步调用自身。  
  
**实现阶乘函数 n!**
```
function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1);
}
```
 - 问题：栈溢出
 - 解决方法：1）尾递归优化；2、非递归方式
1. 尾递归优化
将函数内部变量改写成函数参数。  
```
function factorial(n, total = 1) {
  if (n === 1) return total;
  return factorial(n - 1, n * total);
}
```
2. 非递归方式
```
function factorial(n) {
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result *= i;
  }
  return result;
}
```
## setTimeout、promise、async/await的区别
- setTimeout是异步执行函数，当js执行到此函数时，会将其放到异步队列中；等到下一个事件循环(或某个事件循环)执行其回调函数
- promise本身是立即执行函数，但.then和.catch是异步函数，js将其放到微任务队列中；当执行栈执行完之后，执行微任务队列中回调
- async/await将异步变同步，await之前是同步执行的，当遇到await后js会阻塞之后的代码执行(async函数返回promise，await之后的代码相当于promise.then()中的回调)
## mouseenter和mouseover，mouseout和mouseleave
- mouseenter和mouseleave事件不支持冒泡；mouseover和mouseout事件支持冒泡
- mouseout 和 mouseover比 mouseleave 和 mouseenter先触发
## js加载时间线
1. 创建Document对象，开始解析web页面。这个阶段document.readyState="loading";
2. 当遇到link外部css，创建线程加载外部css，并继续解析文档
3. 当遇到外部js，没有设置defer、aysnc，阻塞文档解析，等待js加载完成并执行后，继续解析文档
4. 当遇到外部js，设置了defer、async，浏览器异步加载js，并继续解析文档；async属性的js加载完成后，立即执行
5. 遇到img等，先正常解析dom结构，然后浏览器异步加载src，并继续解析文档
6. 当文档解析完成，此时document.readyState="interactive"
7. 等待defer属性js加载完成后，依次执行；执行完之后触发DOMContentLoaded
8. 当所有async属性js、图片等资源加载并执行完之后，此时document.readyState="complete"，触发load事件
## base64
### 什么是base64
base64是一种编码方式，其包括64个基本字符集(a-z,A-Z,0-9,+,/)；也就是说将数据转换为这个字符集中的字符
### 编码过程
- 将每三个字节为一组，一共24个二进制位
- 将其分为四组，每组6个二进制位
- 在每组前面加入00，扩展成32个二进制位，也就是4个字节
- 根据base64字符对照得到每个字节对应的符号
### base64编码后为什么体积膨胀
3个字节编码后变为4个字节，因此体积会大三分之一
## 事件代理/委托
### 什么是事件代理
将一个元素的响应事件(如click、keydown)处理函数委托到另一个元素上。也就是说，会把一个元素或者一组元素的事件委托到它的父级元素或者更外层元素，真正绑定事件的是外层元素，而不是目标元素。  
**委托时机：事件冒泡阶段**
### 应用场景
```
// 获取目标元素
const lis = document.getElementsByTagName("li")
// 循环遍历绑定事件
for (let i = 0; i < lis.length; i++) {
    lis[i].onclick = function(e){
        console.log(e.target.innerHTML);
    }
}
```
以上方式可看出在每个`li`元素上绑定了click事件，1）内存消耗极大；2）对于动态增加和删除的元素需要重复处理(动态添加/删除事件绑定)。此时便可以采用事件委托：
```
// 给父层元素绑定事件
document.getElementById('list').addEventListener('click', function (e) {
    // 兼容性处理
    var event = e || window.event;
    var target = event.target || event.srcElement;
    // 判断是否匹配目标元素
    if (target.nodeName.toLocaleLowerCase === 'li') {
        console.log('the content is: ', target.innerHTML);
    }
});
```
### 总结
适合事件委托的事件：`click，mousedown，mouseup，keydown，keyup，keypress`。
# 其他
## jsBridge
### JS调用Native实现方式
1. 注入API  
**核心原理**
- 通过`Webview`提供的接口，向JavaScript上下文注入对象或者方法
- 允许JavaScript进行调用时，直接执行对应的Native逻辑
1. URL Scheme劫持  
`URL Scheme`是一种特殊的`URL`，一般用于Web端唤醒APP。  
`URL Scheme`形式和普通`URL`类似，不过`protocol`和`host`一般是APP自定义的  
**劫持原理**  
Web端通过某种方式发送`URL Scheme`请求，`Native`拦截到请求后根据对应的参数执行对应操作
### Native调用js实现方式  
`Native`调用`JavaScript`实质就是**执行拼接**`JavaScript`字符串，类似于JavaScript通过`eval()`函数执行对应的JavaScript字符串。当然不同系统调用方式不太一样  
？？？如何处理执行结果和回调
## 浏览器渲染
### 注意事项
- GUI渲染线程和js引擎线程是互斥的：Javascript可以操作DOM，如果js引擎线程修改元素时，渲染线程依然执行，那会导致渲染线程前后获得的元素数据可能不一致
- css加载不会阻塞DOM树解析，但是会阻塞DOM树渲染：加载css时，可能会修改DOM节点样式，如果css加载不阻塞DOM树渲染，那么当css加载完之后，render树可能要重绘或者回流<br>
### 渲染过程
![avatar](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78e105621ef1444ead7032551bd83878~tplv-k3u1fbpfcp-watermark.image?)
1. 构建DOM树：当浏览器接收到服务器返回的HTML文档后，遍历文档节点，生成DOM树  
**注意：**DOM树生成过程中可能会被CSS或JS的加载执行阻塞
2. 构建CSSOM规则树：浏览器解析CSS文件并生成CSS规则树
3. 构建渲染树：通过DOM树和CSSOM规则树便可以构建渲染树。浏览器会从DOM树根节点开始遍历每个可见节点，并找到其适配的CSS样式规则并应用。
4. 渲染树布局(回流)：从渲染树的根节点开始遍历，确定每个节点在页面上的大小和位置，输出一个盒子模型。
5. 渲染树绘制：遍历渲染树，由渲染器将内容显示在屏幕上(将渲染树转换成屏幕上的像素)
### 回流(Reflow) VS 重绘(Repaint)
#### 回流(Reflow)  
当渲染树中的一部分(或全部)因为元素的尺寸、布局、隐藏等改变需要重新构建，称为回流。每个页面至少有一次回流，也就是在页面初始加载时构建渲染树。  
**回流就是计算元素在屏幕上的确切位置和大小；回流的代价远大于重绘，回流一定会触发重绘，但是重绘不一定会触发回流**
#### 重绘(Repaint)
当渲染树中部分元素需要修改样式，但这些样式只会影响元素的外观而**不影响布局**，比如背景等，称为重绘
**重绘就是将渲染树节点转换为屏幕上的像素，不涉及元素的位置和大小计算**
#### 何时会发生回流和重绘
**导致回流的操作**
- 页面首次加载
- 浏览器窗口大小发生改变
- 元素尺寸或位置发生改变(宽高、边距、边框等)
- 元素内容发生变化(内容的数量或者大小等)
- 元素字体大小变化
- 添加或者删除可见元素
- 调用某些方法(width, height, display, offsetWidth, offsetHeight等)
**导致重绘的操作**
- 改变元素样式，如颜色、背景、visibility、阴影等
#### 优化回流和重绘
- DOM离线处理，减少回流重绘次数
  - 使用`display: none`，该元素不属于渲染树，之后在该DOM上的操作不会引起回流和重绘，操作完之后再将`display`改为显示，此时只需要一次回流和重绘
  - 通过`documentFragment`创建dom片段，在它上面进行批量操作，之后再添加到文档中，这样只会发生一次回流和重绘
  - 克隆节点，修改完之后进行替换
- DOM样式合并批量修改，避免层级嵌套过多
  - 使用class
  - 使用style.cssText
- DOM(如动画)脱离文档流  
  使用`abosulte`或`fixed`让元素脱离文档流，回流开销小，对其他元素影响较小
- 避免频繁读取引起回流/重绘的属性，如果需要多次读取，使用本地变量缓存
**浏览器优化机制**
由于每次回流会造成额外的计算消耗，因此目前大多数浏览器会通过队列批量执行回流过程。浏览器会将修改操作放入队列，直到一段时间或者达到一定阈值才会进行处理。但是，**当开发者获取布局信息时，会强制队列刷新**，如
  - offset系列
  - scrollTop、scrollLeft、scrollHeight、scrollWidth
  - client系列
  - getComputedStyle
  - getBoundingClientRect
```
function initP() {
  for (let i = 0; i < paragraphs.length; i++) {
    paragraphs[i].style.width = box.offsetWidth + 'px';
  }
}
```
此处有很大的性能问题，每次循环时都会读取box的offsetWidth属性，这会导致每一次循环都会清空队列进行更新产生回流，因此可以优化为：
```
const width = box.offsetWidth; // 本地变量缓存引起回流的属性访问
function initP() {
    for (let i = 0; i < paragraphs.length; i++) {
        paragraphs[i].style.width = width + 'px';
    }
}
```
- css3硬件加速
**css3硬件加速可以让transform、opacity、filters这些动画不会引起回流重绘**
### JS加载: defer VS async
https://www.cnblogs.com/jiasm/p/7683930.html
- 普通js：一旦遇到js文件，会阻塞后续DOM渲染，开始加载js文件，加载完之后执行<br>
![avatar](https://user-images.githubusercontent.com/9568094/31621391-39849b1a-b25f-11e7-9301-641b1bc07155.png)
- defer：不会阻塞后续DOM渲染。文档解析时，遇到defer脚本，会在后台异步进行下载；当页面解析&渲染完毕后，会等所有defer脚本加载完成后按照顺序执行，执行完毕后触发DOMContentLoaded<br>
![avatar](https://user-images.githubusercontent.com/9568094/31621324-046d4a44-b25f-11e7-9d15-fe4d6a5726ae.png)
- async：不会阻塞后续DOM渲染。文档解析时，遇到async脚本，会在异步进行下载，下载完成后立即执行，不计入DOMContentLoaded事件统计<br>
![avatar](https://user-images.githubusercontent.com/9568094/31621170-b4cc0ef8-b25e-11e7-9980-99feeb9f5042.png)
## 从URL输入到页面展示发生了什么
- dns解析：将域名解析为IP地址
- 建立TCP链接：TCP三次握手
- 发送http请求
- 服务器处理请求并返回http报文
- 浏览器解析渲染页面
- 断开链接：TCP四次挥手
### URL
URL(Uniform Resource Locator)，统一资源定位符，用于定位互联网上资源，俗称网址。  
  
scheme://host.domain:port/path/filename  
- scheme: 因特网服务类型，常见的协议有http、https、ftp、file等
- host: 域主机(http的默认主机是www)
- domain: 因特网域名
- port: 端口，默认端口是80
- path: 服务器上的路径
- filename: 服务器上资源的名称
### dns解析
1. **什么是域名解析**
DNS通过域名查找IP地址，或者逆向通过IP地址查找域名。**DNS是一个网络服务器，域名解析简单来说就是在DNS上记录一条信息记录**
```
baidu.com 220.114.23.56
```
2. **浏览器如何通过域名查询到对应的IP**
- 浏览器缓存：浏览器会按照一定的频率缓存DNS记录(chrome://net-internals/#dns)
- 操作系统缓存：如果浏览器缓存找不到对应的DNS记录，就去操作系统查找
- 路由缓存：路由器也有DNS缓存
- ISP的DNS服务器：ISP(Internet Service Provider)互联网服务提供商，ISP有专门的DNS服务器对应的DNS查询请求
- 根服务器：ISP的DNS服务器找不到的话，就会向根服务器发出请求，进行递归查询(DNS服务器先问根域名服务器.com 域名服务器的 IP 地址，然后再问.baidu 域名服务器，依次类推)
### TCP三次握手
1. **三次握手过程**
- 客户端发送请求，并携带SYN=1, Seq=X的数据包(第一次握手：浏览器发起，告诉服务器我要发送请求了)
- 服务器端收到请求后，发送请求(携带SYN=1, ACK=X+1, Seq=Y)传达确认信息(第二次握手：服务器发起，告诉浏览器我准备接受了，可以发送数据)
- 客户端发送核对请求，携带ACK=Y+1, Seq=Z的数据包(第三次握手：浏览器发起，告诉服务器我已经准备好，准备发了)
  - SYN: 用于建立链接
  - Seq: 发送自己的数据
  - ACK: 用于确定收到了请求
2. **为什么需要三次握手**
- 第一次握手：第一次握手是客户端发送同步报文到服务端，这个时候客户端是知道自己具备发送数据的能力的，但是不知道服务端是否有接收和发送数据的能力；
- 第二次握手：当服务端接收到同步报文后，回复确认同步报文，此时服务端是知道客户端具有发送报文的能力，并且知道自己具有接收和发送数据的能力，但是并不知道客户端是否有接收数据的能力；
- 第三次握手：当客户端收到服务端的确认报文后，知道服务端具备接收和发送数据的能力，但是此时服务端并不知道自己具有接收的能力，所以还需要发送一个确认报文，告知服务端自己是具有接收能力的。  
当整个三次握手结束过后，客户端和服务端都知道自己和对方具备发送和接收数据的能力，随后整个连接建立就完成了，可以进行后续数据的传输了。
### 发送HTTP请求
请求报文由请求行、请求头、请求体三部分组成  
1. **请求行包括请求方法、URL、协议版本(HTTP版本号)**
```
POST /chapter/user HTTP/1.1
```
2. **请求头包括请求的附件信息，以键值对组成**
请求头部告诉服务器关于客户端的请求信息，包括客户端环境、请求正文等。  
3. 请求体，承载多个请求参数的数据，如
```
name=tom&password=1234&realName=tomson
```
### 服务器返回HTTP报文
http响应报文包括响应行、响应头、响应主体
1. 响应行包括协议版本、状态码；状态码描述：
1xx: 指示信息--表示请求已接收，继续处理  
2xx: 成功--表示请求已经被成功接收、理解、接受
3xx: 重定向--要完成请求必须进行更进一步的操作
4xx: 客户端错误--请求有语法错误或请求无法实现
5xx: 服务端错误--服务器未能实现合法的请求
2. 响应头包含响应报文的附加信息，由键值对组成
3. 响应主体包含回车符、换行符和响应返回数据
### TCP四次挥手
- 客户端发送请求，要求释放连接（FIN），并发送数据包seq: 此时客户端停止向服务端发送数据，但是依然可以接收服务端返回的数据(客户端不再发送请求报文)
- 服务端收到请求后，确认客户端想要释放连接（ACK = 1）,发送请求报文表示同意关闭(此时服务器已经接受完请求报文)
- 服务端自从发送ACK确认报文后，做好了释放连接的准备，再次向客户端发送报文（FIN,ACK）：告诉客户端已经做好释放连接的准备了(此时服务端已经完成响应报文发送)
- 客户端收到请求后，确认服务端已经做好准备，并向服务端发送请求；服务端收到后，正式确认关闭服务端到客户端的连接(客户端已经接收完响应报文，准备关闭)
## 浏览器缓存
### 按缓存位置分类
优先级(由上到下查找，找到即返回；否则继续)  
- Service Worker
- Memory Cache
- Disk Cache
- 网络请求
#### **1. Service Worker**
Service Worker是运行在浏览器中的独立进程，开发者可根据需要自定义缓存内容、缓存策略、缓存匹配方式等。
#### **2. Memory Cache**
Memory Cache指的是内存中的缓存，主要包含当前页面中已经抓取到的资源，如CSS、图片、字体等。  
特点：读取高效，但缓存持续性较短，会随着进程的释放而释放。**一旦关闭tab，内存中缓存也将被释放**；极端情况下，一个页面的缓存占据了较多的内存，那在tab关闭之前，排在前面的缓存就已经失效了  
  
在Memory Cache中，有一类重要缓存资源即preloader指令下载的资源(包括 Preload&Prefetch)
- prefetch  
一种浏览器机制，利用浏览器空闲时间提前下载用户在将来可能访问的资源。网页向用户提供预取标识，并在浏览器空闲时间静默获取指定的资源存储在内存中。当用户访问某个预取资源时，直接从缓存中读取。
```
<head>
    ...
    <link rel="prefetch" href="static/img/ticket_bg.a5bb7c33.png">
    ...
</head>
```
- preload(预加载)
资源标识，表明资源是在页面加载完成后即刻需要的；也就是说通过标签显式声明一个高优先级资源，强制浏览器在页面加载的生命周期早期阶段提前请求资源，同时不阻塞页面正常的onload。  
**典型场景：字体预加载，防止字体闪动**  
```
注意：preload link必须设置as属性来声明资源的类型（font/image/style/script等)，否则浏览器可能无法正确加载资源。
```
- 注意事项
Memory Cache在缓存资源时并不关心返回资源的HTTP缓存头Cache-Control、max-age，同时资源的匹配也并非仅仅是对URL做匹配，还可能会对Content-Type，CORS等其他特征做校验
```
preload的字体资源必须设置crossorigin属性，否则会导致重复加载  
原因是如果不指定crossorigin属性(即使同源)，浏览器会采用匿名模式的CORS去preload，导致两次请求无法共用缓存。
```
#### **3. Disk Cache**
Disk Cache，存储在硬盘上的缓存，是一种持久化存储。  
Disk Cache会根据Http头信息中的字段来判断资源的缓存策略。通常有强缓存和协商缓存
### 按缓存策略分类
#### **1. 强缓存**
强缓存：当客户端发出请求后，会先查询缓存数据库缓存是否存在，若存在直接返回；否则将请求真正的服务器，响应后将数据写入缓存数据库  
**强制缓存可直接减少请求次数，提升性能**  
  
强制缓存的头信息字段`Cache-Control` 和 `Expires`
- Expires  
Expires是HTTP 1.0的字段，表示缓存到期时间，是一个绝对时间。
缺点：  
  1. 由于响应头是绝对时间，用户可能修改客户端时间导致浏览器判断缓存失效，重新请求该资源。即使不修改时间，也有可能误差造成客户端和服务器时间不一致，导致缓存失败  
  2. 写法复杂，容易写入失误导致非法属性
- Cache-Control
在HTTP/1.1中增加了Cache-Control字段，表示资源的缓存时间。  
`Cache-Control`常用的属性值：
- `max-age`: 最大有效时间
- `no-cache`: 要求客户端对资源进行缓存，但是否使用由协商缓存决定
- `no-store`: 所有资源都不缓存，包括强制缓存和协商缓存
- `public`: 所有内容都可以被缓存(包括客户端、代理服务器如CDN)
- `private`: 所有内容只有客户端能缓存，代理服务器不能缓存
## cookie、sessionStorage和localStorage
- cookie数据大小不能超过4K；sessionStorage和localStorage可以达到5M+;
- cookie在设置的过期时间内一直有效；localStorage永久存储，浏览器关闭后仍然有效除非用户手动清除；sessionStorage在当前会话中有效，浏览器当前窗口关闭后自动删除
- cookie的数据会自动传到服务器；sessionStorage和localStorage数据存储在本地浏览器

## CDN
### CDN的概念
CDN(content delivery network, 内容分发网络)是指一种通过互联网连接的电脑网络系统，利用最靠近每位用户的服务器，更快、更可靠地将资源发送给用户，来提供高性能、可扩展性及低成本的网络内容给用户。  
  
CDN系统主要包含三部分：
- 分发服务系统：最基本的工作单元是cache设备，cache负责直接响应最终用户的访问请求，把缓存在本地的内容快速提供给用户。同时cache还负责与源站点进行内容同步，把更新的内容以及本地没有的内容从源站点获取并保存在本地。cache设备的数量、规模、总服务能力是衡量一个CDN系统服务能力的最基本的指标
- 负载均衡系统：主要负责对所有发起服务请求的用户进行访问调度，确定提供给用户的最终实际访问地址。两级调度体系分为全局负载均衡(GSLB)和本地负载均衡（SLB），全局负载均衡负责根据用户就近性原则，通过对每个服务节点进行最优判断，确定向用户提供服务的cache的物理位置；本地负载均衡负责节点内部的设备负载均衡
- 运营管理系统：分为运营管理和网络管理子系统。
### CDN作用
CDN一般用来托管Web资源，可供下载的资源，应用程序。
- 用户收到的内容来自最近的数据中心，延迟更低，内容加载更快；
- 部分资源请求分配给CDN，降低了服务器的负载
### CDN工作原理
1. URL经DNS解析后，发现该URL对应的是一个CDN专用的DNS服务器，DNS系统将该域名解析交给CNAME指向的CDN专用的DNS服务器
2. CDN专用DNS服务器将CDN的全局负载均衡设备IP地址返回给用户
3. 用户向CDN全局负载均衡设备发起数据请求
4. 全局负载均衡设备根据用户的IP地址以及用户请求的URL，选择一台用户所属的区域负载均衡设备，告诉用户向这台设备发起请求
5. 区域负载均衡设备选择一台合适的缓存服务器来提供服务，将该缓存服务器的IP地址返回给全局负载均衡设备
6. 全局负载均衡设备将IP地址返回给用户
7. 用户想缓存服务器发起请求，缓存服务器响应请求，将内容发送至用户终端

## 性能优化
### 资源大小
- 资源压缩
  - 打包资源js、css压缩
  - 图片做适当的压缩或者使用支持图片参数的图片服务
  - 静态服务器开启gzip
- 资源引入
  - 比较大的外部依赖换成同功能体积小的库或者按需引入
  - 避免整体引入依赖模块，进行tree-shaking
- 合理进行模块拆分(尽量首屏只加载必要资源，可通过资源加载覆盖率进行分析)
### 资源速度
- 部署资源到CDN
- 使用dns-prefetch提前获取IP地址: 当浏览器从第三方服务器获取资源时，必须先将域名解析为IP地址，通过dns-prefetch可以减少dns解析延迟
- 使用http2进行并行请求
- 缓存资源：如浏览器缓存(强缓存、协商缓存等)、pwa缓存
### 提前加载
- SSR
- 使用APP离线包
- prefetch: 利用浏览器的空闲时间加载**用户接下来可能访问的资源**，缓存在本地；但是不解析执行，等到用户访问时才会解析
  - prefetch会优化将来访问页面资源的首次加载速度
  - 使用prefetch时选择优先级较高的资源(如js、css、字体资源)
  - prefetch可能造成额外的带宽消耗
- preload: 在当前页面开始加载之前在浏览器后台提前下载资源，**缓存当前页面会立刻访问到的资源**，不会花费额外带宽
### 懒加载
懒加载也称为延迟加载、按需加载
- 图片懒加载：指的是在长网页中延迟加载图片数据，首先保证可视窗口中图片的加载；当滚动时，再加载之后的图片  
  图片加载是由`src`引起的，`src`被赋值后，浏览器就会发起图片资源请求。因此可以将图片的真实地址赋值给`data-xxx`属性，当图片需要加载时将`data-xxx`的图片路径赋值给`src`，这样就实现了图片的按需加载。
- 组件懒加载：可利用Vue的defineAsyncComponent动态加载
## CSRF(Cross Site Request Forgery，跨站点请求伪造)
恶意站点或者程序通过已认证用户的浏览器在受信任站点上执行非正常操作。可进行的恶意操作局限于已在网站通过身份验证的用户功能。
### 需要满足以下条件
- 用户在被攻击网站已经登录认证
- 用户在未登出的情况下，访问了第三方网站，触发了对被攻击系统的请求
### 防护策略
- 利用cookie的SameSite属性
攻击者利用用户的登录态发起CSRF攻击，而cookie正是浏览器和服务器之间维护登录状态的一个关键数据。因此，首先要考虑cookie问题。  
通常CSRF攻击都是从第三方站点发起的，冒用用户在被攻击站点的登录凭证，因此：
  - 如果是从第三方网站发起的请求，浏览器禁止发送某些关键cookie信息到服务器
  - 如果是从同一站点发起的请求，正常发送cookie到服务器  
SameSite属性正好可以解决这个问题：
  - Strict: 浏览器完全禁止第三方拿到cookie
  - Lax: 在跨站点的情况下，从第三方站点的链接打开或Get方式的表单提交可以携带cookie；除此之外，如post请求、img、iframe等加载的URL都不会携带cookie
  - None: 任何情况下都会发送cookie
- 利用同源策略
禁止外域向本站点发送请求  
  
在HTTP协议中，每个异步请求都携带了两个header，用户标记来源域名：
  - Referer: 记录该请求的来源地址(含URL路径)
  - Origin: 记录该请求的域名信息(不含URL路径)
服务器先判断Origin，再根据实际情况判断referer
- 利用token验证
在用户登录成功后，服务器生成一个token返回给用户；在浏览器端想服务器发送请求时，带上token，服务器验证token
## 跨域
跨域是浏览器基于**同源策略**的一种安全手段。同源需要满足以下三个条件：协议相同 + 域名相同 + 端口相同。  
同源策略主要是处于安全考虑，防止浏览器收到跨站攻击
### 解决方案
- JSONP
JSONP主要利用script标签没有跨域限制，实现跨域Get请求
```
function jsonp(options) {
  const { url, params, timeout } = options;
  const callbackId = `jsonp_${Date.now()}_${Math.ceil(Math.random() * 1000000)}`;

  const searchParams = Object.keys(params).map((key) => `${key}=${params[key]}`);
  const newUrl = `${url}?${searchParams.join('&')}&callback=${callbackId}`;

  const pro = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.setAttribute('src', newUrl);

    window[callbackId] = (data) => {
      resolve(data);
    }

    script.addEventListener('error', () => {
      reject(new Error(`JSONP request to ${newUrl} failed`));
      document.body.removeChild(script);
    });

    document.body.appendChild(script);
  });

  const timeoutPro = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('timeout');
    }, timeout);
  })


  return Promise.race([timeoutPro, pro]);
}
```
- CORS(Cross-Origin Resource Sharing, 跨站资源共享)
由一系列HTTP请求头组成，这些请求头决定浏览器是否阻止前端Javascript代码获取跨域请求的响应
- 代理
  - 本地开发，可以利用打包工具提供的代理插件
  - 服务端实现代理请求转发，如node层
  - 配置nginx实现代理
### CORS(Cross-Origin Resource Sharing, 跨站资源共享)
CORS需要浏览器和服务器同时支持，目前主流浏览器均已支持，且都由浏览器自动完成，无需用户和开发者介入。  
因此实现CORS关键是服务器，只要服务器实现了CORS接口，就可以跨源通信。
#### 两种请求
CORS请求分为两类：简单请求和非简单请求
- 简单请求
简单请求中，浏览器会在请求头信息中增加`Origin`字段，表明当前请求来源，如：  
```
GET /cors HTTP/1.1
Origin: http://api.bob.com
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```  
服务器会根据Origin字段判断是否同意此次请求。  
1、如果Origin**不在允许范围内**，服务器会返回一个正常的HTTP相应，但是响应头信息中不包含`Access-Control-Allow-Origin`字段，浏览器通过响应头判断出错了，就会抛出错误，被XMLHttpRequest的onerror捕获。  
2、如果Origin**在允许范围内**，服务器返回响应，并且增加对应的响应头信息  
```
Access-Control-Allow-Origin: https://api.bob.com
Access-Control-Allow-Credentials: True
Access-Control-Expose-Headers: FooBar
```
  - Access-Control-Allow-Origin
  值为请求时的Origin，或者`*`表示可以接收任意域名的请求
  - Access-Control-Allow-Credentials
  可选，是否允许发送cookie。默认情况下，cookie不包含在CORS请求中
  - Access-Control-Expose-Headers
  可选，CORS请求时，XMLHttpRequest对象只能获取到头信息中6个字段，如果想获取到其他字段，需要通过`Access-Control-Expose-Headers`进行指定
- 非简单请求
非简单请求指的是对服务器有特殊要求的请求，比如请求方法是`put`或者`delete`，或者`Content-type`字段类型为`application/json`。  
非简单请求在正式请求之前会增加一个查询请求，称为“预检”请求(preflight).  
浏览器会先询问服务器，当前网页所在的域名是否在服务器的许可名单中，以及可以使用哪些头信息字段。只有得到肯定答复后，浏览器才会发出正式请求。
  
1、浏览器发现是一个非简单请求，会自动发出“预检”请求，要求服务器进行确认。下面是预检请求的HTTP头信息：
```
OPTIONS /cors HTTP/1.1
Origin: http://api.bob.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: X-Custom-Header
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```  
  - 预检请求请求方法是`options`
  - 关键字段`Origin`
  - Access-Control-Request-Method: 必须，列出CORS请求会用到哪些HTTP方法
  - Access-Control-Request-Headers: CORS请求会额外发送的头信息字段
2、预检请求响应  
```
HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 01:15:39 GMT
Server: Apache/2.0.61 (Unix)
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Content-Type: text/html; charset=utf-8
Content-Encoding: gzip
Content-Length: 0
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Content-Type: text/plain
```
  - Access-Control-Allow-Origin: 必须，允许的跨域请求域名
  - Access-Control-Allow-Methods: 必须，表示服务器支持的跨域请求方法
  - Access-Control-Allow-Headers: 和请求头对应，表示服务器支持的所有头信息字段
  - Access-Control-Max-Age: 可选，表示本次预检请求的有效期，在有效期内不会再发出预检请求
## axios
### axios特性
- 在浏览器端通过XMLHttpRequest创建请求
- 在node环境中通过http模块创建请求
- 支持Promise API
- 拦截请求和响应
- 转换请求数据和响应数据
- 取消请求
- 自动转换json数据
### axios封装
- 设置接口请求URL
- 设置请求头、超时时间等，如请求头content-type
- 封装请求方法：get、post、jsonp
- 封装请求拦截器：对请求数据进行统一处理，如增加统一token等
- 封装响应拦截器：对响应数据进行统一处理，如状态码、错误码、错误上报等

# 网络
https://www.eet-china.com/mp/a68780.html  

## https2
### 基本概念
- 帧(frame)：数据传输的最小单位，主要包括length、type、flags、stream identifier、frame playload这些字段
- 流(stream)：流可以承载双向字节流，每个流都有一个整数ID
### 特征
- 二进制分帧  
  http2不再依赖TCP连接进行多流并行，二进制帧可以乱序发送，然后通过帧中流标识进行拼装。  
- 多路复用  
  建立一个TCP连接，并行发送多个请求。在所有请求中，基于数据流和二进制帧，不存在同域并行阻塞的问题  
- 头部压缩  
  1.X版本中，首部用文本格式传输，会给每个传输增加额外的开销；另外网页中每个请求携带的一些头部字段是相同的。因此HTTP2采用HPACK进行头部压缩，在客户端和服务器端维护字典  
  - 静态字典，常见的头部字段(包含索引)
  - 动态字典，可以动态添加的内容（包含索引）
  - 在头部传输时，只需要传输对应的头部字段索引，然后服务端根据字典进行映射取值
- 服务器推送  
  服务器端推送使得服务器可以预测客户端需要的资源，主动推送到客户端
## HTTP和HTTPS
### http和https基本概念
1、**http**: http是客户端和服务器端请求和应答的标准，用于从WWW服务器传输超文本到本地浏览器的超文本传输协议；
2、**https**: 以安全为目标的HTTP通道，即在HTTP下加入SSL层进行加密。其作用是：建立信息安全通道来确保数据的传输，同时确保网站的真实性。
### http和https的区别
- http是超文本传输协议，明文传输数据；https是具有安全性的ssl加密传输协议，可防止数据被窃取或篡改，比http协议更安全
- http协议默认端口是80；https默认端口是443
- http连接简单，是无状态的；https要经过三次握手，使得页面加载时间延长
- https协议需要ca证书，费用较高
- ssl证书需要绑定IP，不能在同一个IP上绑定多个域名
### https工作原理
https://cloud.tencent.com/developer/article/1601995  
![avatar](https://ask.qcloudimg.com/http-save/6837186/mloginfful.jpeg?)  
1、**证书验证阶段**  
  1. 客户端发起https请求  
  2. 服务器接收请求并返回证书(证书包含了公钥、证书颁发机构、证书过期时间、域名等信息)  
  3. 客户端验证证书的合法性，如不合法提示告警
  
2、**数据传输阶段**  
  1. 客户端生成随机数  
  2. 通过公钥对其进行加密，并将加密后的随机数传输到服务端  
  3. 服务端利用私钥对随机数进行解密
  4. 之后客户端和服务端通过此随机数构造对称加密算法，进行数据传输
### 浏览器如何保证CA证书的合法性
1、**证书包含信息：**  
- 颁发机构
- 公司信息
- 证书有效期
- 域名
- 公钥                              
- 指纹
- ......  
2、**证书的合法性依据**  
- 证书颁发机构要有认证，不是任何机构都能颁发证书
- 证书可信性基于信任制，权威机构需要对其颁发的证书进行信用背书，只要是权威机构颁发的证书，都会被认为是合法的  
3、**浏览器如何验证**  
浏览器发起请求时，服务器端会返回对应的SSL证书，浏览器主要做以下验证：  
- 对证书的域名、有效期等信息进行验证
- 判断证书来源是否合法。每份证书都可以根据验证链找到其根证书，操作系统、浏览器会在本地存储权威机构的根证书，利用本地根证书对对应机构进行来源验证
- 判断证书是否被篡改，需要和CA服务器进行校验
- 判断证书是否已吊销。通过CRL（Certificate Revocation List 证书注销列表）和 OCSP（Online Certificate Status Protocol 在线证书状态协议）实现，其中 OCSP 可用于第3步中以减少与 CA 服务器的交互，提高验证效率
### TCP如何保证数据包的可靠有序传输
对字节流分段进行编号然后通过`ACK回复`和`超时重发`两个机制来保证  
1) 发送方每次发送数据时，TCP给每个数据包分配一个序列号并且在特定时间内等待接收方对这个序列号进行确认。  
2) 如果发送发在特定时间内没有收到接收方的确认，则发送方会重传数据。  
3) 接收方利用序列号对数据进行确认，以便检测对方发送的数据是否有丢包或者乱序；接收方一旦收到已经顺序化的数据，就将这些数据按正确的顺序进行重组成数据流传递到上层协议进行处理。  
  
**核心算法**  
- 为了保证数据包的可靠传输，发送方必须将已发送的数据包保存在缓冲区
- 为每个已发送的数据包启动一个超时定时器（重传定时器）
- 如在定时器超时之前收到接收方发送的应答信息，则释放该数据包占用的缓冲区；否则重传数据包，直到收到接收方的应答信息或者重传次数超过最大次数限制
- 接收方收到数据包后，先进行CRC校验，如果正确则把数据交给上层协议，然后给发送方发送一个累计应答包，表明数据已收到。
### TCP和UDP区别
- TCP是面向连接的，UDP是面向无连接的
- TCP仅支持单播传输，UDP支持单播、多播、广播的功能
- TCP根据三次握手来保证连接的可靠性；UDP是无连接的、不可靠的一种数据传输协议，首先体现在无连接上，通信不需要建立连接；其次对接收的数据也不发送确认信号，发送端不知道数据是否正确接收
- UDP的头部开销更小，比TCP传输效率更高、实时性更好。
## http状态码
- 1XX: 信息性状态码
- 2XX: 成功状态码
- 3XX: 重定向状态码
- 4XX: 客户端错误状态码
- 5XX: 服务器错误状态码
### 常见状态码
- 101：切换请求协议
- 200：请求成功
- 301：永久性重定向，会缓存
- 302：临时重定向，不会缓存
- 304：请求的资源未修改，此时服务器不会返回任何资源
- 400：客户端请求的语法错误
- 403：服务器禁止访问，权限有关
- 404：服务器根据客户端请求找不到资源
- 500：服务端错误
### 301和302
**1、共同点**  
- 都是重定向
- 新的URI地址都是通过response header中Location返回
- 如果原始请求不是GET或者HEAD请求，浏览器会禁止自动重定向，除非得到用户的确认  
**2、区别**
- 301永久重定向；302临时重定向
- 301会缓存；302不会缓存
- 301：搜索引擎在抓取新的内容时也会将旧的地址替换为新的地址；302：搜索引擎在抓取新内容时保留旧的地址  
**3、常见应用场景**  
- http重定向到https(301)
- 系统升级，临时替换地址(302)
- 升级为新域名(301)
- 登录后重定向到其他指定页面(301)
## http常见的请求方式、区别和用途
- get: 获取服务器资源
- post: 向服务器提交数据
- put: 向服务器提交数据，以修改数据
- delete: 删除某些资源
- options: 获取服务器支持的请求方法，常用于跨域(预检，用以判断实际发送的请求是否安全)
- head：请求页面的首部，获取资源的元信息
- connect: 用于ssl隧道的基于代理的请求
- trace: 追踪请求-响应的传输路径
## 端口及对应的服务
- 80: HTTP超文本传输协议
- 443：https
- 21: FTP(文件传输协议)
- 22: ssh
- 23: Telnet(远程登录)服务
- 25: SMTP(简单邮件传输协议)
- 53: DNS域名服务器
- 110: POP3邮件协议3
- 1080: Sockets
- 1521: Oracle数据库默认端口
- 3306: MySQL数据库默认端口
## 计算机网络体系结构
![avatar](http://mianbaoban-assets.oss-cn-shenzhen.aliyuncs.com/xinyu-images/MBXY-CR-7943d7dc8a2afb50c58f3467d45fa768.png)
### OSI七层模型
ISO七层模型是国际标准化组织(International Organization for Standardization)指定的用于计算机或者通信系统间的标准体系  
- 物理层：建立、维护、断开物理连接
- 数据链路层：在物理层提供比特流服务的基础上，建立相邻节点之间的数据链路
- 网络层：进行逻辑寻址，实现不同网络之间的路径选择，协议有ICMP、IGMP、IP等
- 传输层：定义传输数据的协议端口号，以及流控和差错校验，协议有TCP、UDP
- 会话层：建立、管理、终止会话，对应主机进程，指本地主机和远程主机正在进行的会话
- 表示层：数据的表示、安全、压缩，确保一个系统的应用层所发送的信息可以被另外一个系统的应用层读取
- 应用层：网络服务与最终用户的一个接口，常见协议有http、ftp、smtp、dns
### TCP/IP 四层模型
- 网络接口层：与OSI中的物理层、数据链路层对应
- 网际层：与OSI中的网络层相对应，主要解决主机到主机的通信问题
- 传输层：与OSI中的传输层相对应，为应用层实体提供端到端的通信，保证数据传输的顺序和数据完整性
- 应用层：与OSI中的会话层、表示层、应用层相对应
### 五层体系结构
- 物理层：对应OSI中的物理层
- 数据链路层：对应OSI中的数据链路层
- 网络层：对应OSI中的网络层
- 传输层：对应OSI中的传输层
- 应用层：对应OSI中的会话层、表示层、应用层
## 如何理解http协议是无状态的
当浏览器第一次发送请求时，服务器响应了；如果同个浏览器再次发送请求给服务器时，它还是会响应；但是服务器不知道你就是刚才的浏览器，也就是说服务器不会记住你是谁，所以是无状态的。  
  
如果请求时带上cookie，就会变成有状态
# HTML & css
## css选择器优先级
### 选择器
- 标签选择器
- id选择器
- 类选择器
- 属性选择器
- 伪类选择器
- 相邻选择器(h1 + p)
- 子选择器(ul > li)
- 后代选择器(ul li)
- 通配符选择器(*)
### 选择器优先级
!important > 行内样式 > id选择器 > 类选择器 > 标签选择器 > 通配符 > 继承 > 浏览器默认属性
## position属性
- static: 默认值，正常文档流
- relative: 相对定位，相对本身的位置进行定位。但无论如何移动，元素仍占据原来的空间
- absolute: 绝对定位，相对于第一个非static的父级元素定位；脱离文档流，不占据空间
- fixed: 固定定位，相对于浏览器窗口定位；脱离文档流，不占据空间；即使窗口移动，该元素也不会移动
- sticky: 粘性定位，元素先按照正常文档流定位，而后相对于它最近的滚动祖先和containing block(最近块级祖先)进行定位，在特定阈值之前为相对定位，之后为固定定位
## css盒子模型
- 标准盒子模型：块的总宽度 = width + padding + border + margin
- 怪异盒模型：块的总宽度 = width + margin
## box-sizing
规定如何计算一个元素的总宽度和总高度
- content-box: 宽度和高度分别应用到元素的内容框，在宽度和高度之外还有padding和border(标准盒模型)
- border-box: 为元素设定的宽度和高度为元素的边框盒(IE盒子模型)
- inherit: 继承父元素的box-sizing值
## 水平垂直居中
### 水平居中
**1、行内元素**：`text-align: center`;  
**2、已知宽度的块级元素**
- width 和 margin：`margin: 0 auto`;
- 绝对定位：`position: absolute; left: (父width - 子width) / 2`;
- margin-left: `margin-left:(父width - 子width) / 2`;
**3、未知宽度的块级元素**  
- 绝对定位+transform: `position: absolute;left: 50%;transform: translateX(-50%)`; 
- flex布局：`justify-content: center`;
- table布局
### 垂直居中
- line-height: `line-height=height`，适用于纯文字垂直居中；
- flex布局：`align-items: center`;
- 绝对定位+transform: `position: absolute;top:50%;transform:translateY(-50%)`;
- table布局
## 隐藏页面中某个元素：
- `opacity: 0`: 利用透明度，但不会改变布局，而且元素绑定的事件还会生效
- `visibility: hidden`: 不会改变布局，不会触发该元素绑定的事件，但是所占空间仍然保留，不会触发重排，但会重绘
- `display: none`: 隐藏元素，会改变当前布局，文档流中不再保留当前元素所占的空间，触发重排和重绘
## 利用CSS实现三角符号
元素宽度高度均为0，三面边框皆透明
```
div:after {
  display: inline-block;
  width: 0;
  height: 0;
  border-top: 20px solid red;
  border-bottom: 20px solid transparent;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
}
```
## flex布局
弹性布局  
**容器属性**
- `flex-direction`: 主轴方向(也就是item的排列方向)row|row-reverse|column|column-reverse
- `flex-wrap`: 项目的换行规则wrap|nowrap|wrap-reverse
- `align-items`: 垂直轴对齐方式
- `justify-content`: 水平轴对齐方式
**项目属性**
- `order`: 项目的排列顺序，顺序越小，位置越靠前，默认为0
- `flex-grow`: 项目的放大比例，默认为0，即如果有剩余空间，也不会放大
- `flex-shrink`: 项目的缩小比例，默认为1，当空间不足时，会等比例缩小；设置为0，空间不足也不会缩小
- `flex-basis`: 分配多余空间，项目占据的主轴空间
- `flex`: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ], 默认为0 1 auto
- `align-self`: 允许单个项目与其他项目不一样的对齐方式，可以覆盖
## 清除浮动
- 添加额外标签，并设置`clear: both`;
- 父级增加overflow属性，或者设置高度
- 建立伪类选择器清除浮动
```
//在css中添加:after伪元素
.parent:after{
    /* 设置添加子元素的内容是空 */
    content: '';
    /* 设置添加子元素为块级元素 */
    display: block;
    /* 设置添加的子元素的高度0 */
    height: 0;
    /* 设置添加子元素看不见 */
    visibility: hidden;
    /* 设置clear：both */
    clear: both;
}
```
## a标签伪类
主要包括：link、visited、hover、active  
- link：a标签未被访问时的样式属性
- visited：a标签已被访问过时的样式属性
- hover：鼠标悬停时的样式属性
- active：被用户激活(鼠标点击与释放之前的事件)时的样式属性
**正确顺序：a:link、a:visited、a:hover、a:active**
## @media
@media媒体查询，可以根据不同的媒体类型定义不同的样式
### 媒体类型
- all：适用于所有设备
- print：适用于打印预览模式下在屏幕查看的分页材料和文档
- screen：用户屏幕
### 媒体特性
用户描述输出设备或环境的具体特征
- width: 输出设备中的页面可见区域宽度
- height：输出设备中的页面可见区域高度
- max-width: 输出设备中的页面最大可见区域宽度
- max-height: 输出设备中的页面最大可见区域高度
- aspect-ratio: 输出设备中的页面可见区域宽度与高度的比例
# node
## koa
- 创建http server
- 构造request、response、context对象
- 中间件处理
- 请求路由
- body解析
- 错误处理
```
const app = new Koa();
app.use(async (ctx, next) => {
  console.log('fn1 start');
  await next();
  console.log('fn1 end');
})
app.use(async (ctx, next) => {
  console.log('fn2 start');
  await next();
  console.log('fn2 end');
})
app.use(async (ctx, next) => {
  console.log('fn3 start');
  await next();
  console.log('fn3 end');
})

fn1(ctx, next) {
  console.log('fn1 start');
  async fn2(ctx, next) {
    console.log('fn2 start');
    async fn3(ctx, next) {
      console.log('fn3 start');
      await Promise.resolve();
      console.log('fn3 end');
    }
    console.log('fn2 end');
  }
  console.log('fn3 end');
}
```
## koa和express的区别
- express集成了router、bodyparser等中间件；koa轻量化设计，需要引入插件
- 中间件机制
  - koa基于洋葱模型
  - express中间件线性执行
- express利用回调来支持异步；koa利用generator、async/await以同步方式实现异步
- 执行结果
  - express：直接操作res对象，直接ctx.send就响应了；虽然剩余中间件还会继续执行，但是不能影响最终的响应结果；所以express通常在最后一个中间件设置响应结果
  - koa：以ctx.body进行设置，但是**并不会立即响应**，等到所有中间件执行完之后才会响应
# 微信公众号相关
## oauth2.0授权
https://juejin.cn/post/7066716559808397343  
**主要角色**  
1. 客户端，某网站如一点号
2. 资源所有者，如用户
3. 资源服务器，如一点号服务端
4. 授权服务器，如微信开放平台