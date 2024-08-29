
// =========================================
env.title = 'Physics - collision resolution'
// =========================================

_.defaultStage = () => {
    log('setting up the default stage')

    const R = 64   // stage size
    const N = 0  // meshes to spawn

    // giant plane
    lab.attach( new Body({
        pos:   vec3(0, 0, 0),
        rot:   vec3(0, 0, 0),
        scale: vec3(1, 1, 1),

        _pods: [
            new Mesh({
                geo: geo.gen().plane().scale(R).bake(),
                mat: {
                    Ka: vec3(.5, .5, .5),
                    Kd: vec3(.2, .4, .7),
                    Ks: vec3(1, 1, 1),
                    Ke: vec3(1, 1, 1),
                    Lv: vec4(.2, .4, .2, 0),
                    Ns: 21,
                }
            })
        ],
    }))

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
                g = geo.gen().cube().scale(h).bake()
                break
            case 1:
                g = geo.gen().sphere().scale(h).bake()
                break
            case 2:
                g = geo.gen().cylinder().scale(h).smooth().bake()
                geo.sharp()
                break
            case 3:
                g = geo.gen().cone().scale(h).bake()
                break
            case 4:
                g = geo.gen().name('tetrahedron').tetrahedron().scale(h).bake()
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
                new Mesh({
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
    
    let h = 2
    lab.attach( new Body({
        name: 'cuboid',
        pos: vec3(0, 2, 0),
        rot: vec3(0, 0, 0),
        scale: vec3(1, 1, 1),

        _pods: [
            new Mesh({
                geo: geo.gen().cube().scale(h).bake(),
                mat: {
                    Ka: vec3(.5, .6, .7),
                    Kd: vec3(.1, .8, .9),
                    Ks: vec3(1, 1, 1),
                    Ke: vec3(1, 1, 1),
                    Lv: vec4(.2, .5, .8, 0),
                    Ns: 50,
                },
            }),
            new SolidBoxPod({
                hsize: vec3(h, h, h), 
            }),
        ],
    }))

    // the hero time!
    hero = lab.attach( new Hero({
        name: 'hero',
        type: 'superhero',
        pos:  vec3(0, 0, -5),
        _pods: [ lab.cam ],
    }))

}
