/*
[8, 10, 3, 25, 5, 1, 7, 9]
[7, 10, 3, 25, 5, 1, 8, 9]
[7, 8, 3, 25, 5, 1, 10, 9]
 */

function quickSort(arr, l, r) {
  if(l < r) {
    let mid = partionSort(arr, l, r);
    quickSort(arr, l, mid);
    quickSort(arr, mid + 1, r);
  }
}
function partionSort(arr, l, r) {
  ref = arr[l];
  while(l < r) {
    while(l < r && arr[r] >= ref) {
      r--;
    }
    arr[l] = arr[r];
    while(l < r && arr[l] <= ref) {
      l++;
    }
    arr[r] = arr[l];
  }
  arr[l] = ref;
  return l;
}

var arr = [8, 10, 3, 25, 5, 1, 7, 9];
quickSort(arr, 0, arr.length - 1);
console.log(arr);