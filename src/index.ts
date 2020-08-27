import {patchProps, nodeOps} from "./runtime-dom";
import {effect} from "./reactivity"


let rootContainer;

/**
 * 渲染VNode到container
 * @param vNode
 * @param container
 */
export function render(vNode, container) {
    /*setState检查是否已渲染过*/
    rootContainer = container;
    if (rootContainer.childNodes[0]) {
        nodeOps.remove(rootContainer.childNodes[0]);
    }
    /*挂载实现*/
    patch(null, vNode, container);
}

/**
 * 使用n2更新container
 * @param n1
 * @param n2
 * @param container
 */
function patch(n1, n2, container) {
    console.log("n2", n2.type, typeof n2.type);
    if (typeof  n2.type === "string") {
        /*原生节点div*/
        mountElement(n2, container);
    } else if (typeof n2.type === "object") {
        /*Component*/
        mountComponent(n2, container);
    }
}

/**
 * 挂载Component
 * @param vnode
 * @param container
 */
function mountComponent(vnode, container) {
    const instance = {
        vnode,
        type: vnode.type,
        render: null,
        subTree: null
    };

    /*setUp返回render,可以得到虚拟dom*/
    const Component = instance.type;
    instance.render = Component.setUp();

    /*effect注册*/
    effect(() => {
        /*读取返回的虚拟dom*/
        instance.subTree = instance.render && instance.render();

        if (container === rootContainer && container.childNodes[0]) {
            nodeOps.remove(container.childNodes[0]);
        }
        /*再次挂载*/
        patch(null, instance.subTree, container);
    })
}

/**
 * 挂载原生dom
 * @param vNode
 * @param container
 */
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

function mountChildren(children, container) {
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        patch(null, child, container);
    }
}


export * from "./runtime-dom";
export * from "./reactivity";
