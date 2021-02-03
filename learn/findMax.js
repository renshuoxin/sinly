function findMax(arr) {
  let mid = arr.length / 2;
  let left = mid - 1, right = mid + 1;
  while(left >= 0 && right < arr.length) {
    if(arr[mid] > arr[left]  && arr[mid] > arr[right]) {
      console.log(arr[mid]);
      return arr[mid];
    } else if (arr[mid] < arr[left]) {
      mid--;
      left--;
    } else if(arr[mid] < arr[right]) {
      mid++;
      right++;
    }
  }
}
function optimizeFindMax (arr) {
  let begin = 0, end = arr.length - 1;
  let mid = parseInt(begin + (end - begin) / 2);
  while(mid > 0 && mid < arr.length - 1) {
    if(arr[mid] > arr[mid -1] && arr[mid] > arr[mid + 1]) {
      console.log(arr[mid]);
      return arr[mid];
    } else if(arr[mid] < arr[mid - 1]) {
      end = mid - 1;
      mid = parseInt(begin + (end - begin) / 2);
    } else {
      begin = mid + 1;
      mid = parseInt(begin + (end - begin) / 2);
    }
  }
  if(mid == 0) return arr[0];
  if(mid == arr.length - 1) return arr[arr.length - 1];
  return -1;
}
optimizeFindMax([1,3,4,6,9,16,12,10,7,2])