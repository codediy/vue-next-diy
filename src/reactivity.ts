
let activeEffect;

/**
 * 注册effect副作用回调
 * @param fn
 */
export function effect(fn) {
    activeEffect = fn;
    fn();
    activeEffect = null;
}

/**
 * 数据响应
 * @param target
 * @returns {any}
 */
export function reactive(target) {
    return new Proxy(target, {
        get(target, key, receiver) {
            let res = Reflect.get(target, key, receiver);
            track(target, key);
            return res;
        },
        set(target, key, value, receiver) {
            let oldValue = target[key];

            let res = Reflect.set(target, key, value, receiver);
            if (oldValue !== value) {
                trigger(target, key, value);
            }
            return res;
        },
    })
}


/*
* target->key->deps
* {
*   state:{
*       count:[fn1,fn2],
*       name:[fn3,fn4]
*   }
* }
* */
type Dep = Set<any>;
type KeyToDepMap = Map<any, Dep>;

const targetMap = new WeakMap<any, KeyToDepMap>();

/**
 *注册effect到targetMap中
 * @param target
 * @param key
 */
export function track(target, key) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    if (activeEffect && !dep.has(activeEffect)) {
        dep.add(activeEffect);
    }
}

/**
 *
 * @param target
 * @param key
 * @param value
 */
export function trigger(target, key, value) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
        return;
    }
    const effects = depsMap.get(key);

    /*存在effect，则遍历调用*/
    effects && effects.forEach(effect => effect());
}
