// 递归实现深度优先遍历，先进后出
function dfs(obj) {
  let result =  {};
  const copy = function(obj, result) {
    for(let key in obj) {
      if(typeof(obj[key]) === 'object') {
        result[key] = {};
        copy(obj[key], result[key]);
      } else {
        result[key] = obj[key];
      }
    }
  }
  copy(obj, result);
  console.log(JSON.stringify(result))
  return result;
}

// 如何按照深度进行入栈
function dfs1(obj) {
  let list = [], result = {}, copyList = [];
  list.push(obj);
  copyList.push(result);
  
  // while(list.length) {
  //   let tmp = list.pop();
  //   for(let key in tmp) {
  //     if(typeof(tmp[key]) === 'object') {
  //       list.push(tmp[key]);
  //     } else {
        
  //     }
  //   }
  // }
  console.log(JSON.stringify(result))
  return result;
}

let obj = {
  test: 1,
  b: {
    c: {
      i: 222,
      j: 333
    },
    d: 22
  },
  e: {
    f: 33
  },
  z: 4
}
dfs1(obj)