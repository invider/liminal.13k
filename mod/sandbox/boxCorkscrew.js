_screwing = true

_.boxCorkscrew = function() {
    log('setting up the editing mode...')

    const g = screw( screwScript )
    log('screwed geometry:')
    console.dir(g)

    // place the geometry lib spinner
    const R = 12
    lab.attach( new GeoSpinner({
        name: 'geoSpinner',
        glib: glib,
        pos:  vec3(0, 0, R),
        r:    R,
    }))

    createSomeBoxes()

    // move camera back a little
    lab.cam.pos = vec3(0, 5, -5)
    lab.cam._mover = lab.cam.mover
    kill(lab.cam.mover)

    lab.cam.attach( new OrbitalControllerPod() )
    lab.cam.lookAt = vec3z()

    env.directionalLightVector = vec3(1, 1, 1)
    env.pointLightPosition = vec3(5, -4, -5)
}

function createSomeBoxes() {
    for (let i = 0; i < 70; i++) {
        const B = 200
        const H = B/2
        lab.attach( new Body({
            pos: vec3(
                H - B*rnd(),
                H - B*rnd(),
                H - B*rnd()
            ),
            rot: vec3(0, 0, 0),
            scale: vec3(1, 1, 1),

            _pods: [
                new Mesh({
                    geo: geo.gen().cube().scale(4 + rnd() * 4).bake(),
                }),
            ],
        }))
    }
}

