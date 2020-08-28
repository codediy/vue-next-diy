const onRe = /^on[^a-z]/;
const isOn = key => onRe.test(key);

export function hostPatchProps(el, key, prev, next) {
    if (isOn(key)) {
        /*onXX等事件*/
        const name = key.slice(2).toLowerCase();
        prev && el.removeEventListener(name, prev);
        el.addEventListener(name, next)
    } else {
        if (next === null) {
            el.removeAttribute(key)
        } else {
            el.setAttribute(key, next)
        }
    }
}

export const nodeOps = {
    insert: (child, parent, anchor) => {
        if (anchor) {
            parent.insertBefore(child, anchor);
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
