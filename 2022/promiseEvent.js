new Promise(() => {
  throw new Error('错误');
}).then(() => {
  console.log(1);
}, () => {
  console.log(2);
}).catch(() => {
  console.log(3);
}).then(() => {
  console.log(4);
})