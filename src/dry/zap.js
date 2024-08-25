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
        for (let i = 0; i < this._ls.length; i++) {
            const e = this._ls[i]
            if (e && !e.dead) {
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
        if (!node.evo) node.dead = true
        if (!node.draw) node.ghost = true
        if (node.init) node.init()
    }
}
