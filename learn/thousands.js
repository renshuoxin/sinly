// 实现千分位加逗号
function formatNum(num) {
  num = num + '', str = '';
  for(let i = num.length - 1, j = 1; i >= 0; i--, j++) {
    if(j%3 == 0 && i != 0) {
      str += num[i] + ',';
      continue;
    }
    str += num[i];
  }
  return str.split('').reverse().join('');
}

function formatNum1(num) {
  num = num + '';
  let numArr = num.split('').reverse();
  return numArr.reduce((pre, cur, index) => {
    if(index % 3) {
      return cur + pre;
    } else {
      return cur + ',' + pre;
    }
  }, '')
}

console.log(formatNum1(12222223123))