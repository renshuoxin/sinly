/*
*format: 日期格式化
*date => 基于毫秒数的时间对象
*fmt => 时间格式
*/
export const formatDate = (date, fmt='yyyy-MM-dd hh:mm:ss') => {
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'S': date.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - (RegExp.$1.length)));
  }
  for (let key in o) {
    if (new RegExp('(' + key + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1 ?
            (o[key]) : ("00" + o[key]).substr(("" + o[key]).length)));
    }
  }
  return fmt;
}