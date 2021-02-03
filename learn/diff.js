let oldVirsualNode = {
  tag: 'div',
  className: 'a'
}
let newVirsualNode = {
  tag: 'div',
  className: 'b'
}
function changeDom() {

}

if(oldVirsualNode.tag != newVirsualNode.tag || oldVirsualNode.className != newVirsualNode.className) {
  changeDom();
}

// 虚拟节点
/*{
  el: div,    //对真实节点的引用
  tagName: 'DIV',  //节点的标签
  sel: 'div#v.classA',    //节点选择器
  data: null,     // 存储节点属性的对象，对应节点的el[prop]属性，例如onclick, style
  children: [],   //子节点，每个节点都是vnode
  text: null   //如果是文本节点，对应textContent, 否则为null
}*/
function sameNode(oldVnode, vnode) {
  return oldVnode.el == vnode.el && oldVnode.sel == oldVnode.sel;
}
function patch(oldVnode, vnode) {
  if(sameNode(oldVnode, vnode)) {
    patchNode(oldVnode, vnode)
  } else {
    let oldEl = oldVnode.el;
    let parent = api.getParent(oldEl);
    createEl(vnode);
    if(parent != null) {
      api.insertBefore(parent, vnode.el,  api.getNextSibling(oldEl));
      api.deleteNode(parent, oldEl);
      oldVnode = null;
    }
  }
  return vnode;
}

function patchNode(oldVnode, vnode) {
  let oldCh = oldVnode.children, ch = vnode.children;
  let el = vnode.el = oldVnode.el;
  if(oldVnode.text != vnode.text) {
    api.setTextContent(el, vnode.text);
  }
  if(oldCh && ch && oldCh != ch) {
    api.updateChildren(el, oldCh, ch);
  } else if(ch) {
    createEle(vnode);  //create el's children dom
  } else if(oldCh){
    api.removeChilren(el);
  }
}

// diff算法核心
// https://github.com/aooy/blog/issues/2