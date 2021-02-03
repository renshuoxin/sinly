// x instanceof y

while(x.__proto__) {
  if(x.__proto__ == y.prototype) {
    return true;
  }
  x.__proto__ = x.__proto__.__proto__;
}
if(!x.__proto__) {
  return false;
}

function F() {}
function O() {}
O.prototype = new F();
// obj.__proto__ === O.prototype;
// O.prototype.__proto__ === F.prototype
var obj = new O();
console.log(obj instanceof O); // true
console.log(obj instanceof F); // true
console.log(obj.__proto__ === O.prototype); // true
console.log(obj.__proto__.__proto__ === F.prototype); // true

// 调换下顺序
function F() {}
function O() {}
var obj = new O();
O.prototype = new F();
console.log(obj instanceof O); // false
console.log(obj instanceof F); // false
console.log(obj.__proto__ === O.prototype); // false
console.log(obj.__proto__.__proto__ === F.prototype); // false