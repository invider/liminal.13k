class Prop extends Body {

    constructor(st) {
        super( extend({
            rotSpeed:  vec3(0, 1, 0),
            _pods: [
                new Surface({
                    geo: glib.floppy,
                    mat: mlib.floppy
                }),
                new Surface({
                    geo: glib.fdisc,
                    mat: mlib.metal
                }),
                new Surface({
                    geo: glib.shutter,
                    mat: mlib.metal
                }),
                new SolidBoxPod({
                    kind:  EPHEMERAL,
                    hsize: glib.floppy.bounds, 
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
