/**
 * 渲染VNode到container
 * @param vNode
 * @param container
 */
export function render(vNode, container) {
    mountElement(vNode, container);
}

function mountElement(vNode, container) {
    const {type, props, children} = vNode;

    let el = nodeOps.createElement(type);

    if (typeof  children === "string") {
        nodeOps.setElementText(el, children);
    } else if (Array.isArray(children)) {
        mountChildren(children, container);
    }

    nodeOps.insert(el, container);
}

function mountChildren(children, container) {
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        mountElement(child, container);
    }
}

const nodeOps = {
    insert: (child, parent, anchor = null) => {
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

