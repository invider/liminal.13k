class Connection {

    constructor(st) {
        extend(this, st)
        if (debug) {
            const r = 1.5

            this.sphere = this.src.attach( new Form({
                pos: vec3(
                    this.pos[0],
                    this.pos[1],
                    this.pos[2]
                ),

                _pods: [
                    new Surface({
                        geo: glib.connection,
                        m: {
                            a: vec4(0, 1, 0, .2),
                            d: vec4(0, 1, 0, .7),
                            s: vec4(1, 1, 1,  1),
                            n: 20,
                        },
                    }),
                ],
            }))
        }
    }

    join(block) {
        this.target = block
        this.state = 1 // LINKED
        if (debug && this.sphere) {
            this.sphere.surface.m.a = vec4(1, 0, 0, .2)
            this.sphere.surface.m.d = vec4(1, 0, 0, .7)
        }
        return block
    }

    deactivate() {
        this.state = 2 // can't grow in that direction
        if (debug && this.sphere) {
            this.sphere.surface.m.a = vec4(1, 1, 0, .2)
            this.sphere.surface.m.d = vec4(1, 1, 0, .7)
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
            case 1: t = '='; break;
            case 2: t = '+'; break;
            default: t = '-'; break;
        }
        return `${t}${t}${s}${t}${t}`
    }
}
