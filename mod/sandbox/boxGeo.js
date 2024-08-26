_.boxGeo = function() {
    log('setting up Geo box...')

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
        geo: geo.gen().precision(25).smooth().sphere().scale(35).bake(),
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
