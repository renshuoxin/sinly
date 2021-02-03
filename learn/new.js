function Person(name) {
  this.name = name;
}
Person.prototype.getName = function() {
  return this.name;
}

var p = new Person('renshuoxin')
p.__proto__ = Person.prototype;
/*
1、创建空对象
2、执行构造函数
3、关联原型链
4、返回构造函数的返回值 或者 是第一步的对象
 */

function _new(fn, ...args) {
  let obj = Object.create(fn.prototype);
  let result = fn.apply(obj, args);
  return result instanceof Object ? result : obj;
}