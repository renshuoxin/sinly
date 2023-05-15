/**
 * 斐波那契数列：1, 1, 2, 3, 5, 8, 13, 21, ……
 * 方法一：常规递归实现
 */
function fib(n) {
  if (n === 1 || n === 2) return 1;
  return fib(n - 1) + fib(n - 2);
}

console.log(fib(5));

/**
 * 斐波那契数列
 * 方法一问题：复杂度较高O(2的n次幂)，有重复计算
 * 方法二：将中间结果进行缓存,从小到大
 */
function fib1(n) {
  const memoryList = new Array(n).fill(1);
  for (let i = 2; i < n; i++) {
    memoryList[i] = memoryList[i - 1] + memoryList[i - 2];
  }

  return memoryList[n - 1];
}

console.log(fib1(8));

/**
 * 斐波那契数列
 * 方法一问题：复杂度较高O(2的n次幂)，有重复计算
 * 方法三：将中间结果进行缓存，从大到小
 */
function fib2(n) {
  const memoryList = new Array(n + 1).fill(0);
  
  const memo = (memoryList, k) => {
    if (k === 1 || k === 2) return 1;
    if (memoryList[k]) return memoryList[k];
    memoryList[k] = memo(memoryList, k - 1) + memo(memoryList, k - 2);
    return memoryList[k];
  }

  return memo(memoryList, n);
}

console.log(fib2(8));

/**
 * 斐波那契数列
 * 方法二和方法三问题：使用了额外的存储空间
 * 方法四：使用内存变量存储已经计算的数值
 */
function fib3(n) {
  if (n === 1 || n === 2) return 1;
  let pre = 1;
  let cur = 1;
  let sum = 2;
  for(let i = 3; i <= n; i++) {
    sum = pre + cur;
    pre = cur;
    cur = sum;
  }

  return cur;
}

console.log(fib3(8));