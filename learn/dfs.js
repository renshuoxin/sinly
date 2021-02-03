// 递归实现深度优先深拷贝，先进后出
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

// let obj = {
//   test: 1,
//   b: {
//     c: {
//       i: 222,
//       j: 333
//     },
//     d: 22
//   },
//   e: {
//     f: 33
//   },
//   z: 4
// }
// dfs1(obj)

// 深度优先遍历DOM节点
function dfsTraversal1(root, nodeList) {
  if(!root) return;
  nodeList.push(root);
  for(let i = 0; i < root.children.length; i++) {
    dfsTraversal1(root.children[i], nodeList);
  }
}

function dfsTraversal2(root) {
  let nodeList = [];
  if(!root) return nodeList;
  nodeList.push(root);
  for(let i = 0; i < root.children.length; i++) {
    nodeList = nodeList.concat(dfsTraversal2(root.children[i]));
  }
}

function dfsTraversal3(root) {
  let nodeList = [], stack = [];
  if(root) {
    stack.push(root);
    while(stack.length) {
      let node = stack.shift();
      nodeList.push(node);
      for(let i = node.children.length -1; i >= 0; i--) {
        stack.push(node.children[i]);
      }
    }
  }
  return nodeList;
}

function deepCopy(obj) {
  const handleFunc = (func) => {
    // 箭头函数直接返回自身
    if(!func.prototype) return func;
    const bodyReg = /(?<={)(.|\n)+(?=})/m;
    const paramReg = /(?<=\().+(?=\)\s+{)/;
    const funcString = func.toString();
    // 分别匹配 函数参数 和 函数体
    const param = paramReg.exec(funcString);
    const body = bodyReg.exec(funcString);
    if(!body) return null;
    if (param) {
      const paramArr = param[0].split(',');
      return new Function(...paramArr, body[0]);
    } else {
      return new Function(body[0]);
    }
  }
  let type = Object.prototype.toString.call(obj);
  console.log(type)
  let ctor = obj.constructor;
  let copyTarget = null;
  switch(type) {
    case '[object Number]':
    case '[object Boolean]':
    case '[object String]':
    case '[object null]':
    case '[object undefined]':
    case '[object Symbol]':
      return obj;
    case '[object Function]':
      return handleFunc(obj);
    case '[object RegExp]':
    case '[object Date]':
      return new ctor(obj);
    case '[object Set]':
      copyTarget = new ctor();
      obj.forEach((item, key) => {
        copyTarget.add(deepCopy(item));
      })
      return copyTarget;
    case '[object Map]':
      copyTarget = new ctor();
      obj.forEach((item, key) => {
        copyTarget.set(deepCopy(key), deepCopy(item));
      })
      return copyTarget;
    case '[object Array]':
    case '[object Object]':
      copyTarget = new ctor();
      for(let key in obj) {
        if(obj.hasOwnProperty(key)) {
          copyTarget[key] = deepCopy(obj[key]);
        }
      }
      return copyTarget;
    default:
      return new ctor(obj);
  }
}

const obj = {
    arr: [111, 222],
    obj: {key: '对象'},
    a: () => {console.log('函数')},
    date: new Date(),
    reg: /正则/ig
}
console.log(deepCopy(obj));