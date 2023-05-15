Function.prototype._bind = function(obj) {
  const fn = this;
  const args = Array.prototype.slice.call(arguments, 1);
  console.log('args: ', args);
  const fBound = function() {
    const newArgs = args.concat(Array.prototype.slice.call(arguments));
    /**
     * bind返回的函数可以通过new来调用，丢失了绑定的obj的this指针；此时this指向new产生的实例对象
     * 通过new调用时，this.constructor指向构造函数本身（以此来区分是new调用还是普通调用）
     */
    return fn.apply(this.constructor === fn ? this : obj, newArgs);
  }

  // 中介函数：防止通过实例__proto__修改了实例原型属性，因此借用空白函数作为中介
  const fNOP = function () {};
  fNOP.prototype = fn.prototype;
  // fBound需要继承fn的所有属性和方法，保持new调用状态下继承关系
  fBound.prototype = new fNOP();

  return fBound;
}

const obj = {
  a: 1,
  b: 2,
}

const fn = function(x, y) {
  console.log('this.a + x', this.a + x + y);
}

const bound = fn._bind(obj, 2);
bound(3);