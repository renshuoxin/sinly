// vue 入口
function Vue(options) {
  var data = options.data;
  data = typeof data === 'function' ? data() : data || {};

  observe(data);
  Watcher(this, this.render, this._update);
}

function defineReactive(data, key, value) {
  let dep = new Dep();
  observe(value);

  Object.defineProperties(data, key, {
    get: function() {
      // 获取对象属性值 && 依赖收集
      Dep.target && dep.addSub(Dep.target);
      return value;
    },
    set: function(newVal) {
      // 设置对象属性值，并通知DOM更新
      value = newVal;
      // 通知订阅者
      dep.notify();
    },
  })
}

function observe(data) {
  if (!data || typeof data !== 'object') return;
  for (let key in data) {
    defineReactive(data, key, data[key]);
  }
}

/**
 * Watcher 订阅者
 * @param vm vue实例 
 * @param render 渲染函数
 * @param cb 更新回调函数
 */
class Watcher {
  constructor(vm, exp, cb) {
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;

    this.value = this.get();
  }

  update() {

  }

  get() {
    Dep.target = this;

    // 实质上执行vm._render生成VNode，此时便会访问vm上的数据，就触发了数据对象的getter
    const value = this.vm.data[this.exp]; // 模拟，强行调用数据对象的getter方法
    Dep.target = null;
    return value;
  }
}

/**
 * Dep对Watcher进行管理
 */
class Dep {
  static target;
  constructor() {
    this.subs = []; // Watcher数组
  }

  addSub(sub) {
    this.subs.push(sub);
  }

  notify() {
    for (let i = 0; i < this.subs.length; i++) {
      // 通知Watcher进行更新
      this.subs[i].update();
    }
  }
}

/**
 * 过程分析
 * 1、对数据对象访问时，会触发getter方法，进行依赖收集
 * 2、数据对象访问时机：mount -> mountComponent -> Watcher初始化new Watcher -> 构造函数调用get方法
 * -> updateComponent -> vm._render -> 生成VNode -> 访问数据对象 -> 触发getter
 * 3、依赖收集：vm._render会触发所有数据的getter -> 递归访问数据对象，触发所有子项的getter -> 恢复Dep.target到上一个状态（Dep.target = null）
 * -> 清空依赖，避免浪费（当DOM不存在时，修改了DOM对应的数据，会触发订阅回调）
 */