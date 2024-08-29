class SolidBoxPod {

    constructor(st) {
        extend(this, {
            pos:   vec3(0, 0, 0),
            hsize: vec3(1, 1, 1),
        }, st)
    }

    init() {
        this.__.solid = this

        if (debug) {
            const p = this.pos,
                  h = this.hsize

            this.geo = geo.gen().name('hitBox').vertices([
                // top face
                p[0] + h[0], p[1] + h[1], p[2] - h[2],
                p[0] - h[0], p[1] + h[1], p[2] - h[2],

                p[0] - h[0], p[1] + h[1], p[2] - h[2],
                p[0] - h[0], p[1] + h[1], p[2] + h[2],

                p[0] + h[0], p[1] + h[1], p[2] + h[2],
                p[0] - h[0], p[1] + h[1], p[2] + h[2],

                p[0] + h[0], p[1] + h[1], p[2] - h[2],
                p[0] + h[0], p[1] + h[1], p[2] + h[2],

                // sides
                p[0] + h[0], p[1] + h[1], p[2] - h[2],
                p[0] + h[0], p[1] - h[1], p[2] - h[2],

                p[0] - h[0], p[1] + h[1], p[2] - h[2],
                p[0] - h[0], p[1] - h[1], p[2] - h[2],

                p[0] + h[0], p[1] + h[1], p[2] + h[2],
                p[0] + h[0], p[1] - h[1], p[2] + h[2],

                p[0] - h[0], p[1] + h[1], p[2] + h[2],
                p[0] - h[0], p[1] - h[1], p[2] + h[2],


                // bottom face
                p[0] + h[0], p[1] - h[1], p[2] - h[2],
                p[0] - h[0], p[1] - h[1], p[2] - h[2],

                p[0] - h[0], p[1] - h[1], p[2] - h[2],
                p[0] - h[0], p[1] - h[1], p[2] + h[2],

                p[0] + h[0], p[1] - h[1], p[2] + h[2],
                p[0] - h[0], p[1] - h[1], p[2] + h[2],

                p[0] + h[0], p[1] - h[1], p[2] - h[2],
                p[0] + h[0], p[1] - h[1], p[2] + h[2],
            ]).bakeWires()
        }

        const wmesh = new WireMesh({
            name: 'hitboxMesh',
            geo: this.geo,
            renderOptions: vec4(0, 1, 0, 0),
        })
        this.__.attach(wmesh)
    }

    place() {
        // TODO apply the cached model matrix from the parent
        this.wpos = vec3.clone(this.pos)
        vec3.add(this.wpos, this.__.pos)

        const min = [], max = [],
              wp = this.wpos, h = this.hsize
        for (let i = 0; i < 3; i++) {
            const v1 = wp[i] - h[i],
                  v2 = wp[i] + h[i]
            min[i] = v1 < v2? v1 : v2
            max[i] = v1 > v2? v1 : v2
        }
        this.min = min
        this.max = max
    }

    closestPoint(p) {
        const o = this.wpos, h = this.hsize
        // TODO accumulate into a vec3
        let dx = abs(o[0] - h[0] - p[0]) < abs(o[0] + h[0] - p[0])? -1 : 1
        let dy = abs(o[1] - h[1] - p[1]) < abs(o[1] + h[1] - p[1])? -1 : 1
        let dz = abs(o[2] - h[2] - p[2]) < abs(o[2] + h[2] - p[2])? -1 : 1
        return vec3(
            o[0] + h[0] * dx,
            o[1] + h[1] * dy,
            o[2] + h[2] * dz,
        )
    }

    touch(sphere) {
        this.place()
        const c = this.closestPoint( sphere.wpos )
        const d = vec3.len( vec3.isub(c, sphere.wpos) )
        if (d < sphere.r) sphere.impact(this)
    }

    hit(p, d) {
        let tmin = 0,
            tmax = 99999

        this.place()
        const w = this.wpos,
              h = this.hsize,
              min = this.min,
              max = this.max

        for (let i = 0; i < 3; i++) {
            if (abs(d[i]) < EPSILON) {
                // the ray runs parallel to the slab
                // no hit if the origin is outside the slab
                if (p[i] < min[i] || p[i] > max[i]) return
            } else {
                const ood = 1/d[i]
                let t1 = (min[i] - p[i]) * ood,
                    t2 = (max[i] - p[i]) * ood
                if (t1 > t2) {
                    t2 += t1
                    t1 = t2 - t1
                    t2 -= t1
                }
                tmin = Math.max(tmin, t1)
                tmax = Math.min(tmax, t2)
                if (tmin > tmax) return
            }
        }
        // the ray intersects with all 3 slabs
        const hp = vec3.clone(d)
        vec3.scale(hp, tmin)
        vec3.add(hp, p)

        return {
            __:       this.__,
            dist:     tmin,
            hitPoint: hp,
        }
    }
}
