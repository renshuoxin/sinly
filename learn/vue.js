// 订阅者watcher
function defineReactive(data, key, val) {
  let dep = new Dep();
  observe(val);
  Object.defineProperty(data, key, {
    get: function() {
      // 自己的思路
      /*
        let wa = new watcher();
        this.subs.push(wa);
       */
      // ????????由于需要在闭包内添加watcher，所以通过Dep定义一个全局target属性，暂存watcher, 添加完移除
      Dep.target && dep.subs.push(Dep.target);
      return val;
    },
    set: function(newVal) {
      console.log(val, newVal);
      val = newVal;
      dep.notify();  //通知所有订阅者
    }
  })
}

function observe(data) {
  if(!data || typeof(data)!= 'object') return;
  for(let key in data) {
    defineReactive(data, key, data[key]);
  }
}

// var obj = {
//   a: 1,
//   b: 2
// }

// observe(obj)
// console.log(obj)


function Dep() {
  this.subs = [];
}
Dep.prototype.addSub = function(sub) {
  this.subs.push(sub);
}
Dep.prototype.notify = function() {
  this.subs.forEach(sub => {
    sub.update();
  })
}

function watcher(vm, exp, cb) {
  this.vm = vm;
  this.exp = exp;
  this.value = this.get();
  this.cb = cb;
}

watcher.prototype = {
  update: function() {
    this.run();
  },
  run: function() {
    let oldVal = this.value;
    let val = this.vm.data[this.exp];
    if(val != oldVal) {
      this.cb.call(this.vm, val, oldVal);  //执行compiler回调，更新视图
    }
  },
  get() {
    Dep.target = this;  //依赖收集的关键点之一（类比computed依赖收集）
    var value = this.vm.data[this.exp];  //强行调用属性的get方法
    Dep.target = null;
    return value;
  }
}

/*
1、解析模板指令，并将模板中变量替换成对应的数据，初始化渲染页面视图
2、将每个指令对应的节点绑定更新函数，添加监听数据的订阅者；一旦数据变动，收到通知，更新视图
 */
function complier() {
  
}

// 虚拟dom
let vnode = {
  tag: '',
  el: '',  //真实DOM的引用
  text: '',
  key: '',
  children: [],
  data: {}
}