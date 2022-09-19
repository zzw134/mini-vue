// h函数，返回一个VNode
function h(tag, props, children) {
    return {
        tag,
        props,
        children
    }
}

function mountEl(vnode, container) {
    const el = vnode.el =  document.createElement(vnode.tag)
    if (vnode.props) {
        for (const key in vnode.props) {
            const value = vnode.props[key]
            if (key.startsWith('on')) {
                el.addEventListener(key.substring(2).toLowerCase(), value)
            } else {
                el.setAttribute(key, value)
            }
        }
    }
    if (vnode.children) {
        if (typeof vnode.children === 'string') {
            el.textContent = vnode.children
        } else {
            for (const child of vnode.children) {
                mountEl(child, el)
            }
        }
    }
    container.append(el)
}

function patch(oldVNode, newVNode) {
    if (newVNode.tag !== oldVNode.tag) {
        // 如果tag不一样，直接替换掉
        const oldVNodeElParent = oldVNode.el.parentNode
        oldVNode.el.remove()
        mountEl(newVNode, oldVNodeElParent)
    } else {
        const el = newVNode.el = oldVNode.el
        // 处理props
        const oldProps = oldVNode.props || {}
        const newProps = newVNode.props || {}
        // 添加或更新属性
        for (const key in newProps) {
            const newVal = newProps[key]
            const oldVal = oldProps[key]
            if (newVal !== oldVal) {
                if (key.startsWith('on')) {
                    el.addEventListener(key.substring(2).toLowerCase(), newVal)
                } else {
                    el.setAttribute(key, newVal)
                }
            }
        }
        // 移除旧属性
        for (const key in oldProps) {
            if (key.startsWith('on')) {
                el.removeEventListener(key.substring(2).toLowerCase(), oldProps[key])
            }
            if (!(key in newProps)) {
                el.removeAttribute(key)
            }
        }
        // 处理children
        const oldChildren = oldVNode.children || []
        const newChildren = newVNode.children || []
        if (typeof oldChildren === 'string' && typeof newChildren === 'string') {
            if (newChildren !== oldChildren) {
                el.textContent = newChildren
            }
        } else {
            if (typeof oldChildren === typeof newChildren) {
                const oldLength = oldChildren.length
                const newLength = newChildren.length
                const minLength = Math.min(oldLength, newLength)
                for (let i = 0; i < minLength; i++) {
                    patch(oldChildren[i], newChildren[i])
                }
                if (oldLength > minLength) {
                    oldChildren.slice(minLength).forEach(child => {
                        child.el.remove()
                    })
                }
                if (newLength > minLength) {
                    newChildren.slice(minLength).forEach(child => {
                        mountEl(child, el)
                    })
                }
            } else {
                if (typeof oldChildren === 'string') {
                    el.innerHTML = ''
                    newChildren.forEach(child => {
                        mountEl(child, el)
                    })
                } else {
                    el.innerHTML = newChildren
                }
            }
        }
    }
}

export {
    h,
    mountEl,
    patch
}