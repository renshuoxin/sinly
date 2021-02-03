// 先序遍历：根 -> 左 -> 右
// 递归
function preVisitRecursive(root) {
  if(root) {
    console.log(root.val);
    preVisitRecursive(root.left);
    preVisitRecursive(root.right)
  }
}
// 非递归
function preVisit(root) {
  let treeNode = [], curNode = root;
  while(curNode != null || treeNode.length > 0) {
    if(curNode != null) {
      console.log(curNode.val);
      treeNode.push(curNode);
      curNode = curNode.left;
    } else {
      curNode = treeNode.pop();
      curNode = curNode.right;
    }
  }
}

// 中序遍历 左 -> 根 -> 右
function midVisit(root) {
  let treeNode = [], curNode = root;
  while(curNode || treeNode.length) {
    if(curNode) {
      treeNode.push(curNode);
      curNode = curNode.left;
    } else {
      curNode = treeNode.pop();
      console.log(curNode.val);
      curNode = curNode.right;
    }
  }
}
function midVisitRecursive(root) {
  if(root) {
    midVisitRecursive(root.left);
    console.log(root.val);
    midVisitRecursive(root.right);
  }
}
// 后续遍历 左 -> 右 -> 根
function postVisitRecursive(root) {
  if(root) {
    postVisitRecursive(root.left);
    postVisitRecursive(root.right);
    console.log(root.val)
  }
}

function postVisit(root) {
  let treeNode = [], curNode = root;
  while(curNode || treeNode.length) {
    if(curNode) {
      curNode.isFirst = true;
      treeNode.push(curNode);
      curNode = curNode.left;
    } else {
      curNode = treeNode.pop();
      if(curNode.isFirst) {
        curNode.isFirst = false;
        treeNode.push(curNode);
        curNode = curNode.right;
      } else {
        console.log(curNode.val);
        curNode = null;
      }
    }
  }
}

let root = {
  val: 1,
  left: {
    val: 2,
    left: {
      val: 4
    },
    right: {
      val: 5,
      left: {
        val: 7
      },
      right: {
        val: 8
      }
    }
  },
  right: {
    val: 3,
    right: {
      val: 6
    }
  }
}

// preVisit(root);
// preVisitRecursive(root)
// midVisit(root);
// midVisitRecursive(root);
postVisit(root);