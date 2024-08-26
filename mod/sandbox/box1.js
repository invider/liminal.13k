_.boxOne = function() {

    log('setup for the box #1')
    log('do some tests here')

    for (let i = 0; i < 20; i++) {
        const B = 100
        const H = B/2
        lab.attach( new Mesh({
            pos: vec3(
                H - B*rnd(),
                H - B*rnd(),
                H - B*rnd()
            ),
            rot: vec3(0, 0, 0),
            scale: vec3(1, 1, 1),
            geo: geo.gen().plane().scale(4 + rnd() * 4).get(),
        }))
    }
}
