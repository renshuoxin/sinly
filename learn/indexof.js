function indexof(searchElement, searchIdx = 0) {
  if(this == null) throw 'error';
  if(this.length == 0 || searchIdx > this.length) return -1;
  if(searchIdx < 0) searchIdx += searchIdx.length;
  for(let i = searchIdx; i < this.length; i++) {
    if(this[i] === searchElement) {
      return i;
    }
  }
  return -1;
}

Array.prototype.indexof = indexof;
let arr = [12, 5, 6, '2333', 234];
console.log(arr.indexof('2333'));