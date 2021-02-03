function flat(arr, depth) {
  if(!arr) return null;
  if(!arr.length) return null;
  // console.log(depth,isNaN(depth))
  if(isNaN(depth) || depth < 0 || !Array.isArray(arr)) throw new Error('参数格式不对');
  if(depth == 0) return arr;
  return arr.reduce(function(result, item) {
    if(Array.isArray(item)) {
      console.log(item, depth)
      return result.concat(flat(item, depth - 1));
    } else {
      return result.concat(item);
    }
  }, [])
}

function flattern(arr) {
  let res = [];
  for(let i = 0; i < arr.length; i++) {
    if(Array.isArray(arr[i])) {
      res = res.concat(flattern(arr[i]));
    } else {
      res.push(arr[i]);
    }
  }
  return res;
}
function flattern1(arr) {
  return arr.reduce(function(pre, cur) {
    return pre.concat(Array.isArray(cur) ? flattern1(cur) : cur)
  }, [])
}
function flattern2(arr) {
  while(arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr);
  }  
  return arr;
}

console.log(flattern2([1, [2, [3, [9]]], 2, [3, [4,5]]]))