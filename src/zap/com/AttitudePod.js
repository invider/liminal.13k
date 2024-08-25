class AttitudePod {

    init() {
        // install position and attitude vectors on the parent node,
        // install attitude and propulsion functions
        extend(this.__, {
            pos:   vec3(0, 0, 0),
            dir:   vec3(0, 0, 1),
            up:    vec3(0, 1, 0),
            left:  vec3(1, 0, 0),
            moveX: this.moveX,
            moveY: this.moveY,
            moveZ: this.moveZ,
            yaw:   this.yaw,
            pitch: this.pitch,
            roll:  this.yaw,
        })
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
