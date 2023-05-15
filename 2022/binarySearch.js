/**
 * 二分查找
 */
function binarySearch(arr, target) {
  const len = arr.length;

  let leftIdx = 0;
  let rightIdx = len - 1;

  while (leftIdx <= rightIdx) {
    let middle = Math.floor((leftIdx + rightIdx) / 2);
    if (target > arr[middle]) {
      leftIdx = middle + 1;
    } else if (target < arr[middle]){
      rightIdx = middle - 1;
    } else {
      return middle;
    }
  }

  return -1;
}

const targetIdx = binarySearch([1, 2, 3, 5, 14, 18, 30, 40], 3);
console.log('targetIdx: ', targetIdx);