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
