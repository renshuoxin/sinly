/**
 * 构造函数继承
 */
function Person() {
  this.name = 'name';
  this.age = 12;

  this.getName = function() {
    return this.name;
  }
}

function Student() {
  Person.call(this);
}

Student.prototype = new Person(); // 建立Student和Person之间的继承关系
Student.prototype.constructor = Student; // 否则Student.prototype.constructor将指向Person

const stu = new Student();

console.log(stu.__proto__ === Student.prototype); // true;
console.log(Student.prototype.__proto__ === Person.prototype); // true
console.log(Student.prototype.constructor);

const stu1 = new Student();
const stu2 = new Student();

// 问题：stu1和stu2拷贝了Person类的所有属性和方法，同时也包含公用方法，造成了资源浪费

/**
 * 组合继承
 */
function Father() {
  this.name = 'name';
}

Father.prototype.getName = function() {
  return this.name;
}

function Child() {
  Father.call(this);
}

Child.prototype = new Father();
Child.prototype.constructor = Child;

const cl = new Child();

// 如此：cl继承了Father的属性，但是并不会拷贝getName方法；会通过原型链访问