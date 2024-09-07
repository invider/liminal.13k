const FREE      = 0,
      LINKED    = 1,
      BLOCKED   = 2
      
class Connection {

    constructor(st) {
        extend(this, st)
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

    join(block) {
        this.target = block
        this.state = LINKED
        if (debug && this.sphere) {
            this.sphere.surface.mat.Ka = vec3(1, 0, 0)
            this.sphere.surface.mat.Kd = vec3(1, 0, 0)
        }
        return block
    }

    deactivate() {
        this.state = BLOCKED // can't grow in that direction
        if (debug && this.sphere) {
            this.sphere.surface.mat.Ka = vec3(1, 1, 0)
            this.sphere.surface.mat.Kd = vec3(1, 1, 0)
        }
    }

    isFree() {
        return !this.state
    }

    selfWhenFree() {
        if (!this.state) return this
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

    // DEBUG
    toString(reverse) {
        let s, t, d = reverse? this.srcDir() : this.dir
        switch(d) {
            case 1: s = 'N'; break;
            case 2: s = 'W'; break;
            case 3: s = 'S'; break;
            case 4: s = 'E'; break;
        }
        switch(this.state) {
            case LINKED: t = '='; break;
            case BLOCKED: t = '+'; break;
            default: t = '-'; break;
        }
        return `${t}${t}${s}${t}${t}`
    }
}
