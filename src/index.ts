/**
 * 渲染VNode到container
 * @param vNode
 * @param container
 */
export function render(vNode, container) {
    /*setState检查是否已渲染过*/
    if (container.childNodes[0]) {
        nodeOps.remove(container.childNodes[0]);
    }
    mountElement(vNode, container);
}

function mountElement(vNode, container) {
    const {type, props, children} = vNode;

    /*1 type处理*/
    let el = nodeOps.createElement(type);
    /*2 props处理*/
    if (props) {
        for (const key in props) {
            patchProps(el, key, props[key]);
        }
    }

    /*3 children处理*/
    if (typeof  children === "string") {
        nodeOps.setElementText(el, children);
    } else if (Array.isArray(children)) {
        mountChildren(children, el);
    }

    nodeOps.insert(el, container, null);
}

const onRe = /^on[^a-z]/;
const isOn = key => onRe.test(key);

function patchProps(el, key, value) {
    if (isOn(key)) {
        /*onXX等事件*/
        const name = key.slice(2).toLowerCase();
        el.addEventListener(name, value)
    } else {
        if (value === null) {
            el.removeAttribute(key)
        } else {
            el.setAttribute(key, value)
        }
    }
}

function mountChildren(children, container) {
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        mountElement(child, container);
    }
}

const nodeOps = {
    insert: (child, parent, anchor) => {
        if (anchor) {
            parent.insert(child, anchor);
        } else {
            parent.appendChild(child);
        }
    },

    remove: child => {
        const parent = child.parentNode;
        if (parent) {
            parent.removeChild(child);
        }
    },

    createElement: tag => document.createElement(tag),

    setElementText: (el, text) => {
        el.textContent = text;
    }

};


let activeEffect;

/**
 * 注册effect副作用回调
 * @param fn
 */
export function effect(fn) {
    activeEffect = fn;
    fn();
    // activeEffect = null;
}

/**
 * 数据响应
 * @param target
 * @returns {any}
 */
export function reactive(target) {
    return new Proxy(target, {
        set(target, key, value, receiver) {
            let res = Reflect.set(target, key, value, receiver);
            activeEffect && activeEffect();
            return res;
        },
    })
}
