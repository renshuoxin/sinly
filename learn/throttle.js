// 函数节流：保证n秒内函数只会执行一次，稀释函数执行频率
function throttle(fn) {
  let ing = false;
  return function() {
    if(ing) return;
    ing = ture;
    setTimeout(() => {
      fn.apply(this, arguments);
      ing = false;
    }, 500)
  }
}

// 函数防抖：保证n秒内函数只会执行一次，如果n秒内再次有事件触发，则重新计算时间
function debounce(fn) {
  let timer = null;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, 500)
  }
}

function fun() {
  console.log(this);
  console.log('函数防抖')
}

// debounce(sayHi)()
// let inp = document.createElement('input');
// inp.addEventListener('input', debounce(sayHi));

// 控制时序
function fun() {
  let timer;
  next();
  function next(curCount) {
    clearTimeout(timer);
    Promise.race([
      new Promise((resolve, reject) => {
        let time = Math.ceil(Math.random() * 5000);
        setTimeout(() => {
          resolve(time);
        }, time);
      }), new Promise((resolve, reject) => {
      timer = setTimeout(function() {
        resolve('timeout');
      }, 3000);
    })]).then((result) => {
      console.log('time:', result);
      if(result != 'timeout') {
        console.log('执行渲染');
      }
    })
  }
  setTimeout(() => {
    fun();
  }, 3000);
}
fun();
