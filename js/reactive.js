class Dep {
    subscriber = new Set()
    depend() {
        if(active) {
            this.subscriber.add(active)
        }
    }
    notify() {
        this.subscriber.forEach(effect => {
            effect()
        })
    }
}

const targetMap = new WeakMap()

function getDep(target, key) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }
    let dep = depsMap.get(key)
    if (!dep) {
        dep = new Dep()
        depsMap.set(key, dep)
    }
    return dep
}

function reactive(raw) {
    return new Proxy(raw, {
        get(target, p) {
            const dep = getDep(raw, p)
            dep.depend()
            return target[p]
        },
        set(target, p, value) {
            const dep = getDep(raw, p)
            target[p] = value
            dep.notify()
            return true
        }
    })
}

let active = null

function watchEffect(effect) {
    active = effect
    effect()
    active = null
}

export {reactive, watchEffect}
