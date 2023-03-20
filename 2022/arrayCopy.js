// 浅拷贝
const arr = [1, [2, 3], [4, 5]];

// 方法1： Array.from
const arr1 = Array.from(arr);

arr === arr1; // false
arr[1] === arr1[1]; // true

// 方法2：slice
const arr4 = arr.slice();

arr === arr4; // false
arr[1] === arr4[1]; // true

// 深拷贝

// 方法1：JSON
const arr2 = JSON.parse(JSON.stringify(arr));

arr === arr2; // false;
arr[1] === arr2[1]; // false

// 方法2：遍历
const recursiveClone = (val) => {
  return Array.isArray(val) ? Array.from(val, recursiveClone) : val;
};
const arr3 = recursiveClone(arr);

arr === arr3; // false;
arr[1] === arr3[1]; // false