// Symbol是一种原始数据类型，表示独一无二的值

let s = Symbol();

// 1、作用：作为对象属性名，标识其唯一性
let s1 = Symbol('a');
let s2 = Symbol('a');

s1 === s2 // false

// 2、使用方式（切记不能使用new）: 参数表示对Symbol实例的描述
let s3 = Symbol();

// 3、参数为对象: 先调用对象的toString方法将其转为字符串，然后再生成一个Symbol值
let s4 = Symbol({a: 1}); // Symbol([object Object])
// 详解
let obj = {a: 1};
obj.toString(); // '[object Object]'

/**
 * 4、运算
 * - 不能与其他类型的值进行运算
 * - 可以显式转为字符串
 * - 可以转为布尔值，但是不能转为数值
 */
let s5 = Symbol('a');
s5 + 1; // Uncaught TypeError: Cannot convert a Symbol value to a number
s5 + '1'; // Uncaught TypeError: Cannot convert a Symbol value to a string

String(s5); // Symbol(a)
s5.toString(); // Symbol(a)

!s5; // false
!!s5; // true
Number(s5); // Uncaught TypeError: Cannot convert a Symbol value to a number
