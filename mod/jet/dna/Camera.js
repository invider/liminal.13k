class Camera extends Frame {

    constructor(st) {
        const df = {
            vfov: 45,
            zNear: 1,
            zFar:  512,
        }
        st._pods = augment(st._pods, [ new AttitudePod() ])
        super( extend(df, st) )
    }

    projectionMatrix() {
        return mat4.projection(this.vfov, gcanvas.width/gcanvas.height, this.zNear, this.zFar)
    }

    viewMatrix() {
        let m
        if (this.lookAt) {
            m = mat4.lookAt(
                this.pos,
                this.lookAt,
                this.up,
            )
            // fix the attitude based on the look up matrix
            this.left = mat4.extractV3(m, 0)
            this.up   = mat4.extractV3(m, 1)
            this.dir  = mat4.extractV3(m, 2)
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