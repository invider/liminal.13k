_.boxCube = function() {
    log('setup a stage with a single cube')

    lab.attach( new Mesh({
        pos: vec3(0, 0, -1),
        rot: vec3(0, 0, 0),
        rotSpeed: vec3(0, 0, 0),
        scale: vec3(1, 1, 1),
        geo: geo.gen().cube().scale(2).bake(),

        mat: {
            Ka: vec3(.5, .6, .7),
            Kd: vec3(.1, .8, .9),
            Ks: vec3(1, 1, 1),
            Ke: vec3(1, 1, 1),
            Lv: vec4(.2, .5, .8, 0),
            Ns: 50,
        },

        init() {
            this.rotSpeed[0] = .5
            this.rotSpeed[1] = .3 
        },

        evo: function(dt) {
            this.rot[0] += this.rotSpeed[0] * dt
            this.rot[1] += this.rotSpeed[1] * dt 
            this.rot[2] += this.rotSpeed[2] * dt 
        },
    }))

    // move camera back a little
    lab.cam.pos[1] = 1
    lab.cam.pos[2] = 4
}
