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



