/**
 * 实现add函数
 * add(1); // 1
 * add(1)(2);  // 3
 * add(1)(2)(3)； // 6
 * add(1)(2)(3)(4)； // 10 
 */

// 思路：1、返回函数；2、打印函数时，调用的是toString方法，输出计算结果

// function add(a) {
//   function sum(b) {
//     a += b;
//     return sum;
//   }

//   sum.toString = function() {
//     return a;
//   }

//   return sum;
// }

// console.log(add(1) + '');

/**
 * 柯里化 —— 延迟计算
 */

const add = (...args) => args.reduce((a, b) => a + b);

function curring(func) {
  const params = [];
  return function result(...rest) {
    if (rest.length === 0) {
      return func(...params);
    } else {
      params.push(...rest);
      return result;
    }
  }
}

const sum = curring(add);
console.log(sum(1)(2)());

function curry(fn, args) {
  const length = fn.length;
  args = args || [];
  const result = function() {
    const newArgs = args.concat(Array.prototype.slice.call(arguments));
    if (newArgs.length < length) {
      return curry(fn, newArgs);
    } else {
      return result.apply(this, newArgs);
    }
  }

  return result;
}

