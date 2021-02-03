// 冒泡排序
function sort(list) {
  for(let i = 0; i < list.length; i++) {
    for(let j = i + 1; j < list.length - 1; j++) {
      if(list[i] > list[j]) {
        let tmp = list[i];
        list[i] = list[j];
        list[j] = tmp;
      }
    }
  }
  console.log(list);
}

// 插入排序：从第二个元素开始，和左边元素比较；找到左边不比它大的元素，插入到其右边
function insertSort(list) {
  for(let i = 1; i < list.length; i++) {
    let tmp = list[i];
    let k = i - 1;
    while(k >= 0 && list[k] > list[i]) {
      k--;
    }
    // 腾出k+1的位置以供插入
    for(let j = i; j > k + 1; j--) {
      list[j] = list[j - 1];
    }
    list[k + 1] = tmp;
  }
  console.log(list)
}

// 选择排序：找到数组中最小的元素，放到第一个位置；然后从生下的里边找最小元素，放到第二个位置，如此反复
function selectSort(list) {
  for(let i = 0; i < list.length - 1; i++) {
    let k = i;
    for(let j = i + 1; j < list.length; j++) {
      if(list[j] < list[k]) {
        k = j;
      }
    }
    let tmp = list[i];
    list[i] = list[k];
    list[k] = tmp
  }
  console.log(list);
}