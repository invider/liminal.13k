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

lab.attach( new Camera({
    ghost: true,
    name: 'cam',
    vfov: 45,
    pos: vec3(0, 0, 0),
    rot: vec3(1, 0, 0),
    lookAt: vec3(0, 0, -5),
    up: vec3(0, 1, 0),
    push: 0,

    evo: function(dt) {
        const p = this.pos, l = this.lookAt
        let cx = Math.round(p[0]),
            cy = Math.round(p[1]),
            cz = Math.round(p[2])
            lx = Math.round(l[0]),
            ly = Math.round(l[1]),
            lz = Math.round(l[2])

        env.status = `cam: ${cx}:${cy}:${cz} => ${lx}:${ly}:${lz}`

        if (!this.push) return

        const SPEED = 20
        const dir = vec3.isub(this.lookAt, this.pos)
        const len = vec3.len(dir)
        vec3.normalize(dir)
        vec3.scale(dir, SPEED * dt)

        switch(this.push) {
            case 1:
                if (len > 2) {
                    vec3.add(this.pos, dir)
                }
                break
            case 3:
                vec3.scale(dir, -1)
                vec3.add(this.pos, dir)
                break
        }
    },

    jumpNext: function() {
        const id = Math.floor(Math.random() * lab._ls.length)
        const next = lab._ls[id]
        this.lookAt = next.pos
    },
    looseIt: function() {
        this.lookAt = vec3(0, 0, -10)
    },

    move: function(d) {
        this.push = d
    },

    stop: function() {
        this.push = 0
    },
}))
