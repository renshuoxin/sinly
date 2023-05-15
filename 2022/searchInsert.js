/**
 * 搜索插入位置
 * 描述：给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置
 */
function searchInsert(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  if (target < arr[left]) return left;
  if (target > arr[right]) return right + 1;

  while (left <= right) {
    let middle = Math.floor((left + right) / 2);
    if (target < arr[middle]) {
      right = middle - 1;
    } else if (target > arr[middle]) {
      left = middle + 1;
    } else {
      return middle;
    }
  }

  return left;
}

const arr = [1, 3, 7, 10, 15, 20, 24, 29, 35, 60];
console.log(searchInsert(arr, 0));
console.log(searchInsert(arr, 7));
console.log(searchInsert(arr, 100));
console.log(searchInsert(arr, 16));