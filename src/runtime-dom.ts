const onRe = /^on[^a-z]/;
const isOn = key => onRe.test(key);

export function patchProps(el, key, value) {
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

export const nodeOps = {
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
