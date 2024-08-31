_screwing = true

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


_.boxCorkscrew = function() {
    log('Setting up editing mode...')

    const box = lab.attach( new Body({
        pos: vec3(
            0,
            0,
            0
        ),
        rot: vec3(0, 0, 0),
        scale: vec3(1, 1, 1),

        _pods: [
            new Mesh({
                geo: geo.gen().cube().scale(1).bake(),
            }),
        ],

        rotSpeed: vec3(-.1, .5, 0),
        evo: function(dt) {
            this.rot[0] += this.rotSpeed[0] * dt
            this.rot[1] += this.rotSpeed[1] * dt 
            this.rot[2] += this.rotSpeed[2] * dt 
        },

    }))

    createSomeBoxes()

    // move camera back a little
    lab.cam.pos[1] = 0
    lab.cam.pos[2] = 7
    lab.cam._mover = lab.cam.mover
    lab.cam.mover.onMouseDown = (e) => {
        log('empty action')
    }
    kill(lab.cam.mover)

    lab.cam.attach( new OrbitalControllerPod() )
    lab.cam.lookAt = box.pos

    env.directionalLightVector = vec3(1, 1, 1)
    env.pointLightPosition = vec3(5, -4, -5)
}
