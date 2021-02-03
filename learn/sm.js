// 先来道热身题：生成一个随机整数，范围是 300 - 1000
// function random(): number {
//   // write your code here
//   return (300 + Math.floor(Math.random() * (1000-300)));
// }

// console.log(random())
// 接下来用刚才的随机数方法，模拟一次 api 请求的过程：
// 由于网络延迟，本地和服务器之间会有随机的延迟，范围是 300 - 1000 ms。
// api 请求会返回请求到达服务器时服务器的时间戳。
// 提示：由于随机延时，返回的时间戳每次运行应该不同。同时发起的请求，返回的时间戳可能不是顺序的。

function random(): number {
  // write your code here
  return (300 + Math.floor(Math.random() * (1000-300)));
}
function api(): Promise<number> {
	const request = new Promise<number>(resolve => {
    setTimeout(() => resolve(Date.now()), random())
  })
  return request.then((timestamp) => new Promise(resolve => setTimeout(() => resolve(timestamp), random())))
}

// // api().then(console.log)

// 手动发请求太慢了，请你写一个函数可以一次性发一堆请求。
// 提示：
// 1. 如果有可能，请提供多种解法
// 2. 如果有可能，保证类型更精确

function batchApi(api: any, count: number): Array<any> {
  // write your code here
  //   one
  let arr = new Array();
  for(let i = 0; i < count; i++) {
    arr.push(api);
  }
  console.log(arr)
  return arr;
}


// batchApi(api, 3).map(caller => caller().then(console.log))

// 请求发出去了，但是后端发现请求的并发量太大，要求前端进行并发控制。
// 先考虑一种最简单的控制方案：
// 对于给定的一组 api 请求，每次都等上一个请求返回之后再发起下一个请求。
// 提示：记得把返回的时间戳打印出来

function control(apiCalls: Array<() => Promise<number>>) {
  // write your code here
//   apiCalls.forEach((api) => {
//     api().then((result) => {
//       console.log(result);
//     })
//   })
  apiCalls.reduce(function(result, api) {
    return result.then((t) => {
      return api().then(() => {
        console.log(t);
      });
    })
  }, Promise.resolve<number>(0))
//   let i = 0;
//   function next(i) {
//     if(i == apiCalls.length) return;
//     i++;
//     api().then((t) => {
//       console.log(t);
//       next(i);
//     })
//   }
//   next(0)
}

control(batchApi(api, 3))

// 数组打平
function flat(arr, depth) {

}

// 写出单元测试，考虑边界条件
let arr = [1, 2, [3, [4, 5]]]
// 完全的扁平化case
console.log('case1')
let result = flat(arr, 2);
let expectRes = [1, 2, 3, 4, 5];
for(let i = 0; i < result.length; i++) {
  console.log(result[i] == expectRes[i])
}

// 不完全的扁平化case
console.log('case2')
let result1 = flat(arr, 1);  //实际值
let expectRes1 = [1, 2, 3, [4, 5]]  // 期望值
for(let i = 0; i < result.length; i++) {
  if(typeof(result[i]) === 'object') {
    console.log(JSON.stringify(result1[i]) === JSON.stringify(expectRes1[i]))
  } else {
    console.log(result[i] === expectRes[i]);
  }
}

// 边界条件
console.log('case3')
let result2 = flat(arr);
let expectRes2 = [1, 2, 3, 4, 5];
for(let i = 0; i < result.length; i++) {
  console.log(result[i] == expectRes[i])
}

let result3;
console.log('case4')
try {
  flat(arr, -1)
} catch(error) {
  result3 = error;
}
let expectRes3 = new Error("depth不能为赋值");
console.log(result3.message == expectRes3.message);

// depth超过实际深度值
console.log('case5')
let result4 = flat(arr, 3);
let expectRes4 = [1, 2, 3, 4, 5]

// depth传递不是数字
// arr传递是空数组
// arr传递不是数组