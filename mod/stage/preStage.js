// The geometry MUST be generated BEFORE we start the game
function generateGeometry() {
    // generate some meshes
    this._sphereMesh = geo.gen().push(15).precision().sphere().smooth().push('smoothSphere').name().bake()
    geo.sharp()
}

function zapPreStage() {
    lab.attach( new Camera({
        name: 'cam',

        // customized camera behavior
        _pods: [
            new FreeMovementControllerPod(),
        ],
    }))

    if (debug) {
        lab.attach( new HUD() )
        lab.attach( _.stageStat )
    }

    generateGeometry()
}
