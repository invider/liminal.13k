function zapPreStage() {
    log('setting up camera...')

    lab.attach( new Camera({
        name: 'cam',

        // customized camera behavior
        _pods: [
            new FreeMovementControllerPod(),
        ],

        init: function() {
            trap.register('keyDown', (e) => {
                switch(e.code) {
                    case 'KeyF':
                        lab.cam.jumpNext()
                        break
                    case 'KeyX':
                        lab.cam.looseIt()
                        break
                }
            })
        },

        jumpNext: function() {
            const id = Math.floor(Math.random() * lab._ls.length)
            const next = lab._ls[id]
            this.lookAt = next.pos
        },
        looseIt: function() {
            this.lookAt = 0
            vec3.set(this.pos, 0, 0, 0)
        },
    }))

    if (debug) {
        lab.attach( new HUD() )
        lab.attach( _.stageStat )
    }
}
