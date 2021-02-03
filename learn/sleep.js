// es5
function sleep(callback) {
  setTimeout(() => {
    callback();
  }, 1000)
}

sleep(function() {
  console.log(1);
})

// promise实现
function sleep() {
  return new Promise((resolve, reject) =>{
    setTimeout(resolve, 1000);
  })
}

sleep.then(() => {
  console.log(1)
})

// async/await
// promise实现
function sleep() {
  return new Promise((resolve, reject) =>{
    setTimeout(resolve, 1000);
  })
}

async function runSleep() {
  await sleep();
  console.log(1);
}

// gererator实现
function * gen() {
  yield new Promise((resolve, reject) => {
    setTimeout(resolve, 1000);
  })
}

gen().next().value.then(() => {
  console.log(1)
})