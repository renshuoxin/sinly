/**
 * 实现并发请求，最大并发请求限制为n
 * 参考：https://www.cnblogs.com/echolun/p/15906939.html
 */

const addRequest = scheduler1(2);

const request1 = () => new Promise((resolve) => {
  console.log('request1 doing');
  setTimeout(() => {
    resolve(1);
  }, 1000);
})

const request2 = () => new Promise((resolve) => {
  console.log('request2 doing');
  setTimeout(() => {
    resolve(2);
  }, 500);
})

const request3 = () => new Promise((resolve) => {
  console.log('request3 doing');
  setTimeout(() => {
    resolve(3);
  }, 600);
})

const request4 = () => new Promise((resolve) => {
  console.log('request4 doing');
  setTimeout(() => {
    resolve(4);
  }, 800);
})
addRequest(request1).then((res) => {
  console.log('request1:', res);
})
addRequest(request2).then((res) => {
  console.log('request2:', res);
})
addRequest(request3).then((res) => {
  console.log('request3:', res);
})
addRequest(request4).then((res) => {
  console.log('request4:', res);
})

/**
 * 执行顺序：
 * 先执行1和2
 * 500ms后，2结束，执行3
 * 1000ms后，1结束，放进4
 * 600ms后，3结束
 * 800ms后，4结束
 */

function scheduler(max) {
  const pool = [];
  let count = 0;

  const run = async () => {
    if (count >= max || !pool.length) {
      console.log('run is over max');
      return;
    }
    count++;
    const nextReq = pool.shift();
    try {
      const result = await nextReq();
      console.log('result: ', result);
      count--;
      return result;
    } catch (error) {
      count--;
      return error;
    } finally {
      run();
    }
  }

  return async (request) => {
    pool.push(request);
    return await run();
  }
}

function scheduler1(max) {
  const pool = [];
  let count = 0;

  const run = () => {
    if (!pool.length || count >= max) return;

    const [nextRequest, resolve, reject] = pool.shift();
    count++;
    nextRequest()
    .then(resolve)
    .catch(reject)
    .finally(() => {
      count--;
      run();
    })
  }

  return (request) => {
    return new Promise((resolve, reject) => {
      pool.push([request, resolve, reject]);
      run();
    });
  }
}

