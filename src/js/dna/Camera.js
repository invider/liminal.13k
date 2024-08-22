class Camera {

    constructor(st) {
        extend(this, st)
    }

    evo() {}

    viewMatrix() {
        let m
        if (this.lookAt) {
            m = mat4.lookAt(
                this.pos,
                this.lookAt,
                this.up,
            )
            mat4.invert(m)
        } else {

            const dir = vec3.normalize(this.dir)
            const up = vec3.normalize(this.up)
            const left = vec3.normalize( vec3.icross(up, dir) )
            //const zAxis = vec3.normalize( vec3.isub(cam, tar) )
            //const xAxis = vec3.normalize( vec3.icross(up, zAxis) )
            //const yAxis = vec3.normalize( vec3.icross(dir, left) )

            m = mat4.createV3(left, up, dir, this.pos)
            mat4.invert(m)
            //m = mat4.identity()

            //mat4.rot(m, this.rot)
            //mat4.translate(m, this.pos)
        }

        return m
    }

    moveX(span) {
        const mv = vec3.copy(this.left)
        vec3.scale(mv, span)
        vec3.add(this.pos, mv)
    }

    moveY(span) {
        const mv = vec3.copy(this.up)
        vec3.scale(mv, span)
        vec3.add(this.pos, mv)
    }

    moveZ(span) {
        const mv = vec3.copy(this.dir)
        vec3.scale(mv, span)
        vec3.add(this.pos, mv)
    }

}
