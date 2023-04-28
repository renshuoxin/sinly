/**
 * 将数组转换为树
 * 缺点：只能处理单层子节点嵌套
 */
function arrToTree(arr) {
  const copyArr = Array.from(arr);
  copyArr.forEach(item => {
    const children = copyArr.filter(child => child.pid === item.value);
    item.children = children.length ? children : [];
  });

  return copyArr;
}


function arrToTreeDeep(arr) {
  const result = arr.find(item => !item.pid || item.pid === 0);
  const getChildren = (data, pid) => {
    const childrenList = [];
    data.forEach((item) => {
      if (item.pid === pid) {
        const children = {...item, children: []};
        children.children = getChildren(data, item.value);
        childrenList.push(children);
      }
    })
    return childrenList;
  }

  result.children = getChildren(arr, result.value);
  return result;
}

const arr = [{
  value: 1,
  pid: '',
}, {
  value: 2,
  pid: 1,
}, {
  value: 3,
  pid: 1,
}, {
  value: 4,
  pid: 2,
}, {
  value: 5,
  pid: 2,
}, {
  value: 6,
  pid: 5,
}, {
  value: 7,
  pid: 5,
}, {
  value: 8,
  pid: 5,
}]

const tree = arrToTree(arr);
console.log('tree: ', tree);

const tree1 = arrToTreeDeep(Array.from(arr));
console.log('tree1: ', JSON.stringify(tree1));