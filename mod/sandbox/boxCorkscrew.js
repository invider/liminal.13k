_screwing = true

_.boxCorkscrew = function() {
    log('Setting up editing mode...')

    lab.attach( new Body({
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

    // move camera back a little
    lab.cam.pos[1] = 0
    lab.cam.pos[2] = 7
    lab.cam._mover = lab.cam.mover
    lab.cam.mover.onMouseDown = (e) => {
        log('empty action')
    }
    kill(lab.cam.mover)

    env.directionalLightVector = vec3(1, 1, 1)

    env.pointLightPosition = vec3(5, -4, -5)
}
