_.boxCorkscrew = (() => {

    function setupCameraAndLight() {
        // === camera and lights ===

        // move camera back a little
        lab.cam.pos = vec3(0, 5, -5)
        lab.cam._mover = lab.cam.mover
        kill(lab.cam.mover)

        lab.cam.attach( new OrbitalControllerPod() )
        lab.cam.lookAt = vec3z()

        extend( lab.cam.mover, {

            activate: function(action) {
                this.pushers[action] = 1
                lab.control.activate(action)
            },

            stop: function (action) {
                this.pushers[action] = 0
                lab.control.stop(action)
            },
        })

        env.directionalLightVector = vec3(1, 1, 1)
        env.pointLightPosition = vec3(5, -4, -5)
    }

    return function(args) {
        log('setting up the editing mode...')
        console.dir(args)

        const ctrl = lab.attach( new SpinnerControl({
            name: 'control',
        }) )
        ctrl.screwUp( screwScript )

        /*
        const g = screw( screwScript )
        log('screwed geometry:')
        console.dir(g)

        ctrl.createSpinner(glib)
        */

        setupCameraAndLight()

        // just for spacial reference
        createSomeBoxes()
    }

})()
