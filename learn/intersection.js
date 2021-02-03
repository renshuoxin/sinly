function intersection(arr1, arr2) {
  // [1, 2, 3,4,5] [2,3,4,5,6]
  return arr1.filter(item => arr2.indexOf(item) > -1);
}

console.log(intersection([1,2,2,3,4],[2,3,5,6]))

// [1,2,2,3,4] [2,3,5,6] 输出 [2,2,2,3,3]
function intersection1(arr1, arr2) {
  let result = [], map = new Map();
  arr1.forEach(item => {
    if(arr2.indexOf(item) > -1) {
      result.push(item);
      if(!map.get(arr2.indexOf(item))) {
        map.set(arr2.indexOf(item), true);
        result.push(item);
      }
    }
  })
  return result;
}

console.log(intersection1([1,2,2,3,4],[2,3,5,6]))