class Frame {

    constructor(st) {
        this._ls = []
        extend(this, st)
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
                e.evo(dt)
            }
        }
    }

    attach(node) {
        this._ls.push(node)
        if (node.name) this[node.name] = node
    }
}

const lab = new Frame()

