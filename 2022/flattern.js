/**
 * 数组扁平化
 */
function flattern(arr) {
  return arr.reduce((result, cur) => {
    // console.log('result:', result);
    return result.concat(Array.isArray(cur) ? flattern(cur) : cur);
  }, [])
}

const arr = [1, [2, 3], [4, [5, 6]]];
console.log(flattern(arr));