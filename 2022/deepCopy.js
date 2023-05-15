/**
 * 深度拷贝
 */
function deepCopy(obj) {
  const type = Object.prototype.toString.call(obj);

  const ctor = obj.constructor;
  let copyTarget = null;
  switch(type) {
    case '[object Number]':
    case '[object String]':
    case '[object Boolean]':
    case '[object undefined]':
    case '[object null]':
    case '[object Symbol]':
      return obj;
    case '[object Date]':
    case '[object RegExp]':
      return new ctor(obj);
    case '[object Set]':
      copyTarget = new Set();
      for (let value of obj) {
        copyTarget.add(deepCopy(value));
      }
      return copyTarget;
    case '[object Map]':
      copyTarget = new Map();
      obj.forEach((val, key) => {
        copyTarget.set(deepCopy(key), deepCopy(val));
      });

      return copyTarget;
    case '[object Array]':
      copyTarget = new Array();
      obj.forEach((item) => {
        copyTarget.push(deepCopy(item));
      })

      return copyTarget;
    case '[object Object]':
      copyTarget = {};
      for (let key in obj) {
        copyTarget[key] = deepCopy(obj[key]);
      }

      return copyTarget;
    default:
      return new ctor(obj);
  }
}

const obj = {
  arr: [111, 222],
  obj: {key: '对象'},
  date: new Date(),
  reg: /正则/ig
}

console.log(deepCopy(obj));