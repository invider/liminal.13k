class Camera {

    constructor(st) {
        this.dir  = vec3(0, 0, 1)
        this.up   = vec3(0, 1, 0)
        this.left = vec3(1, 0, 0)
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
        } else {
            vec3.normalize( this.up )
            vec3.normalize( this.dir )
            this.left = vec3.normalize( vec3.icross(this.up, this.dir) ),

            m = mat4.from4V3( this.left, this.up, this.dir, this.pos )
            //m = mat4.identity() // DEBUG use identity in case something goes wrong
            //m[14] = -10         //       with the view tranformations
        }
        mat4.invert(m)

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

    yaw(theta) {
        const rm = mat4.from4V3( this.left, this.up, this.dir, vec3(0, 0, 0) )
        mat4.rotX(rm, theta)
        this.left = mat4.extractV3(rm, 0)
        this.dir = mat4.extractV3(rm, 2)
        //this.up = vec3.normalize( vec3.icross(this.left, this.dir) )
    }

    pitch(theta) {
        const rm = mat4.from4V3( this.left, this.up, this.dir, vec3(0, 0, 0) )
        mat4.rotY(rm, theta)
        this.up = mat4.extractV3(rm, 1)
        this.dir = mat4.extractV3(rm, 2)
        //this.left = vec3.normalize( vec3.icross(this.up, this.dir) )
    }

    roll(theta) {
        const rm = mat4.from4V3( this.left, this.up, this.dir, vec3(0, 0, 0) )
        mat4.rotZ(rm, theta)
        this.left = mat4.extractV3(rm, 0)
        this.up = mat4.extractV3(rm, 1)
    }

}
