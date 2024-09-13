function checkSqDist(pn, bmin, bmax) {
    let out = 0

    if (pn < bmin) {
        // the point is on the left
        let d = (bmin - pn)
        out += d*d
    }
    if (pn > bmax) {
        // the point is on the right
        let d = (pn - bmax)
        out += d*d
    }
    return out
}

function squareDistPoint(p, min, max) {
    let sq = 0
    sq += checkSqDist(p[0], min[0], max[0])
    sq += checkSqDist(p[1], min[1], max[1])
    sq += checkSqDist(p[2], min[2], max[2])
    return sq
}

function intersectHitboxes(a, b) {
    return (
        a.min[0] < b.max[0] &&
        a.max[0] > b.min[0] &&
        a.min[1] < b.max[1] &&
        a.max[1] > b.min[1] &&
        a.min[2] < b.max[2] &&
        a.max[2] > b.min[2]
    )
}

class SolidBoxPod {

    constructor(st) {
        extend(this, {
            name:  'solid',
            type:  HIT_BOX,
            kind:  HARD,
            pos:   vec3(0, 0, 0),
            hsize: vec3(1, 1, 1),
        }, st)
    }

    /*
    // DEBUG hitboxes
    init() {
        if (debug) {
            this.__.attach( genHitBoxMesh(this.pos, this.hsize) )
        }
    }
    */

    // precalculate bounding volume
    fixBounds() {
        // TODO keep precalculated for static models
        // TODO apply the cached model matrix from the parent
        this.wpos = vec3.clone(this.pos)
        if (this.__) vec3.add(this.wpos, this.__.pos)

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

    /*
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
    */

    touch(solid) {
        // TODO must be precalcuated fox fixed nodes!
        this.fixBounds()

        switch(solid.type) {
            case HIT_BOX:
                solid.fixBounds() // TODO precalculate?
                return intersectHitboxes(this, solid)
            //case HIT_SPHERE:
            //    const sdist = squareDistPoint(solid.wpos, this.min, this.max)
            //    return (sdist <= solid.r * solid.r)
        }
    }

    deltaY(solid) {
        // do only boxes here!
        return this.max[1] - solid.min[1]
    }

    /*
    // ray intersection
    touchRay(p, d) {
        let tmin = 0,
            tmax = 99999

        this.fixBounds() // move out
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
    */
}
