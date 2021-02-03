// 实现bind函数
function bind(oThis) {
  let fBind = this;  //this指向绑定的函数
  let args = Array.prototype.slice.call(arguments, 1);  // 获取除去oThis之外的参数
  
  let fNOP = function() {},
      fBound = function() {
        return fBind.apply(this instanceof fNOP ? this : oThis, args);
      }
  //  如果是通过new调用（生成obj），那么obj.__proto__ == fBound.prototype,
  // 而fBound.prototype.__proto__ == fNOP.prototype
  // 所以通过new 调用时，this instanceof fNOP成立
  // 否则bind将this关联到oThis上
  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  return fBound;
}

function fun() {
  this.a = 1;
  console.log(this.a)
}

function myBind(oThis) {
  let fBind = this;
  let args = Array.prototype.slice.apply(arguments, 1);

  let fBound = function() {
    return fBind.apply(this instanceof fBound ? this : oThis, args);
  }

  fBound.prototype = Object.create(this.prototype);
  return fBound;
}