/**
 * 广度优先遍历：递归
 */
function bfsTraversal(root) {
  let result = [];
  // if (!result.length) result.push(root.value);
  for (let i = 0; i < root?.children?.length; i++) {
    result.push(root.children[i].value);
  }
  for (let i = 0; i < root?.children?.length; i++) {
    result = result.concat(bfsTraversal(root.children[i], result));
  }
  return result;
}

/**
 * 广度优先遍历：非递归
 */
function bfsTraversal1(root) {
  if (!root) return [];
  const stack = [];
  const result = [];
  stack.push(root);

  while (stack.length) {
    const node = stack.shift();
    result.push(node.value);
    for (let i = 0; i < node?.children?.length; i++) {
      stack.push(node.children[i]);
    }
  }
  return result;
}

const obj = {
  value: 1,
  children: [{
    value: 2,
    children: [{
      value: 4
    }, {
      value: 5
    }]
  }, {
    value: 3,
    children: [{
      value: 6,
    }, {
      value: 7,
    }]
  }]
}

// let result = [];
const result = bfsTraversal(obj);
console.log('result: ', result);

const result1 = bfsTraversal1(obj);
console.log('result1: ', result1);
