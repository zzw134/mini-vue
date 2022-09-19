import {mountEl, patch} from "./render.js"
import {reactive, watchEffect} from "./reactive.js";

export default function createApp(rootComponent) {
    rootComponent.data = reactive(rootComponent.data)
    return {
        mount(rootId) {
            const rootEl = document.querySelector(rootId)
            let mounted = false
            let oldVNode = null
            watchEffect(() => {
                if (!mounted) {
                    oldVNode = rootComponent.render()
                    mountEl(oldVNode, rootEl)
                    mounted = true
                } else {
                    let newVNode = rootComponent.render()
                    patch(oldVNode, newVNode)
                    oldVNode = newVNode
                }
            })
        }
    }
}