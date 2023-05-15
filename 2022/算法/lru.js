/**
 * LRU(Least Recently Used): 最近最少使用
 */
function LRU(max) {
  this.max = max;
  this.cache = new Map();
}

LRU.prototype.get = function(key) {
  if (this.cache.has(key)) {
    // 存在即更新，将最近访问的放到最新的位置
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  return null;
}

LRU.prototype.set = function(key, value) {
  // 存在即更新
  if (this.cache.has(key)) {
    this.cache.delete(key);
  } else if (this.cache.size >= this.max) {
    this.cache.delete(this.cache.keys().next().value);
  }

  this.cache.set(key, value);
}