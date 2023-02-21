const obj = { text: "hello world" };

function effect() {
  document.body.innerText = obj.text;
}

let activeEffect;
function effect(fn) {
  activeEffect = fn;
  fn();
}

const bucket = new WeakMap();

function track(target, key) {
  if (!activeEffect) {
    return target[key];
  }
  let depsMap = bucket.get(target);
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  deps.add(activeEffect);
}
function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) {
    return false;
  }
  const effects = depsMap.get(key);
  effects && effects.forEach((fn) => fn());
}
const proxyObj = new Proxy(obj, {
  get(target, key) {
    track(target, key);
    return target[key];
  },
  set(target, key, newVal) {
    target[key] = newVal;
    trigger(target, key);
  },
});

effect(() => {
  console.log("effect run");
  document.body.innerText = proxyObj.text;
});
setTimeout(() => {
  proxyObj.other = "changed";
}, 1000);
