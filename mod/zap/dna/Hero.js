class Hero extends Frame {

    constructor(st) {

        const df = {
            hh: 1,

            eyesShiftY: 1,
            tiltAngle: 0,
            minTilt: -1,
            maxTilt:  1,

            dx: 0,
            dy: 0,
            dz: 0,
        }
        
        st._pods = augment(st._pods, [ new AttitudePod(), new FPSMovementControllerPod() ])
        super( extend(df, st) )

        // adjust for the height
        this.pos[1] = this.hh * 10
    }

    evo(dt) {
        super.evo(dt)

        // make some gravity
        if (this.pos[1] - this.hh > 0) {
            this.dy -= tune.gravity * dt
        }

        // apply movement
        this.pos[0] += this.dx
        this.pos[1] = Math.max(this.pos[1] + this.dy, this.hh)
        this.pos[2] += this.dz

        // pin the camera to the eyes position
        vec3.set(this.cam.pos, this.pos[0], this.pos[1] + this.eyesShiftY, this.pos[2])

        vec3.copy(this.cam.dir,  this.dir)
        vec3.copy(this.cam.left, this.left)
        vec3.copy(this.cam.up,   this.up)
        this.cam.pitch(this.tiltAngle)
    }

    tilt(phi) {
        this.tiltAngle = clamp(this.tiltAngle + phi, this.minTilt, this.maxTilt)
    }

}