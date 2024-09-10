_.boxGeo = function() {
    log('setting up Geo box...')

    const colors = [
        vec4(.8, .2, .2, 1),
        vec4(.7, .8, .2, 1),
        vec4(.1, .8, .2, 1),
        vec4(.1, .8, .9, 1),
        vec4(.1, .2, .9, 1),
        vec4(.3, .5, .9, 1),
        vec4(.5, .2, .8, 1),
        vec4(.8, .7, .8, 1),
        vec4(1, 1, 1),
    ]

    /*
    let enops = screwUp(`
        neogeo plane 
        neogeo cube 2 scale "cube" name brew'
    `)
    geo(enops)
    */

    for (let i = 0; i < 256; i++) {
        const B = 100
        const H = B/2

        let g
        switch( Math.floor(rnd()*8) ) {
            case 0:
                g = geo.gen().plane().push(.5 + rnd() * 2).scale().bake()
                break
            case 1:
                g = geo.gen().cube().push(.5 + rnd() * 2).scale().bake()
                break
            case 2:
                g = geo.gen().sphere().push(.5 + rnd() * 2).scale().bake()
                break
            case 3:
                g = geo.gen().cylinder().push(.5 + rnd() * 2).scale().bake()
                break
            case 4:
                g = geo.gen().cone().push(.5 + rnd() * 2).scale().bake()
                break
            case 5:
                g = geo.gen().circle().push(.5 + rnd() * 2).scale().bake()
                break
            case 6:
                g = geo.gen().push(.75).ring().push(.5 + rnd() * 2).scale().bake()
                break
            case 7:
                g = geo.gen().tetrahedron().push(.5 + rnd() * 2).scale().bake()
                break
        }
        const spin = (rnd()*4) < 1? 0 : 1

        lab.attach( new Form({
            pos: vec3(
                H - B*rnd(),
                H - B*rnd(),
                H - B*rnd()
            ),
            rot:   vec3(0, 0, 0),
            rotSpeed: vec3(0, 0, 0),
            scale: vec3(1, 1, 1),

            _pods: [
                new Surface({
                    geo: g,
                    m: {
                        a: vec3(.5, .6, .7),
                        d: colors[ Math.floor(rnd() * colors.length) ],
                        s: vec3(1, 1, 1),
                        i: vec4(.2, .5, .8, 0),
                        n: 10,
                    },
                })
            ],

            init() {
                this.rotSpeed[0] += (rnd() < .5? -1 : 1) * (.5 + rnd()*3) * spin
                this.rotSpeed[1] += (rnd() < .5? -1 : 1) * (.2 + rnd()*1.5) * spin
            },

            evo: function(dt) {
                this.rot[0] += this.rotSpeed[0] * dt
                this.rot[1] += this.rotSpeed[1] * dt 
                this.rot[2] += this.rotSpeed[2] * dt 
            },
        }))
    }


    // huge plane
    lab.attach( new Form({
        pos: vec3(0, -50, 0),
        rot: vec3(0, 0, 0),
        rotSpeed: vec3(3, 0, 0),
        scale: vec3(1, 1, 1),

        _pods: [
            new Surface({
                geo: geo.gen().plane().push(30).scale().bake(),
                m: {
                    a: vec3(.5, .5, .5),
                    d: vec3(.5, .5, .5),
                    s: vec3(1, 1, 1),
                    i: vec4(.1, .4, .9, 0),
                    n: 21,
                },
            }),
        ],
    }))

    lab.attach( new Form({
        pos: vec3(0, 50, 0),
        rot: vec3(0, 0, 0),
        rotSpeed: vec3(3, 0, 0),
        scale: vec3(1, 1, 1),

        _pods: [
            new Surface({
                geo: geo.gen().plane().push(30).scale().bake(),
                m: {
                    a: vec3(.5, .5, .5),
                    d: vec3(.5, .5, .5),
                    s: vec3(1, 1, 1),
                    i: vec4(.2, .8, 0, 0),
                    n: 21,
                },
            }),
        ],
    }))

    // THE SUN!!!
    lab.attach( new Form({
        pos: vec3(0, 0, 0), // TODO set the position of s point light
        rot: vec3(0, 0, 0),
        rotSpeed: vec3(3, 0, 0),
        scale: vec3(1, 1, 1),

        _pods: [
            new Surface({
                geo: geo.gen().sphere().push(1).scale().bake(),
                m: {
                    a: vec3(1, 1, .5),
                    d: vec3(1, 1, 1),
                    s: vec3(1, 1, 1),
                    i: vec4(1, 0, 0, 0),
                    n: 21,
                },
            }),
        ],

        evo: function(dt) {
            this.rot[0] += this.rotSpeed[0] * dt
            this.rot[1] += this.rotSpeed[1] * dt 
            this.rot[2] += this.rotSpeed[2] * dt 
        },
    }))

    // planetoid
    lab.attach( new Form({
        pos: vec3(80, -20, -40),
        rot: vec3(0, 0, 0),
        rotSpeed: vec3(0, .2, 0),
        scale: vec3(1, 1, 1),

        _pods: [
            new Surface({
                geo: geo.gen().push(25).precision().smooth().sphere().push(35).scale().bake(),
                m: {
                    a: vec3(.8, .4, .7),
                    d: vec3(.6, .25, .8),
                    s: vec3(1, 1, 1),
                    i: vec4(.2, .6, .8, 0),
                    n: 10,
                },
            }),
        ],

        evo: function(dt) {
            this.rot[0] += this.rotSpeed[0] * dt
            this.rot[1] += this.rotSpeed[1] * dt 
            this.rot[2] += this.rotSpeed[2] * dt 
        },
    }))

    // the ring
    lab.attach( new Form({
        pos: vec3(80, -20, -40),
        rot: vec3(0, 0, 0),
        rotSpeed: vec3(0, .15, 0),
        scale: vec3(1, 1, 1),

        _pods: [
            new Surface({
                geo: geo.gen().push(.85).ring().push(75).scale().bake(),
                m: {
                    a: vec3(.6, .4, .8),
                    d: vec3(.4, .4, .6),
                    s: vec3(1, 1, 1),
                    i: vec4(.6, .4, 1, 0),
                    n: 10,
                },
            }),
        ],

        evo: function(dt) {
            this.rot[0] += this.rotSpeed[0] * dt
            this.rot[1] += this.rotSpeed[1] * dt 
            this.rot[2] += this.rotSpeed[2] * dt 
        },
    }))
    geo.precision(5)
}
