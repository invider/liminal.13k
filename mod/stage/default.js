_.defaultStage = () => {
    log('setting up the default stage')

    const R = 128   // stage size
    const N = 0     // surfaces to spawn

    // === populate ===
    // create some bodies
    const colors = [
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
    for (let i = 0; i < N; i++) {
        const B = R
        const H = B/2

        // generate a random geometry
        let g
        let h = .5 + rnd() * 2
        switch( Math.floor(rnd()*5) ) {
            case 0:
                g = geo.gen().cube().push(h).scale().bake()
                break
            case 1:
                g = geo.gen().sphere().push(h).scale().bake()
                break
            case 2:
                g = geo.gen().cylinder().push(h).scale().smooth().bake()
                geo.sharp()
                break
            case 3:
                g = geo.gen().cone().push(h).scale().bake()
                break
            case 4:
                g = geo.gen().name('tetrahedron').tetrahedron().push(h).scale().bake()
                break
        }
        const spin = (rnd()*4) < 1? 0 : 1

        lab.attach( new Body({
            pos: vec3(
                H - B*rnd(),
                h,
                H - B*rnd()
            ),
            rot:      vec3(0, 0, 0),
            rotSpeed: vec3(0, 0, 0),
            scale:    vec3(1, 1, 1),

            _pods: [
                new Surface({
                    geo: g,
                    mat: {
                        Ka: vec3(.5, .6, .7),
                        Kd: colors[ Math.floor(rnd() * colors.length) ],
                        Ks: vec3(1, 1, 1),
                        Ke: vec3(1, 1, 1),
                        Lv: vec4(.2, .5, 1, 0),
                        Ns: 10,
                    },
                }),
                new SolidBoxPod({
                    hsize: vec3(h, h, h), 
                }),
            ],

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

    // a sample box
    _gUV = 1
    let h = 2

    lab.attach( new Body({
        name: 'cuboid',
        pos: vec3(-8, 2, -4),
        rot: vec3(0, 0, 0),
        scale: vec3(1, 1, 1),

        _pods: [
            new Surface({
                geo: geo.gen().cube().push(h).scale().bake(),
                mat: {
                    Ka: vec3(.5, .6, .7),
                    Kd: vec3(.1, .8, .9),
                    Ks: vec3(1, 1, 1),
                    Ke: vec3(1, 1, 1),
                    Lv: vec4(.2, .5, .8, 0),
                    Ns: 50,
                },
                tex: _.tex['simple']
            }),
            new SolidBoxPod({
                hsize: vec3(h, h, h), 
            }),
        ],
    }))

    lab.attach( new Body({
        name: 'cuboid2',
        pos: vec3(12, 5, -4),
        rot: vec3(0, 0, 0),
        scale: vec3(1, 1, 1),

        _pods: [
            new Surface({
                geo: geo.gen().cube().push(h).scale().bake(),
                mat: {
                    Ka: vec3(.5, .6, .7),
                    Kd: vec3(.1, .8, .9),
                    Ks: vec3(1, 1, 1),
                    Ke: vec3(1, 1, 1),
                    Lv: vec4(.2, .5, .8, 0),
                    Ns: 50,
                },
                tex: _.tex['noise']
            }),
            new SolidBoxPod({
                hsize: vec3(h, h, h), 
            }),
        ],
    }))
    _gUV = 0

    extend(lab, collidableTrait)

    // our first terrace
    lab.attach( new Terrace({
        name: 'terrace1',
        seed:  101,
        pos:   vec3(0,  4, 0),
        hsize: vec3(64, 4, 64),
    }))

    lab.attach( new Prop({
        name:  'superprop',
        pos:   vec3(0, 3, 0),
        reactive: 1,

        onKill: function() {
            log('consumed')
        }
    }))

    lab.freeCam = lab.cam
    // create hero cam
    lab.attach( new Camera({
        name: 'cam',
    }))

    // the hero time!
    hero = lab.attach( new Hero({
        name: 'hero',
        type: 'superhero',
        pos:  vec3(0, 10, 5),
        _pods: [ lab.cam ],
    }))

    trap.register('terminalFall', () => {
        hero.reset()
    })

    if (debug) {
        lab.attach( _.playerStateDump )

        trap.register('keyDown', (e) => {
            if (e.code === 'F2') {
                if (lab.cam === lab.hero.cam) {
                    lab.cam = lab.freeCam
                    lab.cam.mover.capture()
                } else {
                    lab.cam = lab.hero.cam
                    lab.hero.mover.capture()
                }
            }
        })
    }
}

