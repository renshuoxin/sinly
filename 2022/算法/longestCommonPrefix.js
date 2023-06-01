/**
 * 最长公共前缀
 */
function longestCommonPrefix(arr) {
  if (!arr?.length) return '';
  if (arr.length === 1) return arr[0];
  let str = arr[0];
  for (let i = 1; i < arr.length; i++) {
    let j = 0;
    for(; j < arr[i].length && j < str.length; j++) {
      if (str[j] !== arr[i].charAt(j)) break;
    }
    str = str.substring(0, j);
    if (str === '') return '';
  }

  return str;
}

console.log('case1:', longestCommonPrefix(['aa', 'bb', 'c']));
console.log('case2:', longestCommonPrefix(['flower', 'flabc', 'flaaa']));