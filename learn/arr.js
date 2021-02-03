function fun(arr) {
  let result = new Set(flatter(arr));
  console.log(result)
  let resArr = Array.from(result);
  return resArr.sort(function(a,b) {
    return a - b;
  });
}

function flatter(arr) {
  // let result = [];
  // for(let i = 0; i < arr.length; i++) {
  //   if(Array.isArray(arr[i])) {
  //     result = result.concat(flatter(arr[i]));
  //   } else {
  //     result.push(arr[i]);
  //   }
  // }
  // return result;

  return arr.reduce(function(result, item, index) {
    return result.concat(Array.isArray(item) ? flatter(item) : item)
  }, [])
}

console.log(fun([ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10]))