/**
 * vue3响应式对象
 */

/**
 * 依赖收集
 */
const targetMap = new WeakMap();
// {target: { key : [...effect] } }
function track(target, key) {
  let depsMap = targetMap.get(target);

  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }

  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }

  deps.add(effect);
}

/**
 * 派发更新
 */
function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;

  let deps = depsMap.get(key);
  if (!deps?.length) {
    deps.forEach((dep) => {
      dep();
    })
  }
}
function reactive(target) {
  const handlers = {
    get(target, key, receiver) {
      // 依赖收集
      track(target, key);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const oldVal = target[key];
      Reflect.set(target, key, value, receiver);
      if (oldVal !== value) {
        // 派发更新
        trigger(target, key);
      }
      return value;
    }
  }
  return new Proxy(target, handlers);
}

const state = reactive({ count: 1 });

function effect() {
  console.log('state.count:', state.count);
}

effect();
state.count = 2;