_.boxOne = function() {

    log('setup for the box #1')
    log('do some tests here')

    for (let i = 0; i < 20; i++) {
        const B = 100
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

            evo: function(dt) {
                this.rot[0] += this.rotSpeed[0] * dt
                this.rot[1] += this.rotSpeed[1] * dt 
                this.rot[2] += this.rotSpeed[2] * dt 
            },
        }))
    }
}
