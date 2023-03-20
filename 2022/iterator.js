function makeIterator1(arr) {
  let nextIndex = 0;
  return {
    next: function() {
      return nextIndex < arr.length
      ? { value: arr[nextIndex++], done: false }
      : { value: undefined, done: true };
    }
  }
}

function makeIterator2(arr) {
  let nextIndex = 0;
  return {
    next: function() {
      return nextIndex < arr.length
      ? { value: arr[nextIndex++]}
      : { done: true };
    }
  }
}