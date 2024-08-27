_.preStage = () => {

    lab.attach( new Camera({
        name: 'cam',

        _pods: [
            new FreeMovementControllerPod(),
            {
                evo: function(dt) {
                    // customized camera behavior
                    const __ = this.__

                    // TODO move out into a node ouside of the /zap folder (debug node)
                    if (debug) {
                        // show some debug stuff
                        const p = __.pos, l = __.lookAt

                        let cx = Math.round(p[0]),
                            cy = Math.round(p[1]),
                            cz = Math.round(p[2])
                        const sPos = `@${cx}:${cy}:${cz}`

                        const pdir = vec3.toSpherical(__.dir)
                        const sDir = ' ^' + Math.round(pdir[1] * RAD_TO_DEG) + '*'
                                          + Math.round(pdir[2] * RAD_TO_DEG) + '*'

                        let sLookAt = ''
                        if (l) {
                            let lx = Math.round(l[0] * 100)/100,
                                ly = Math.round(l[1] * 100)/100,
                                lz = Math.round(l[2] * 100)/100
                            sLookAt = ` => ${lx}:${ly}:${lz}`
                        }

                        env.status = 'cam: ' + sPos + sDir + sLookAt
                    }
                },
            }
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
}
