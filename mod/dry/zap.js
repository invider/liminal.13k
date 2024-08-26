const _ = {}

// Group Node for our scenery
class Frame {

    constructor(st) {
        const $ = this
        $._ls = []

        // install all the pods if available
        if (st && st._pods) st._pods.forEach(p => $.attach(p))

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
            if (e && !e.ghost) {
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
