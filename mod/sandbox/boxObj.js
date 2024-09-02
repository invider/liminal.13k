_.boxObj = function() {

    lab.cam.pos[1] = 2

    // giant plane
    lab.attach( new Mesh({
        pos: vec3(0, 0, 0),
        rot: vec3(0, 0, 0),
        rotSpeed: vec3(3, 0, 0),
        scale: vec3(1, 1, 1),
        geo: geo.gen().plane().push(150).scale().bake(),
        mat: {
            Ka: vec3(.5, .5, .5),
            Kd: vec3(.2, .4, .7),
            Ks: vec3(1, 1, 1),
            Ke: vec3(1, 1, 1),
            Lv: vec4(.2, .4, .2, 0),
            Ns: 21,
        },
    }))

    // some meshes
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

    // and some .obj as well
    loadRes('res/teapot.obj', (raw) => {
        const g = parseObj(raw)

        lab.attach( new Mesh({
            name: 'teapot',

            pos: vec3(
                0,
                2,
                -20,
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
                Lv: vec4(.2, .5, 1, 0),
                Ns: 10,
            },

            init() {
                this.rotSpeed[1] = .5
            },

            evo: function(dt) {
                this.rot[0] += this.rotSpeed[0] * dt
                this.rot[1] += this.rotSpeed[1] * dt 
                this.rot[2] += this.rotSpeed[2] * dt 
            },
        }))
    })

    // and some .obj as well
    loadJSON('res/teapot.json', (raw) => {
        const g = parseJsonModel(raw)

        lab.attach( new Mesh({
            name: 'teapoter',

            pos: vec3(
                -10,
                2,
                -20,
            ),
            rot:      vec3(0, 0, 0),
            rotSpeed: vec3(0, 0, 0),
            scale:    vec3(.2, .2, .2),

            geo: g,
            mat: {
                Ka: vec3(.5, .6, .7),
                Kd: meshColors[ Math.floor(rnd() * meshColors.length) ],
                Ks: vec3(1, 1, 1),
                Ke: vec3(1, 1, 1),
                Lv: vec4(.2, .7, 1, 0),
                Ns: 10,
            },

            init() {
                this.rotSpeed[0] = .2
                this.rotSpeed[1] = .5
            },

            evo: function(dt) {
                this.rot[0] += this.rotSpeed[0] * dt
                this.rot[1] += this.rotSpeed[1] * dt 
                this.rot[2] += this.rotSpeed[2] * dt 
            },
        }))
    })

    // and some cube.obj as well
    loadRes('res/cubicle.obj', (raw) => {
        const g = parseObj(raw)

        lab.attach( new Mesh({
            name: 'cube',

            pos: vec3(
                10,
                2,
                -20,
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
                Lv: vec4(.2, .5, 1, 0),
                Ns: 10,
            },

            init() {
                this.rotSpeed[0] = .2
                this.rotSpeed[1] = .5
            },

            evo: function(dt) {
                this.rot[0] += this.rotSpeed[0] * dt
                this.rot[1] += this.rotSpeed[1] * dt 
                this.rot[2] += this.rotSpeed[2] * dt 
            },
        }))
    })
}
