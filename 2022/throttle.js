/**
 * 节流：n秒内只执行一次，如果n秒内重复触发，只生效一次
 * 一段时间内只执行一次
 * @param fn 事件回调函数
 * @param delay 延迟时间
 * 
 * 应用场景
 * 1、滚动加载、加载更多
 * 2、搜索框、搜索联想功能
 */

const throttle = (fn, delay) => {
  let timer;
  return (...args) => {
    let context = this;
    if(timer) return;
    timer = setTimeout(() => {
      fn.apply(context, args);
      timer = null;
    }, delay);
  }
};