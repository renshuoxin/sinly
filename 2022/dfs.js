var depth2 = (node) => {
  let stack = [];
  let nodes = [];
  if (node) {
    stack.push(node);
    while (stack.length) {
      //每次取最后一个
      console.log('stack:', JSON.stringify(stack));
      let item = stack.pop();
      console.log('item: ', item);
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

depth2(obj);