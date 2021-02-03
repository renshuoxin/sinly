/*
thunk函数：接口回调函数的单参数函数
 */
fs.readFile(filename, callback)

function Thunk(filename) {
  return function(callback) {
    return fs.readFile(filename, fn);
  }
}
let readFileThunk = Thunk(fileName);
readFileThunk(callback);


let Thunk = function(fn){
  return function() {
    let args = Array.prototype.slice.all(arguments);
    return function(callback) {
      args.push(callback);
      fn.apply(this. args);
    }
  }
}

var fs = require('fs');
var thunkify = require('thunkify');
var readFileThunk = thunkify(fs.readFile);

var gen = function* (){
  var r1 = yield readFileThunk('/etc/fstab');
  console.log(r1.toString());
  var r2 = yield readFileThunk('/etc/shells');
  console.log(r2.toString());
};

var g = gen();
var r1 = g.next();
r1.value(function(err, data) {
  if(err) throw err;
  var r2 = g.next(data);
  r2.value(function(err, data) {
    if(err) throw err;
    g.next(data);
  })
})

// 基于thunk函数的自动执行器
function run(fn) {
  var g = fn();
  function next(err, data) {
    var result = g.next(data);
    if(result.done) return;
    result.value(next);
  }
  next();
}

function *gen() {

}

run(g);

// 基于promise的自动执行器

var g = gen();

g.next().value.then(function(data){
  g.next(data).value.then(function(data){
    g.next(data);
  });
});

function runPromise(gen) {
  var g = gen();

  function next(data) {
    var result = g.next(data); //result.value => promise对象
    if (result.done) return result.value;
    result.value.then((data) => {
      next(data);
    })
  }

  next();
}
