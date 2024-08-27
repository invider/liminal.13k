class Hero extends Frame {

    constructor(st) {

        const df = {
            eyesShiftY: 1,
            tiltAngle: 0,
            minTilt: -1,
            maxTilt:  1,
        }
        
        st._pods = augment(st._pods, [ new AttitudePod(), new FPSMovementControllerPod() ])
        super( extend(df, st) )

        this.pos[1] = 1
    }

    evo(dt) {
        // pin the camera to the eyes position
        vec3.set(this.cam.pos, this.pos[0], this.pos[1] + this.eyesShiftY, this.pos[2])

        vec3.copy(this.cam.dir,  this.dir)
        vec3.copy(this.cam.left, this.left)
        vec3.copy(this.cam.up,   this.up)
        this.cam.pitch(this.tiltAngle)

        super.evo(dt)
    }

    tilt(phi) {
        this.tiltAngle = clamp(this.tiltAngle + phi, this.minTilt, this.maxTilt)
    }

}
