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

for (let i = 0; i < 128; i++) {
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

lab.cam = new Camera({
    vfov: 45,
    pos: vec3(0, 0, -30),
    lookAt: vec3(0, 0, 0),
    up: vec3(0, 1, 0),

    jumpNext: function() {
        const id = Math.floor(Math.random() * lab._ls.length)
        const next = lab._ls[id]
        this.lookAt = next.pos
    }
})

