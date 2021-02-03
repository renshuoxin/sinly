// 随机生成 300-1000的整数
function random() {
  // Math.random() (0,1)
  return 300 + Math.floor(Math.random() * 700);
}

// console.log(random());

// 接下来用刚才的随机数方法，模拟一次 api 请求的过程：
// 由于网络延迟，本地和服务器之间会有随机的延迟，范围是 300 - 1000 ms。
// api 请求会返回请求到达服务器时服务器的时间戳。
// 提示：由于随机延时，返回的时间戳每次运行应该不同。同时发起的请求，返回的时间戳可能不是顺序的。
function api() {
  // 服务端接口
  let request = new Promise(resolve => {
    setTimeout(() => {
      resolve(Date.now());
    }, random())
  })
  // 本地和服务器之间的网络延迟
  return request.then(timestamp => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(timestamp);
      }, random());
    })
  })
}

// api().then(console.log);

//手动发请求太慢了，请你写一个函数可以一次性发一堆请求。
// 提示：
// 1. 如果有可能，请提供多种解法
// 2. 如果有可能，保证类型更精确

function batchApi(api, count) {
  // 考如何生成数组
  // one
  // let result = [];
  // for(let i = 0; i < count; i++) {
  //   result.push(api);
  // }
  // return result;
  // two
  // return Array.from({length: count}, () => api);
  // three
  return new Array(count).fill(api);
}

// batchApi(api, 3).map(caller => caller().then(console.log));

// 请求发出去了，但是后端发现请求的并发量太大，要求前端进行并发控制。
// 先考虑一种最简单的控制方案：
// 对于给定的一组 api 请求，每次都等上一个请求返回之后再发起下一个请求。
// 提示：记得把返回的时间戳打印出来
function control(apiCalls) {
  // 对于reduce理解偏差，回调函数第一个参数
  // apiCalls.reduce((pre, api) => {
  //   return pre.then(() => {
  //     return api().then(t => {
  //       console.log(t);
  //     });
  //   })
  // }, Promise.resolve(0));

  function next(i) {
    if(i === apiCalls.length) return;
    api().then(t => {
      console.log(t);
      next(i + 1);
    })
  }
  next(0);
}

control(batchApi(api, 3))