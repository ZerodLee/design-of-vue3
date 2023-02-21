const obj = { text: "hello world" };

function effect() {
  document.body.innerText = obj.text;
}

let activeEffect;
function effect(fn) {
  activeEffect = fn;
  fn();
}

const bucket = new Set();

const proxyObj = new Proxy(obj, {
  get(target, key) {
    if (activeEffect) {
      bucket.add(activeEffect);
    }
    return target[key];
  },
  set(target, key, newVal) {
    target[key] = newVal;
    bucket.forEach((fn) => fn());
    return true;
  },
});

effect(() => {
  console.log("effect run");
  document.body.innerText = proxyObj.text;
});
setTimeout(() => {
  proxyObj.other = "changed";
}, 1000);
