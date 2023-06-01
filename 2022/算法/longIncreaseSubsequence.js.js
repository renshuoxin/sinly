/**
 * 最长递增子序列
 * 1 4 7 3 16 8 12 25
 * 1 2 3 2 4  4 5  6
 */

function longIncreaseSubsequence(arr) {
  const result = new Array(arr.length + 1).fill(1);

  for (let i = 1; i < arr.length; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[i] > arr[j]) {
        result[i] = Math.max(result[i], result[j] + 1);
      }
    }
  }

  return Math.max(...result);
}

const arr = [1, 4, 7, 3, 16, 8, 12, 25];
console.log(longIncreaseSubsequence(arr));