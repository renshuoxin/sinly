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
# 其他
## jsBridge
### JS调用Native实现方式
1. 注入API  
**核心原理**
- 通过`Webview`提供的接口，向JavaScript上下文注入对象或者方法
- 允许JavaScript进行调用时，直接执行对应的Native逻辑
2. URL Scheme劫持  
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
1. 构建CSSOM规则树：浏览器解析CSS文件并生成CSS规则树
2. 构建渲染树：通过DOM树和CSSOM规则树便可以构建渲染树。浏览器会从DOM树根节点开始遍历每个可见节点，并找到其适配的CSS样式规则并应用。
3. 渲染树布局(回流)：从渲染树的根节点开始遍历，确定每个节点在页面上的大小和位置，输出一个盒子模型。
4. 渲染树绘制：遍历渲染树，由渲染器将内容显示在屏幕上(将渲染树转换成屏幕上的像素)
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
由于每次回流会造成额外的计算消耗，因此目前大多数浏览器会通过队列批量执行回流过程。浏览器会将修改操作放入队列，直到多了一段时间或者达到一定阈值才会进行处理。但是，**当开发者获取布局信息时，会强制队列刷新**，如
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
- 服务端自从发送ACK确认报文后，做好了释放连接的准备，再次向客户端发送报文（FIN,ACK）：告诉客户端已经做好释放连接的准备了(此时服务端已经发成响应报文发送)
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
- `no-cache`: 要求客户端对资源进行缓存，但是否使用由协商缓存绝慈宁宫
- `no-store`: 所有资源都不缓存，包括强制缓存和协商缓存
- `public`: 所有内容都可以被缓存(包括客户端、代理服务器如CDN)
- `private`: 所有内容只有客户端能缓存，代理服务器不能缓存