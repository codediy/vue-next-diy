import {hostPatchProps, nodeOps} from "./runtime-dom";
import {effect} from "./reactivity"


let rootContainer;

/**
 * 渲染VNode到container
 * @param vNode
 * @param container
 */
export function render(vNode, container) {

    let oldVNode = container._vnode
        ? container._vnode
        : null;

    /*挂载实现*/
    patch(oldVNode, vNode, container);
    
    /*缓存已挂载的VNode*/
    container._vnode = vNode;
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
        processElement(n1, n2, container);
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
 * 带有缓存检查的mountElement
 * @param n1
 * @param n2
 * @param container
 */
function processElement(n1, n2, container) {
    if (n1 === null) {
        mountElement(n2, container);
    } else {
        patchElement(n1, n2, container);
    }

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
    /*缓存el到VNode*/
    vNode.el = el;

    /*2 props处理*/
    if (props) {
        for (const key in props) {
            hostPatchProps(el, key, null, props[key]);
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

/**
 * 更新container的元原生元素
 * @param n1
 * @param n2
 * @param container
 */
function patchElement(n1, n2, container) {
    console.log("el", n1);

    n2.el    = n1.el;
    const el = n1.el;


    const oldProps = n1.props;
    const newProps = n2.props;

    /*比较props*/
    patchProps(el, n2, oldProps, newProps);

}

function patchProps(el, n2, oldProps, newProps) {
    if (oldProps !== newProps) {
        for (const key in newProps) {
            const next = newProps[key];
            const prev = oldProps[key];
            if (next !== prev) {
                hostPatchProps(el, key, prev, next);
            }
        }
        for (const key in oldProps) {
            if (!(key in newProps)) {
                hostPatchProps(el, key, oldProps[key], null);
            }
        }
    }
}

function mountChildren(children, container) {
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        patch(null, child, container);
    }
}


export * from "./runtime-dom";
export * from "./reactivity";
