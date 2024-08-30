// Runnable Mega-City 13 Block
class Terrace extends Frame {

    constructor(st) {
        super(st)
        this.shape()

        if (debug) this.attach( genHitboxMesh(this.pos, this.hsize) )
    }

    shape() {
        let np = vec3.isub(this.pos, this.hsize),
            xp = vec3.iadd(this.pos, this.hsize)

        let count = 0

        const gapChance = .2
        const s = 4 // block half-size
        for (let z = np[2], iz = 0; z < xp[2]; z += s*2, iz++) {
            for (let x = np[0], ix = 0; x < xp[0]; x += s*2, ix++) {
                if (rnd() < gapChance) continue // got a gap

                // sky block

                // checkboard pattern
                const colors = [
                    vec3(.2, .2, .2),
                    vec3(.2, .6, .8),
                ]
                const icolor = ((iz % 2) + (ix % 2)) % 2

                const yShift = floor(rnd() * 2)

                let h = .5
                lab.attach( new Body({
                    pos: vec3(x+s, np[1]+h + yShift, z+s),

                    _pods: [
                        new Mesh({
                            geo: geo.gen().cube()
                                .stretch(0, s)
                                .stretch(1, h)
                                .stretch(2, s)
                                .bake(),
                            mat: {
                                Ka: vec3(.5, .6, .7),
                                Kd: colors[icolor],
                                Ks: vec3(1, 1, 1),
                                Ke: vec3(1, 1, 1),
                                Lv: vec4(.2, .5, .8, 0),
                                Ns: 20,
                            },
                        }),
                        new SolidBoxPod({
                            hsize: vec3(s, h, s), 
                        }),
                    ],
                }))
                count ++
            }
        }

        log('generated: ' + count)
    }

}
