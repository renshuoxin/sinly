/**
 * 冒泡排序
 * 时间复杂度：O(n * n)
 */
function bubbleSort(arr) {
  const len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j + 1];
        arr[j + 1] = arr[j];
        arr[j] = temp;
      }
    }
  }
  return arr;
}

const arr = bubbleSort([1, 4, 6, 2, 18, 5, 10]);
console.log(arr);

/**
 * 选择排序
 * 思路：选择最小/最大元素放在数列起始位置，之后依次循环
 * 时间复杂度：O(n * n)
 */
function selectionSort(arr) {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    let minIdx = i;
    for (let j = i + 1; j < len; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    const temp = arr[i];
    arr[i] = arr[minIdx];
    arr[minIdx] = temp;
  }
  return arr;
}

const arr1 = selectionSort([1, 4, 6, 2, 18, 5, 10]);
console.log(arr1);

/**
 * 插入排序
 * 思路：
 *    1、将待排序数列的第一个元素看做一个有序序列，把第二个元素至最后一个元素看做是未排序序列；
 *    2、依次扫描未排序序列中元素，插入到有序序列的合适位置
 * 时间复杂度：O(n * n)
 */
function insertSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let preIndex = i - 1;
    let current = arr[i];
    while (preIndex >= 0 && arr[preIndex] > current) {
      arr[preIndex + 1] = arr[preIndex];
      preIndex--;
    }
    arr[preIndex + 1] = current;
  }
  return arr;
}
const arr2 = insertSort([1, 4, 6, 2, 18, 5, 10]);
console.log(arr2);

/**
 * 归并排序
 * 时间复杂度：O(n*log(n))
 * 思路：将已有序的序列合并，得到有序序列，也就是说先使每个子序列有序，再使子序列段间有序
 */
function mergeSort(arr) {
  const len = arr.length;
  if (len < 2) return arr;

  const middle = Math.floor(len / 2);
  const left = arr.slice(0, middle);
  const right = arr.slice(middle);

  return merge(mergeSort(left), mergeSort(right));
}
function merge(left, right) {
  const result = [];
  while(left.length && right.length) {
    if (left[0] <= right[0]) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }

  while(left.length) {
    result.push(left.shift());
  }

  while(right.length) {
    result.push(right.shift());
  }
  return result;
}

const arr3 = mergeSort([1, 4, 6, 2, 18, 5, 10]);
console.log(arr3);

/**
 * 快速排序
 * 思路：选择基准元素，将比基准元素小的元素都放在其左边，比基准元素大的元素都放在其右边；递归处理基准元素前后的序列
 * 时间复杂度：O(n * log(n))
 */
function quickSort(arr) {
  const rec = (arr) => {
    if (arr.length <= 1) return arr;
    const len = arr.length;

    const left = [];
    const right = [];
    const middle = arr[0]
    for (let i = 1; i < len; i++) {
      if (arr[i] > middle) {
        right.push(arr[i]);
      } else {
        left.push(arr[i]);
      }
    }

    return [...rec(left), middle, ...rec(right)];
  }

  return rec(arr);
}
const arr4 = quickSort([1, 4, 6, 2, 18, 5, 10]);
console.log(arr4);