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
}
