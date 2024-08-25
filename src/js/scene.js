const lab = new Frame()

lab.attach( new Camera({
    name: 'cam',
    vfov: 45,
    pos: vec3(0, 0, 0),

    pushers: new Float32Array(SHIFT_ROLL+1),
    speed: 30,
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

            case SHIFT_YAW:
                this.yaw(turnSpeed * factor * dt)
                break
            case SHIFT_PITCH:
                this.pitch(turnSpeed * factor * dt)
                break
            case SHIFT_ROLL:
                this.roll(turnSpeed * factor * dt)
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
            if (f) {
                this.push(i, f, dt)
                if (i > 20) this.pushers[i] = 0 // reset the mouse movement accumulation buffers
            }
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
        this.lookAt = 0
        vec3.set(this.pos, 0, 0, 0)
    },

    activate(action) {
        this.pushers[action] = 1
    },

    stop(action) {
        this.pushers[action] = 0
    },

    onMouseMove(e) {
        if (e.buttons != 1) return
        const dx = e.movementX, dy = e.movementY

        if (dx) {
            if (e.shiftKey) {
                // accumulate mouse roll
                this.pushers[SHIFT_ROLL] += dx
            } else {
                // accumulate horizontal mouse movement
                this.pushers[SHIFT_YAW] += dx
            }
        }
        if (dy) {
            // accumulate vertical mouse movement
            this.pushers[SHIFT_PITCH] += dy
        }
    }
}))


_.onStart = () => {

    const meshColors = [
        vec3(.8, .2, .2),
        vec3(.7, .8, .2),
        vec3(.1, .8, .2),
        vec3(.1, .8, .9),
        vec3(.1, .2, .9),
        vec3(.3, .5, .9),
        vec3(.5, .2, .8),
        vec3(.8, .7, .8),
        vec3(1, 1, 1),
    ]

    for (let i = 0; i < 256; i++) {
        const B = 100
        const H = B/2

        let g
        switch( Math.floor(rnd()*8) ) {
            case 0:
                g = geo.gen().plane().scale(.5 + rnd() * 2).bake()
                break
            case 1:
                g = geo.gen().cube().scale(.5 + rnd() * 2).bake()
                break
            case 2:
                g = geo.gen().sphere().scale(.5 + rnd() * 2).bake()
                break
            case 3:
                g = geo.gen().cylinder().scale(.5 + rnd() * 2).bake()
                break
            case 4:
                g = geo.gen().cone().scale(.5 + rnd() * 2).bake()
                break
            case 5:
                g = geo.gen().circle().scale(.5 + rnd() * 2).bake()
                break
            case 6:
                g = geo.gen().ring(.75).scale(.5 + rnd() * 2).bake()
                break
            case 7:
                g = geo.gen().tetrahedron().scale(.5 + rnd() * 2).bake()
                break
        }
        const spin = (rnd()*4) < 1? 0 : 1

        lab.attach( new Mesh({
            pos: vec3(
                H - B*rnd(),
                H - B*rnd(),
                H - B*rnd()
            ),
            rot:   vec3(0, 0, 0),
            rotSpeed: vec3(0, 0, 0),
            scale: vec3(1, 1, 1),

            geo: g,
            mat: {
                Ka: vec3(.5, .6, .7),
                Kd: meshColors[ Math.floor(rnd() * meshColors.length) ],
                Ks: vec3(1, 1, 1),
                Ke: vec3(1, 1, 1),
                Lv: vec4(.2, .5, .8, 0),
                Ns: 10,
            },

            init() {
                this.rotSpeed[0] += (rnd() < .5? -1 : 1) * (.5 + rnd()*3) * spin
                this.rotSpeed[1] += (rnd() < .5? -1 : 1) * (.2 + rnd()*1.5) * spin
            },

            evo: function(dt) {
                this.rot[0] += this.rotSpeed[0] * dt
                this.rot[1] += this.rotSpeed[1] * dt 
                this.rot[2] += this.rotSpeed[1] * dt 
            },
        }))
    }


    // huge plane
    lab.attach( new Mesh({
        pos: vec3(0, -50, 0),
        rot: vec3(0, 0, 0),
        rotSpeed: vec3(3, 0, 0),
        scale: vec3(1, 1, 1),
        geo: geo.gen().plane().scale(30).bake(),
        mat: {
            Ka: vec3(.5, .5, .5),
            Kd: vec3(.5, .5, .5),
            Ks: vec3(1, 1, 1),
            Ke: vec3(1, 1, 1),
            Lv: vec4(.1, .4, .9, 0),
            Ns: 21,
        },
    }))

    lab.attach( new Mesh({
        pos: vec3(0, 50, 0),
        rot: vec3(0, 0, 0),
        rotSpeed: vec3(3, 0, 0),
        scale: vec3(1, 1, 1),
        geo: geo.gen().plane().scale(30).bake(),
        mat: {
            Ka: vec3(.5, .5, .5),
            Kd: vec3(.5, .5, .5),
            Ks: vec3(1, 1, 1),
            Ke: vec3(1, 1, 1),
            Lv: vec4(.2, .8, 0, 0),
            Ns: 21,
        },
    }))

    // THE SUN!!!
    lab.attach( new Mesh({
        pos: env.pointLightPosition,
        rot: vec3(0, 0, 0),
        rotSpeed: vec3(3, 0, 0),
        scale: vec3(1, 1, 1),
        geo: geo.gen().sphere().scale(1).bake(),
        mat: {
            Ka: vec3(1, 1, .5),
            Kd: vec3(1, 1, 1),
            Ks: vec3(1, 1, 1),
            Ke: vec3(1, 1, 1),
            Lv: vec4(1, 0, 0, 0),
            Ns: 21,
        },

        evo: function(dt) {
            this.rot[0] += this.rotSpeed[0] * dt
            this.rot[1] += this.rotSpeed[1] * dt 
            this.rot[2] += this.rotSpeed[1] * dt 
        },
    }))

    // planetoid
    lab.attach( new Mesh({
        pos: vec3(80, -20, -40),
        rot: vec3(0, 0, 0),
        rotSpeed: vec3(0, .2, 0),
        scale: vec3(1, 1, 1),
        geo: geo.gen().precision(150).sphere().scale(35).bake(),
        mat: {
            Ka: vec3(.8, .4, .7),
            Kd: vec3(.6, .25, .8),
            Ks: vec3(1, 1, 1),
            Ke: vec3(1, 1, 1),
            Lv: vec4(.2, .6, .8, 0),
            Ns: 10,
        },

        evo: function(dt) {
            this.rot[0] += this.rotSpeed[0] * dt
            this.rot[1] += this.rotSpeed[1] * dt 
            this.rot[2] += this.rotSpeed[2] * dt 
        },
    }))

    lab.attach( new Mesh({
        pos: vec3(80, -20, -40),
        rot: vec3(0, 0, 0),
        rotSpeed: vec3(0, .15, 0),
        scale: vec3(1, 1, 1),
        geo: geo.gen().ring(.85).scale(75).bake(),
        mat: {
            Ka: vec3(.6, .4, .8),
            Kd: vec3(.4, .4, .6),
            Ks: vec3(1, 1, 1),
            Ke: vec3(1, 1, 1),
            Lv: vec4(.6, .4, 1, 0),
            Ns: 10,
        },

        evo: function(dt) {
            this.rot[0] += this.rotSpeed[0] * dt
            this.rot[1] += this.rotSpeed[1] * dt 
            this.rot[2] += this.rotSpeed[2] * dt 
        },
    }))
    geo.precision(5)
}
