var depth2 = (node) => {
  let stack = [];
  let nodes = [];
  if (node) {
    stack.push(node);
    while (stack.length) {
      //每次取最后一个
      let item = stack.pop();
      let children = item.children || [];
      nodes.push(item);
      //判断children的长度
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push(children[i]);
      }
    }
  }
  return nodes;
};

/**
 * 深度遍历-递归
 * @param {*} root 
 */
const dfsTraversal = (root) => {
  let result = [];
  result.push(root);
  for (let i = 0; i < root?.children?.length; i++) {
    result = result.concat(dfsTraversal(root.children[i]));
  }
  return result;
};

let obj = {
  children: [
    {
      index: 0,
      children: [
        {
          index: 1,
          children: [
            {
              index: 3,
            },
          ],
        },
      ],
    },
    {
      index: 4,
    },
    {
      index: 5,
      children: [
        {
          index: 7,
          children: [
            {
              index: 8,
            },
          ],
        },
      ],
    },
    {
      index: 6,
    },
  ],
};

console.log('非递归：', depth2(obj));
console.log('递归：', dfsTraversal(obj));