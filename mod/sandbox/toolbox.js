function createSomeBoxes() {
    const g = geo.unscrewOne( screwUp(`neogeo cube 1 scale "toolbox-cuboid" name brew`) )
    console.dir(g)

    for (let i = 0; i < 70; i++) {
        const B = 15
        const V = 120

        const rsign = (rnd() < .5)? -1 : 1
        const s = 4 + rnd() * 4

        // generate unique geometry for this cube
        lab.attach( new Form({
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
                        a: vec4(.4, .4, .4, .2),
                        d: vec4(.1, .1, .15, .7),
                        s: vec4(1, 1, 1, .4),
                        n: 10,
                    },
                    
                }),
            ],
        }))
    }
}
