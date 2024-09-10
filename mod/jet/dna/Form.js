class Form extends Frame {

    constructor(st) {
        super( extend({
            pos:   vec3z(),
            rot:   vec3z(),
            scale: vec3(1, 1, 1)
        }, st))
    }

    draw() {
        _.mpush()

        mat4
            .translate( mMatrix, this.pos)
            .rot(       mMatrix, this.rot)
            .scale(     mMatrix, this.scale)
        
        // draw the pods
        super.draw()

        // TODO pop mMatrix
        _.mpop()
    }
}
