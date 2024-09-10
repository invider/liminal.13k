class Floppy extends Body {

    constructor(st) {
        super( extend({
            rotSpeed:  vec3(0, 1, 0),
            _pods: [
                new Surface({
                    geo: glib.floppy,
                    m: mlib.floppy
                }),
                new Surface({
                    geo: glib.fdisc,
                    m: mlib.metal
                }),
                new Surface({
                    geo: glib.shutter,
                    m: mlib.metal
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
