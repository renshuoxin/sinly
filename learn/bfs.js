function bfs(obj) {
  let list = [], result = {}, copyList = [];
  list.push(obj);
  copyList.push(result);
  while(list.length) {
    let tmpCopy = copyList.shift();
    let tmpObj = list.shift();
    for(let key in tmpObj) {
      if(typeof(tmpObj[key]) === 'object') {
        tmpCopy[key] = {};
        list.push(tmpObj[key]);
        copyList.push(tmpCopy[key]);
      } else {
        tmpCopy[key] = tmpObj[key];
      }
    }
  }
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
bfs(obj)

function bfsTraversal(root) {
  let nodeList = [], nodes = [];
  nodeList.push(root);
  while(nodeList.length) {
    let node = nodeList.shift();
    nodes.push(node);
    for(let i = 0; i < node.children.length; i++) {
      nodeList.push(node.children);
    }
  }
  return nodes;
}