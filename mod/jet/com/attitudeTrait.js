const attitudeTrait = {

    __onTrait: function() {
        extend(this, {
            pos:   vec3z(),
            dir:   vec3(0, 0, 1),
            up:    vec3(0, 1, 0),
            left:  vec3(1, 0, 0),
        })
    },

    moveX: function(span) {
        const mv = vec3.clone(this.left)
        vec3.scale(mv, span)
        vec3.add(this.pos, mv)
    },

    moveY: function(span) {
        const mv = vec3.clone(this.up)
        vec3.scale(mv, span)
        vec3.add(this.pos, mv)
    },

    moveZ: function(span) {
        const mv = vec3.clone(this.dir)
        vec3.scale(mv, span)
        vec3.add(this.pos, mv)
    },

    yaw: function(theta) {
        const rm = mat4.from4V3( this.left, this.up, this.dir, vec3(0, 0, 0) )
        mat4.rotX(rm, -theta)
        this.left = mat4.extractV3(rm, 0)
        this.dir = mat4.extractV3(rm, 2)
        this.up = vec3.n( vec3.icross(this.dir, this.left) )
    },

    pitch: function(theta) {
        const rm = mat4.from4V3( this.left, this.up, this.dir, vec3(0, 0, 0) )
        mat4.rotY(rm, theta)
        this.up = mat4.extractV3(rm, 1)
        this.dir = mat4.extractV3(rm, 2)
        this.left = vec3.n( vec3.icross(this.up, this.dir) )
    },

    roll: function(theta) {
        const rm = mat4.from4V3( this.left, this.up, this.dir, vec3(0, 0, 0) )
        mat4.rotZ(rm, theta)
        this.left = mat4.extractV3(rm, 0)
        this.up = mat4.extractV3(rm, 1)
        this.dir = vec3.n( vec3.icross(this.left, this.up) )
    }
}
