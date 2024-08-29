// model matrix stack
let _mPtr = 0
const _mStack = []
let mMatrix = mat4.identity(),
    wMatrix = mat4.identity(),
    nMatrix = mat4.identity(),
    iMatrix = mat4.identity()

const _ = {

    mpush: () => {
        if (!_mStack[_mPtr]) _mStack[_mPtr++] = mat4.clone(mMatrix)
        else mat4.copy(_mStack[_mPtr++], mMatrix)
    },

    mpop: () => {
        mat4.copy(mMatrix, _mStack[--_mPtr])
    },

}

// Group node for lab
class Frame {

    constructor(st) {
        const $ = this
        $._ls = []

        // install trails if present
        if (st && st._traits) st._traits.forEach(t => {
            extend($, t)
            if (t.__onTrait) t.__onTrait.call($)
        })

        // install pods if present 
        if (st && st._pods) st._pods.forEach(p => $.attach(p))

        // apply default - we might override defaults set by pods and traits
        extend($, st)
    }

    evo(dt) {
        const ls = this._ls
        for (let i = 0; i < ls.length; i++) {
            const e = ls[i]

            if (e.dead) {
                const j = i
                defer(() => {
                    if (e.onKill) e.onKill()
                    ls.splice(j, 1)
                })
            } else if (!e.zombie) {
                e.evo(dt)
            }
        }
    }

    draw() {
        for (let i = 0; i < this._ls.length; i++) {
            const e = this._ls[i]
            if (!e.ghost) {
                e.draw()
            }
        }
    }

    attach(node) {
        this._ls.push(node)
        if (node.name) this[node.name] = node
        node.__ = this                          // link to the parent frame
        if (!node.evo) node.zombie = true
        if (!node.draw) node.ghost = true
        if (node.init) node.init()
        return node
    }
}

const lab = new Frame()
