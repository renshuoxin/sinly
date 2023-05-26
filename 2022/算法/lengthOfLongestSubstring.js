/**
 * 求无重复字符的最大子串长度
 */

function lengthOfLongestSubstring(str) {
  let max = 0;
  let tempStr = '';

  for(let i = 0; i < str.length; i++) {
    const index = tempStr.indexOf(str[i]);

    if (index < 0) {
      tempStr += str[i];
    } else {
      tempStr = tempStr.substring(index + 1) + str[i];
    }

    max = Math.max(max, tempStr.length);
  }

  return max;
}