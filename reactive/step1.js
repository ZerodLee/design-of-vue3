const obj = { text: "hello world" };

function effect() {
  document.body.innerText = obj.text;
}

const bucket = new Set();

const proxyObj = new Proxy(obj, {
  get(target, key) {
    bucket.add(effect);
    return target[key];
  },
  set(target, key, newVal) {
    target[key] = newVal;
    bucket.forEach((fn) => fn());
    return true;
  },
});
function effect() {
  document.body.innerText = proxyObj.text;
}
effect();
setTimeout(() => {
  proxyObj.text = "changed";
}, 1000);
