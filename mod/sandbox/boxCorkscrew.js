_.boxCorkscrew = (() => {


    function setupCameraAndLight() {
        // === camera and lights ===

        // move camera back a little
        lab.cam.pos = vec3(0, 5, -5)
        lab.cam._mover = lab.cam.mover
        if (lab.cam.mover) kill(lab.cam.mover)

        lab.cam.attach( new OrbitalControllerPod() )
        lab.cam.lookAt = vec3z()

        // expand orbital control for the camera
        extend( lab.cam.mover, {

            activate: function(action) {
                if (this.disabled) return
                this.pushers[action] = 1
                lab.control.activate(action)
            },

            stop: function (action) {
                if (this.disabled) return
                this.pushers[action] = 0
                lab.control.stop(action)
            },

            onMouseDown(e) {
                if (this.disabled) return

                const x = e.clientX - gc.offsetLeft
                const y = e.clientY - gc.offsetTop
                const target = nodePickUp(x, y)
                if (target) {
                    console.dir(target)
                }
            }
        })

        env.directionalLightVector = vec3(1, 1, 1)
        // TODO set some point lights around
    }

    return function(args) {
        log('setting up the editing mode...')

        setupCameraAndLight()
        // just for spacial reference
        createSomeBoxes()

        const ctrl = lab.attach( new SpinnerControl({
            name: 'control',
        }) )

        // create out of official glib
        //ctrl.createSpinner(glib)
        // create out of an unofficial hard-coded screw-up script
        //ctrl.screwUp( screwScript )
        // now load the scripts
        if (args) args.forEach(arg => corkscrew.load(arg + '.up'))
    }

})()
