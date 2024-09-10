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
    let hero = lab.attach( new Hero({
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

}
