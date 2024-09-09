function createSomeBoxes() {
    const g = geo.unscrewOne( screwUp(`neogeo cube 1 scale "cuboid" name brew`) )
    console.dir(g)

    for (let i = 0; i < 70; i++) {
        const B = 15
        const V = 120

        const rsign = (rnd() < .5)? -1 : 1
        const s = 4 + rnd() * 4

        // generate unique geometry for this cube
        lab.attach( new Body({
            pos: vec3(
                rsign * (B + V*rnd()),
                rsign * (B + V*rnd()),
                rsign * (B + V*rnd())
            ),
            rot: vec3(0, 0, 0),
            scale: vec3(s, s, s),

            _pods: [
                new Surface({
                    geo: g,
                    m: {
                        a: vec3(.4, .4, .4),
                        d: vec3(.1, .1, .15),
                        s: vec3(1, 1, 1),
                        i: vec4(.2, .7, .4, 0),
                        n: 10,
                    },
                    
                }),
            ],
        }))
    }
}
