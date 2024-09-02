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
                    mat: {
                        Ka: vec3(.4, .4, .4),
                        Kd: vec3(.1, .1, .15),
                        Ks: vec3(1, 1, 1),
                        Ke: vec3(1, 1, 1),
                        Lv: vec4(.2, .7, .4, 0),
                        Ns: 10,
                    },
                    
                }),
            ],
        }))
    }
}
