class SolidBoxPod {

    constructor(st) {
        extend(this, {
            pos:   vec3(0, 0, 0),
            hsize: vec3(1, 1, 1),
        }, st)
    }

    init() {
        this.__.solid = this
    }

    place() {
        // TODO apply the cached model matrix from the parent
        this.wpos = vec3.clone(this.pos)
        vec3.add(this.wpos, this.__.pos)
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
}
