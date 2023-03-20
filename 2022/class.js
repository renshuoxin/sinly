/**
 * es5类和es6 class区别
 */
// ------- es6 class 不存在变量提升 --------
// let p = new Person();

// function Person(name) {
//   this.name = name;
// }

// Person.prototype.getName = function() {
//   console.log('name is:', this.name);
//   return this.name;
// }

// p.getName(); // name is: undefined

// let p1 = new Person();

// class Person {
//   constructor(name) {
//     this.name = name;
//   }

//   getName() {
//     console.log('es6 class name is:', this.name);
//   }
// }

// p1.getName(); // Uncaught ReferenceError: Person is not defined

/**
 * extends实现
 */

class Person {
  constructor(name) {
    this.name = name;
  }

  static fun() {
    console.log('static fun');
  }

  getName() {
    console.log('name is: ', this.name);
    return this.name;
  }
}

class Student extends Person {
  constructor(name, age) {
    super(name);
    this.age = age;
  }
}

let stu = new Student();
stu.getName();