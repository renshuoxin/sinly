/**
 * 写一个customInterval(fn, a, b)，要求如下：
 * 1、每次间隔a, a + b, a + 2b
 * 2、clear可以停止interval
 */

function customInterval(fn, a, b) {
  this.a = a;
  this.b = b;
  this.time = 0;
  this.handleTimer = null;
  this.start = () => {
    this.handleTimer = setTimeout(() => {
      fn();
      this.time++;
      this.start();
    }, this.a + this.time * this.b);
  }

  this.stop = () => {
    clearTimeout(this.handleTimer);
    this.handleTimer = null;
    this.time = 0;
  }
}

const ci = new customInterval(() => { console.log(1);}, 1000, 2000);
ci.start();
