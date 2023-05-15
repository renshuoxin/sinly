function isPalindrome(str) {
  let left = 0;
  let right = str.length - 1;

  while (left < right && str[left] === str[right]) {
    left++;
    right--;
  }

  return left >= right;
}

console.log('a is palindrome => ', isPalindrome('a'));
console.log('ab is palindrome => ', isPalindrome('ab'));
console.log('aa is palindrome => ', isPalindrome('aa'));
console.log('aba is palindrome => ', isPalindrome('aba'));
console.log('ababab is palindrome => ', isPalindrome('ababab'));
/**
 * 最长回文子串
 * 方法一：暴力解法
 */
function longestPalindrome(str) {
  let resultStr = '';
  for (let i = 0; i < str.length; i++) {
    for (let j = i + 1; j <= str.length; j++) {
      let temp = str.slice(i, j);
      if (temp === temp.split('').reverse().join('') && temp.length > resultStr.length) {
        resultStr = temp;
      }
    }
  }

  return resultStr;
}

const str = 'babad';
console.log(longestPalindrome(str));

/**
 * 最长回文子串
 * 方法二：动态规划
 * 1、字符串长度为1，结果就是本身
 * 2、字符串长度为2，如果s[i] == s[j]，说明该字符串为回文
 * 3、如果长度大于2，s[i] == s[j]的情况下s[i-1] === s[j-1]，说明该字符串也是回文
 */
function longestPalindrome1(str) {
  if (str.length === 1) return str;

  // 二维数组存储从j到i的字符串是否是回文字符串
  const arr = new Array(str.length).fill([]);

  let max = 0; // 回文字符串的最大长度
  let begin = 0; // 回文字符串的开始位置

  for(let i = 0; i < str.length; i++) {
    for (let j = 0; j <= i; j++) {
      if (str[j] === str[i] && (i - j < 2 || str[j + 1] === str[i - 1])) {
        arr[j][i] = true;
        if (i - j + 1 > max) {
          max = i - j + 1;
          begin = j;
        }
      }
    }
  }

  return str.substr(begin, max);
}

const str1 = 'aabbaac';
console.log(longestPalindrome1(str1));