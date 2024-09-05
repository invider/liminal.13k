_.defaultStage = () => {
    if (debug) log('setting up the MegaCity 13')

    // introduce collision detection to the lab nodes
    extend(lab, collidableTrait)

    lab.attach( new MegaCity() )

    lab.freeCam = lab.cam
    // create hero cam
    lab.attach( new Camera({
        name: 'cam',
    }))

    // the hero time!
    hero = lab.attach( new Hero({
        name: 'hero',
        type: 'superhero',
        pos:  vec3(0, 10, 5),
        _pods: [ lab.cam ],
    }))
    hero.yaw(-PI*.5)

    trap.register('terminalFall', () => {
        // handle hero death
        hero.reset()
    })

    if (debug) {
        lab.attach( _.playerStateDump )
        lab.attach( new CityMap() )

        trap.register('keyDown', (e) => {
            if (e.code === 'F1') {
                if (lab.cam === lab.hero.cam) {
                    lab.cam = lab.freeCam
                    vec3.copy(lab.cam.pos, lab.hero.pos)
                    lab.cam.pos[1] += 20
                    lab.cam.mover.capture()
                } else {
                    lab.cam = lab.hero.cam
                    lab.hero.mover.capture()
                }
                e.preventDefault()
            }
        })
    }
}
