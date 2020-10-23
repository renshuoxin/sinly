if (a == 1 && a == 2) { console.log('????????????') }
var a = {
  value: 0,
  valueOf: function () {
    this.value++
    return this.value;
  }
}