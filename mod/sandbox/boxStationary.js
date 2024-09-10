_.boxStationary = () => {
    log('setting up a bunch of stationary grounded objects')

    const R = 96   // stage size
    const N = 32   // bodies to spawn

    for (let i = 0; i < 21; i++) rnd() // shift the seed

    // giant plane
    lab.attach( new Form({
        pos:   vec3(0, 0, 0),
        rot:   vec3(0, 0, 0),
        scale: vec3(1, 1, 1),

        _pods: [
            new Surface({
                geo: geo.gen().plane().push(R).scale().bake(),
                m: {
                    a: vec3(.5, .5, .5),
                    d: vec3(.2, .4, .7),
                    s: vec3(1, 1, 1),
                    i: vec4(.2, .4, .2, 0),
                    n: 21,
                }
            })
        ],
    }))

    // === populate ===
    // create some bodies
    const colors = [
        vec4(.8, .2, .2, .8),
        vec4(.7, .8, .2, .8),
        vec4(.1, .8, .2, .8),
        vec4(.1, .8, .9, .8),
        vec4(.1, .2, .9, .8),
        vec4(.3, .5, .9, .8),
        vec4(.5, .2, .8, .8),
        vec4(.8, .7, .8, .8),
        vec4(1, 1, 1),
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
                g = geo.gen().cube().push(h).scale().sharp().bake()
                break
            case 1:
                g = geo.gen().sphere().push(h).scale().smooth().bake()
                break
            case 2:
                g = geo.gen().cylinder().push(h).scale().sharp().bake()
                geo.sharp()
                break
            case 3:
                g = geo.gen().cone().push(h).scale().smooth().bake()
                break
        }
        const spin = (rnd()*4) < 1? 0 : 1

        lab.attach( new Form({
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
                    m: {
                        a: vec4(.5, .6, .7, .2),
                        d: colors[ Math.floor(rnd() * colors.length) ],
                        s: vec4(1, 1, 1, 1),
                        n: 10,
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

    env.groundLevel = true
    extend(lab, collidableTrait)
}
