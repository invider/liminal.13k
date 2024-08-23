const lab = new Frame()

lab.attach( new Camera({
    name: 'cam',
    vfov: 45,
    pos: vec3(0, 0, 0),
    rot: vec3(1, 0, 0),

    dir:  vec3(0, 0, 1),
    up:   vec3(0, 1, 0),
    left: vec3(1, 0, 0),

    pushers: [],
    speed: 20,
    turnSpeed: 2,

    init: function() {
        lab.broker = this
    },

    push: function(action, factor, dt) {
        const speed = this.speed
        const turnSpeed = this.turnSpeed
        switch(action) {
            case FORWARD:
                this.moveZ(-speed * dt)
                break
            case LEFT:
                this.moveX(-speed * dt)
                break
            case BACKWARD:
                this.moveZ(speed * dt)
                break
            case RIGHT:
                this.moveX(speed * dt)
                break
            case UP:
                this.moveY(speed * dt)
                break
            case DOWN:
                this.moveY(-speed * dt)
                break

            case LOOK_LEFT:
                this.yaw(turnSpeed * dt)
                break
            case LOOK_RIGHT:
                this.yaw(-turnSpeed * dt)
                break
            case LOOK_UP:
                this.pitch(-turnSpeed * dt)
                break
            case LOOK_DOWN:
                this.pitch(turnSpeed * dt)
                break
            case ROLL_LEFT:
                this.roll(turnSpeed * dt)
                break
            case ROLL_RIGHT:
                this.roll(-turnSpeed * dt)
                break
        }
    },

    evo: function(dt) {
        let dir, len

        if (this.lookAt) {
            // fix the camera on the target coordinates
            dir = vec3.isub(this.lookAt, this.pos)
            len = vec3.len(dir)
            vec3.normalize(dir)
        }

        // activate pushers
        for (let i = 0; i < this.pushers.length; i++) {
            const f = this.pushers[i]
            if (f) this.push(i, f, dt)
        }

        /*
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
        */

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

    activate(action) {
        this.pushers[action] = 1
    },

    stop(action) {
        this.pushers[action] = 0
    },
}))


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
            geo: geo.gen().plane().scale(.5 + rnd() * 2).get(),
        }))
    }

}
