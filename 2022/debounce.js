/**
 * 防抖：n秒后执行事件，如果n秒内重复触发，则重新计时
 * 一定时间连续操作，只在最后执行一次
 * @param fn 事件回调函数
 * @param seconds 延迟时间
 * @param immediate 立即执行：多次触发事件，只有第一次会立即执行函数，之后在设定seconds时间内触发的事件无效
 * 
 * 应用场景
 * 1、搜索框搜索输入，只需用户最后一次输入完再发送请求
 * 2、手机号、邮箱等验证
 * 3、窗口大小resize
 */

const debounce = (fn, seconds, immediate = false) => {
  let timer = null;
  return (...args) => {
    if(timer) clearTimeout(timer);
    let context = this;
    if (immediate) {
      !timer && fn.apply(context, args);
      timer = setTimeout(() => {
        timer = null;
      }, seconds);
    } else {
      timer = setTimeout(() => {
        fn.apply(context, args);
      }, seconds)
    }
  }
};

const fun = () => {
  console.log('now: ', Date.now());
};

const random = () => {
  return Math.ceil(Math.random() * 2000);
}

setInterval(debounce(fun, 1000), random);