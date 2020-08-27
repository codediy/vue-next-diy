import {patchProps, nodeOps} from "./runtime-dom";




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

function mountChildren(children, container) {
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        mountElement(child, container);
    }
}


export * from "./runtime-dom";
export * from "./reactivity";
