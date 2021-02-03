// 改造以下代码，输出0-9
for (var i = 0; i< 10; i++){
  setTimeout((i) => {
    console.log(i);
  }, 1000)
}

// 利用settimeout的第三个参数，传递给执行函数的参数
function fun() {
  for (var i = 0; i< 10; i++){
    setTimeout((i) => {
      console.log(i);
    }, 1000, i)
  }
}

// 利用es6 let块级作用域
function fun1() {
  for (let i = 0; i< 10; i++){
    setTimeout(() => {
      console.log(i);
    }, 1000)
  }
}

// 利用立即执行函数构造块级作用域
function fun2() {
  for (var i = 0; i< 10; i++){
    (function(i) {
      setTimeout(() => {
        console.log(i);
      }, 1000)
    })(i)
  }
}

function fun3() {
  for (let i = 0; i< 10; i++){
    setTimeout(((i) => {
      console.log(i);
    })(i), 1000)
  }
}