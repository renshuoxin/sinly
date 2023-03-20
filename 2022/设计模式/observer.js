// 观察者模式：定义了对象间一对多的依赖关系，当目标对象状态发生变化时，所有依赖它的对象Observer都会得到通知
// 对于Vue，某个数据observe -> defineReactive就是目标对象，当数据发生变化时，所有依赖它的对象订阅者watcher都会得到通知

// 观察者对象
class Observer {
  name = '';
  constructor(name) {
    this.name = name;
  }
  
  update() {
    console.log(`目标对象通知更新，我是${this.name}`);
  }
}

// 目标对象
class Subject {
  observers = [];
  constructor() {
    this.observers = [];
  }
  add(ob) {
    this.observers.push(ob);
  }

  remove(ob) {
    const idx = this.observers.findIndex(item => item === ob);
    idx > -1 && this.observers.splice(idx, 1);
  }

  notify() {
    for(const ob of this.observers) {
      ob.update();
    }
  }
}

const sub = new Subject();

const ob1 = new Observer('观察者1号');
const ob2 = new Observer('观察者2号');

sub.add(ob1);
sub.add(ob2);

sub.notify();
