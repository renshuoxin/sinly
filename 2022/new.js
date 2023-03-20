/**
 * 1、创建空对象
 * 2、关联原型链
 * 3、执行构造函数
 * 4、返回对象
 */
function myNew(fn, ...rest) {
  const obj = Object.create(fn.prototype);
  const result = fn.apply(obj, rest);
  return result instanceof Object ? result : obj;
}

function Person(name, age) {
  this.name = name;
  this.age = age;
}

const p = myNew(Person, 'renshuoxin', 12);

p.__proto__ === Person.prototype; // true
