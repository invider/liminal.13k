class Hero extends Frame {

    constructor(st) {
        st._pods = augment(st._pods, [ new AttitudePod(), new FPSMovementControllerPod() ])
        super(st)

        this.pos[1] = 1.5
    }

    evo(dt) {
        // bind the camera
        vec3.copy(this.cam.pos,  this.pos)
        vec3.copy(this.cam.dir,  this.dir)  // TODO calculate the right ones
        vec3.copy(this.cam.left, this.left)
        vec3.copy(this.cam.up,   this.up)

        super.evo(dt)
    }

}
