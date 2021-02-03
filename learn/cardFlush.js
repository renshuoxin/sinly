// 判断给出的扑克牌是不是顺子，大小王用a,b表示，可以表示任意值
// 1，2 4,5,a 是
// 1，2，4，5，6 不是
function flush(str) {
  let arr = str.split(','), count = 0, tmpArr = [];
  arr.forEach(item => {
    if(item == 'a' || item == 'b') {
      count++;
    } else {
      tmpArr.push(item);
    }
  })
  let len = tmpArr.length;
  tmpArr.sort((a, b) => { return a - b });
  if(tmpArr[len - 1] - tmpArr[0] == len - 1 || tmpArr[len - 1] - tmpArr[0]== len + count - 1 || tmpArr[len - 1] - tmpArr[0]== len + count - 2) {
    return true;
  } else {
    return false;
  }
}

// console.log(flush('1,2'))
console.log(flush('4,5,a'))
console.log(flush('1,2,4,5,6'))
console.log(flush('1,a,2,4'))