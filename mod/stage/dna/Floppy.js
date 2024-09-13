class Floppy extends Form {

    constructor(st) {
        super( extend({
            rotSpeed:  vec3(0, 1, 0),
            _pods: [
                new Surface({
                    geo: glib.floppy,
                }),
                new Surface({
                    geo: glib.fdisc,
                }),
                new Surface({
                    geo: glib.shutter,
                }),
                new SolidBoxPod({
                    kind:  EPHEMERAL,
                    hsize: glib.floppy.bounds, 
                }),
            ],
        }, st))
    }

    evo(dt) {
        for (let i = 0; i < 3; i++) this.rot[i] += this.rotSpeed[i] * dt
    }

}
