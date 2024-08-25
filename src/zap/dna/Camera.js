class Camera extends Frame {

    constructor(st) {
        super( extend({
            _pods: [ new AttitudePod() ],
        }, st))
    }

    evo() {}

    viewMatrix() {
        let m
        if (this.lookAt) {
            m = mat4.lookAt(
                this.at.pos,
                this.at.lookAt,
                this.at.up,
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

}
