class Hero extends Frame {

    constructor(st) {

        const df = {
            eyesShiftY: 1,
        }
        
        st._pods = augment(st._pods, [ new AttitudePod(), new FPSMovementControllerPod() ])
        super( extend(df, st) )

        this.pos[1] = 1
    }

    evo(dt) {
        // pin the camera to the eyes position
        vec3.set(this.cam.pos, this.pos[0], this.pos[1] + this.eyesShiftY, this.pos[2])

        vec3.copy(this.cam.dir,  this.dir)  // TODO calculate the right ones
        vec3.copy(this.cam.left, this.left)
        vec3.copy(this.cam.up,   this.up)

        super.evo(dt)
    }

}
