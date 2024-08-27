lab.attach( new Camera({
    name: 'cam',
    vfov: 45,

    _pods: [
        new MovementControllerPod(),
        {
            evo: function(dt) {
                // customized camera behavior
                const __ = this.__

                if (debug) {
                    // show some debug stuff
                    const p = __.pos, l = __.lookAt

                    let cx = Math.round(p[0]),
                        cy = Math.round(p[1]),
                        cz = Math.round(p[2])
                    const sPos = `@${cx}:${cy}:${cz}`

                    const pdir = vec3.toSpherical(__.dir)
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
        }
    ],

    init: function() {
        lab.broker = this.mover

        trap.register('keyDown', (e) => {
            switch(e.code) {
                case 'KeyF':
                    lab.cam.jumpNext()
                    break
                case 'KeyX':
                    lab.cam.looseIt()
                    break
            }
        })
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
}))

_.onStart = () => {
    log('setting up the default stage')

    lab.cam.pos[1] = 2

    // giant plane
    lab.attach( new Mesh({
        pos: vec3(0, 0, 0),
        rot: vec3(0, 0, 0),
        rotSpeed: vec3(3, 0, 0),
        scale: vec3(1, 1, 1),
        geo: geo.gen().plane().scale(100).bake(),
        mat: {
            Ka: vec3(.5, .5, .5),
            Kd: vec3(.5, .5, .5),
            Ks: vec3(1, 1, 1),
            Ke: vec3(1, 1, 1),
            Lv: vec4(.2, .4, .2, 0),
            Ns: 21,
        },
    }))

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

    geo.precision(25)
    for (let i = 0; i < 20; i++) {
        const B = 100
        const H = B/2

        let g
        let h = .5 + rnd() * 2
        switch( Math.floor(rnd()*5) ) {
            case 0:
                g = geo.gen().cube().scale(h).bake()
                break
            case 1:
                g = geo.gen().sphere().scale(h).bake()
                break
            case 2:
                g = geo.gen().cylinder().scale(h).bake()
                break
            case 3:
                g = geo.gen().cone().scale(h).bake()
                break
            case 4:
                g = geo.gen().tetrahedron().scale(h).bake()
                break
        }
        const spin = (rnd()*4) < 1? 0 : 1

        lab.attach( new Mesh({
            pos: vec3(
                H - B*rnd(),
                h,
                H - B*rnd()
            ),
            rot:      vec3(0, 0, 0),
            rotSpeed: vec3(0, 0, 0),
            scale:    vec3(1, 1, 1),

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
                this.rotSpeed[1] += (rnd() < .5? -1 : 1) * (.2 + rnd()*1.5) * spin
            },

            evo: function(dt) {
                this.rot[0] += this.rotSpeed[0] * dt
                this.rot[1] += this.rotSpeed[1] * dt 
                this.rot[2] += this.rotSpeed[2] * dt 
            },
        }))
    }

}
