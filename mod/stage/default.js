_.defaultStage = () => {
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
        pos:  vec3(-8, 15, 21),
        _pods: [ lab.cam ],
    }))
    //hero.yaw(-PI)
}
