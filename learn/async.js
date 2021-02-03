async function fn(args) {
  // ...
}

function fn(args) {
  return spawn(function *(){

  })
}

function *genFun() {

}
// 自己实现（基于promise的自执行）
function spawn(genFun) {
  return new Promise((resolve, reject) => {
    var gen = genFun();
    function next() {
      var cur = gen.next();
      if(cur.done) {
        resolve(cur.value);
      }
      cur.value.then(function(v) {
        gen.next(v);
      }, function(e) {
        gen.throw(e)
      })
    }
    next();
  })
}
// 标准实现（基于promise和thunk函数的自执行）
function spawn(genFun) {
  return new Promise((resolve, reject) => {
    var gen = genFun();
    function step(nextFun) {
      try {
        next = nextFun();
      } catch (error) {
        return reject(error)
      }
      if(next.done) {
        return resolve(next.value)
      }
      next.value.then(function(v) {
        step(function() { return gen.next(v)})
      }, function(e) {
        step(function() {
          return gen.throw(e)
        })
      })
    }
    step(function() {return gen.next()});
  }) 
}

// 实现一个sleep, 每隔一秒输出1，2，3，4，5
function sleep(interval) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, interval)
  })
}

async function runSleep() {
  for(let i = 1; i < 6; i++) {
    console.log(i);
    await sleep(1000);
  }
}
// 红灯2秒，黄灯1秒，绿灯3秒
async function changeColor(color, duration) {
  console.log(color);
  await sleep(duration);
}