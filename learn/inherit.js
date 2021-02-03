/*
参考：
1、 https://juejin.cn/post/6844903623852294151
2、 https://juejin.cn/post/6844903635600556039（Object和Function的关系）
1）一切对象都最终继承自Object对象，Object对象直接继承自根源对象null
2）一切函数对象（包括Object、Function）都继承自Function对象
Function.__proto__ === Function.prototype
3) Object对象继承自Function对象
Object.__proto__ === Function.prototype
Object → Function.prototype → Object.prototype → null
4）Function对象直接继承自己，最终继承自Object对象
Function → Function.prototype → Object.prototype → null
 */
// 构造函数继承
function Person() {
  this.name = '';
  this.age = '';

  this.getName = function() {
    return this.name;
  }
}
function Student() {
  Person.call(this);
}
Student.prototype = new Person();
Student.prototype.constructor = Student;

// 组合继承（构造函数继承 + 原型链继承）
function Father() {
  this.name = '';
}
Father.prototype.getName = function() {
  return this.name;
}
function Child() {
  // 构造函数继承
  Father.call(this);
}
Child.prototype = new Father();
// 否则Child.prototype.constructor指向了Father
Child.prototype.constructor = Child;

function run () {
  let stu1 = new Student();
  let stu2 = new Student();
  // stu1和stu2拷贝了Person类中所有的属性和方法，包括公用的方法；然而公用方法不需要添加到每个实例上，导致内存增大 
  console.log(stu1, stu2);


  let cl = new Child();
  // Child.prototype == Father的实例对象.__proto__
  // cl.__proto__ = Child.prototype = Father.prototype
  console.log(cl);

}
export default run

function myNew() {
  let result = {};
  let args = Array.from(arguments);
  let f = args.unshift();
  result.__proto__ = f.prototype;
  return result;
}
function Person() {
  this.name = "renshuoxin";
  return {};
}

Person.prototype.getName = function() {
  return this.name;
}

function Student() {
  Person.call(this);
  this.age =  14;
}

Student.prototype = new Person();

var foo = {},
F = function(){};
Object.prototype.a = 'value a';
Function.prototype.b = 'value b';
// foo.__proto__ == Object.prototype
console.log(foo.a)   // value a
console.log(foo.b)   // undefined
// F.__proto__ == Function.prototype
// Function.prototype.__proto__ == Object.prototype
console.log(F.a)   // value a   
console.log(F.b)   // value b





