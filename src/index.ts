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

    let el         = document.createElement(type);
    el.textContent = children;

    container.appendChild(el);
}

