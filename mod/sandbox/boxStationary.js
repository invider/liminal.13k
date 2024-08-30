_.boxStationary = () => {
    log('setting up a bunch of stationary grounded objects')

    const R = 96   // stage size
    const N = 32   // meshes to spawn

    for (let i = 0; i < 21; i++) rnd() // shift the seed

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
        let h = 1.5 + rnd() * 2
        switch( Math.floor(rnd()*4) ) {
            case 0:
                g = geo.gen().cube().scale(h).sharp().bake()
                break
            case 1:
                g = geo.gen().sphere().scale(h).smooth().bake()
                break
            case 2:
                g = geo.gen().cylinder().scale(h).sharp().bake()
                geo.sharp()
                break
            case 3:
                g = geo.gen().cone().scale(h).smooth().bake()
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
        }))
    }
    
    // the hero time!
    hero = lab.attach( new Hero({
        name: 'hero',
        type: 'superhero',
        pos:  vec3(0, 1, 5),
        _pods: [ lab.cam ],
    }))

}
