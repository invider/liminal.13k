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
        node.__ = this
        if (!node.evo) node.dead = true
        if (!node.draw) node.ghost = true
    }
}

const lab = new Frame()

_.onStart = () => {

    for (let i = 0; i < 0; i++) {
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

    for (let i = 0; i < 128; i++) {
        const B = 60
        const H = B/2
        lab.attach( new Mesh({
            pos: vec3(
                H - B*rnd(),
                H - B*rnd(),
                H - B*rnd()
            ),
            rot: vec3(0, 0, 0),
            scale: vec3(1, 1, 1),
            geo: geo.gen().plane().scale(10).get(),
        }))
    }

    lab.attach( new Camera({
        name: 'cam',
        vfov: 45,
        pos: vec3(0, 0, 0),
        rot: vec3(1, 0, 0),
        dir: vec3(0, 1, 0),
        up: vec3(0, 1, 0),
        push: 0,
        speed: 20,

        evo: function(dt) {

            let dir, len

            if (this.lookAt) {
                dir = vec3.isub(this.lookAt, this.pos)
                len = vec3.len(dir)
                vec3.normalize(dir)
            } else {
                // free roaming camera
                dir = vec3.fromSpherical(1, -this.rot[1], this.rot[0])
            }

            this.dir = dir
            vec3.scale(dir, this.speed * dt)
            switch(this.push) {
                case 1:
                    if (!this.lookAt || len > 2) {
                        vec3.add(this.pos, dir)
                    }
                    break
                case 3:
                    vec3.scale(dir, -1)
                    vec3.add(this.pos, dir)
                    break
            }

            if (debug) {
                const p = this.pos, l = this.lookAt

                let cx = Math.round(p[0]),
                    cy = Math.round(p[1]),
                    cz = Math.round(p[2])
                const sPos = `@${cx}:${cy}:${cz}`

                const pdir = vec3.toSpherical(this.dir)
                const sDir = ' ^' + Math.round(pdir[1] * RAD_TO_DEG) + '*'
                                  + Math.round(pdir[2] * RAD_TO_DEG) + '*'

                let sLookAt = ''
                if (l) {
                    let lx = Math.round(l[0] * 100)/100,
                        ly = Math.round(l[1] * 100)/100,
                        lz = Math.round(l[2] * 100)/100
                    sLookAt = ` => ${lx}:${ly}:${lz}`
                }

                env.status = 'cam: ' + sPos + sDir + sLookAt
            }

        },

        jumpNext: function() {
            const id = Math.floor(Math.random() * lab._ls.length)
            const next = lab._ls[id]
            this.lookAt = next.pos
        },
        looseIt: function() {
            //this.lookAt = vec3(0, 0, -10)
            this.lookAt = 0
            vec3.set(this.pos, 0, 0, 0)
            vec3.set(this.rot, 0, 0, 0)
        },

        move: function(d) {
            this.push = d
        },

        stop: function() {
            this.push = 0
        },

        turn: function(dx, dy) {
            const S = 0.01

            this.rot[1] += dx * S
            this.rot[0] += dy * S
            /*
            const nl = vec3.copy(this.lookAt)
            vec3.normalize(nl)

            const rad = dx * 0.01
            const res = vec3(
                nl[0],
                nl[1] * cos(rad) - nl[2] * sin(rad),
                nl[1] * sin(rad) + nl[2] * cos(rad)
            )
            this.lookAt = res
            */
        },
    }))
}
