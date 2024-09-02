function createSomeBoxes() {
    for (let i = 0; i < 70; i++) {
        const B = 15
        const V = 120

        const rsign = (rnd() < .5)? -1 : 1
        const s = 4 + rnd() * 4
        lab.attach( new Body({
            pos: vec3(
                rsign * (B + V*rnd()),
                rsign * (B + V*rnd()),
                rsign * (B + V*rnd())
            ),
            rot: vec3(0, 0, 0),
            scale: vec3(1, 1, 1),

            _pods: [
                new Mesh({
                    geo: screwOne(`gen cube ${s} scale brew`),
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
