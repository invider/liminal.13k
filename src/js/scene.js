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
                e.draw()
            }
        }
    }

    attach(node) {
        this._ls.push(node)
        if (node.name) this[node.name] = node
    }
}

const lab = new Frame()

for (let i = 0; i < 1024; i++) {
    const B = 60
    const H = B/2
    lab.attach( new Cube({
        pos: vec3(
            H - B*rnd(),
            H - B*rnd(),
            H - B*rnd()
        ),
        rot: vec3(0, 0, 0),
        scale: vec3(1, 1, 1)
    }))
}


