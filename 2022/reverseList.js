/**
 * 反转单向链表
 */
function reverseList(head) {
  if(!head || !head.next) return head;

  let pre = null;
  let current = head;
  let next;

  /**
   * 1、暂存当前节点的下一个节点
   * 2、将当前节点的next指向pre
   * 3、将pre设置为当前节点
   * 4、current设置为下一个节点
   */
  while(current) {
    next = current.next;
    current.next = pre;
    pre = current;
    current = next;

    console.log('pre:', pre);
  }

  return pre;
}

const list = {
  value: 1,
  next: {
    value: 2,
    next: {
      value: 3,
      next: {
        value: 4,
        next: {
          value: 5,
          next: {
            value: 6
          }
        }
      }
    }
  }
}

console.log(reverseList(list));