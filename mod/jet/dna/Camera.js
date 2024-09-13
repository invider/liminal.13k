class Camera extends Frame {

    constructor(st) {
        const df = {
            vfov: 30,
            zNear: 1,
            zFar:  512,
        }
        st._traits = augment(st._traits, [ attitudeTrait ])
        super( extend(df, st) )
    }

    projectionMatrix() {
        const aspect = gc.width / gc.height
        this.hfov = (2 * Math.atan(aspect * Math.tan((this.vfov * DEG_TO_RAD)/2))) * RAD_TO_DEG
        return mat4.projection(this.vfov, gc.width/gc.height, this.zNear, this.zFar)
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
            vec3.n( this.up )
            vec3.n( this.dir )
            this.left = vec3.n( vec3.icross(this.up, this.dir) ),

            m = mat4.from4V3( this.left, this.up, this.dir, this.pos )
            //m = mat4.identity() // DEBUG use identity in case something goes wrong
            //m[14] = -10         //       with the view tranformations
        }
        mat4.invert(m)

        return m
    }

    /*
    pick() {
        // calculate the proper ray vector
        const cdir = vec3.clone(this.dir)
        vec3.scale(cdir, -1)
        const pos = this.pos
        const ignored = this.__

        return lab.apply((e, collector) => {
            if (e !== ignored && e.solid) {
                const rayHit = e.solid.touchRay(pos, cdir)
                if (rayHit) collector.push(rayHit)
            }
        }, [])
    }
    */

}
