const addRequest = scheduler(3);

const request1 = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve(1);
  }, 800);
})

const request2 = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve(2);
  }, 500);
})

const request3 = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve(3);
  }, 1000);
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

function scheduler(max) {
  let remain = max;
  const pool = [];

  const run = () => {
    if (remain <= 0 || !pool.length) return;
    remain--;
    const curReq = pool.shift();
    return curReq().finally(() => {
      remain++;
      run();
    });
  }

  return (request) => {
    pool.push(request);
    return run();
  }
}