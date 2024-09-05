class Prop extends Body {

    constructor(st) {
        const s = 1, w = .2
        super( extend({
            rotSpeed:  vec3(0, 1, 0),
            _pods: [
                new Surface({
                    geo: geo.gen().cube()
                        .pushv([s, s, w])
                        .stretchX()
                        .stretchY()
                        .stretchZ()
                        .bake(),
                    mat: {
                        Ka: vec3(.5, .6, .7),
                        Kd: vec3(.8, .2, .2),
                        Ks: vec3(1, 1, 1),
                        Ke: vec3(1, 1, 1),
                        Lv: vec4(.2, .5, .8, 0),
                        Ns: 20,
                    },
                }),
                new SolidBoxPod({
                    kind:  EPHEMERAL,
                    hsize: vec3(s, s, w), 
                }),
            ],
        }, st))
    }

    evo(dt) {
        this.rot[0] += this.rotSpeed[0] * dt
        this.rot[1] += this.rotSpeed[1] * dt 
        this.rot[2] += this.rotSpeed[2] * dt 
    }

}
