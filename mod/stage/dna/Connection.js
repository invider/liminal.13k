class Connection {

    constructor(st) {
        extend(this, st)

        if (debug) this.debugSphere()
    }

    join(block) {
        this.target = block
        if (debug && this.sphere) {
            this.sphere.surface.mat.Ka = vec3(1, 0, 0)
            this.sphere.surface.mat.Kd = vec3(1, 0, 0)
        }
        return block
    }

    disable() {
        this.disabled = true
        if (debug && this.sphere) {
            this.sphere.surface.mat.Ka = vec3(1, 1, 0)
            this.sphere.surface.mat.Kd = vec3(1, 1, 0)
        }
    }

    /*
    isFree() {
        return !this.target
    }
    */

    selfWhenFree() {
        if (!this.disabled && !this.target) return this
    }

    srcDir() {
        switch(this.dir) {
            case 1: return 3
            case 2: return 4
            case 3: return 1
            case 4: return 2
        }
    }

    probe() {
        const hs = vec3(32, 32, 32)
        const ps = vec3.iadd(this.pos, vec3(dirDX(this.dir) * hs[0], 0, dirDZ(this.dir) * hs[2]))
        if (this.src._$.isClaimed(ps, hs)) {
            this.disable()
        }
    }

    debugSphere() {
        if (debug) {
            const r = 1.5

            this.sphere = this.src.attach( new Body({
                pos: vec3(
                    this.pos[0],
                    this.pos[1],
                    this.pos[2]
                ),

                _pods: [
                    new Surface({
                        geo: glib.smoothSphere,
                        mat: {
                            Ka: vec3(0, 1, 0),
                            Kd: vec3(0, 1, 0),
                            Ks: vec3(1, 1, 1),
                            Ke: vec3(1, 1, 1),
                            Lv: vec4(.2, .7, 1, 0),
                            Ns: 20,
                        },
                    }),
                ],
            }))
        }
    }

}
