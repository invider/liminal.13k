_.boxCubesUV = function() {
    // sample boxes
    _gUV = 1   // enable texture mapping
    let h = 2

    lab.attach( new Body({
        name: 'cuboid',
        pos: vec3(-8, 2, -4),
        rot: vec3(0, 0, 0),
        scale: vec3(1, 1, 1),

        _pods: [
            new Surface({
                geo: geo.gen().cube().push(h).scale().bake(),
                mat: {
                    Ka: vec3(.5, .6, .7),
                    Kd: vec3(.1, .8, .9),
                    Ks: vec3(1, 1, 1),
                    Ke: vec3(1, 1, 1),
                    Lv: vec4(.2, .5, .8, 0),
                    Ns: 50,
                },
                tex: _.tex['simple']
            }),
            new SolidBoxPod({
                hsize: vec3(h, h, h), 
            }),
        ],
    }))

    lab.attach( new Body({
        name: 'cuboid2',
        pos: vec3(12, 5, -4),
        rot: vec3(0, 0, 0),
        scale: vec3(1, 1, 1),

        _pods: [
            new Surface({
                geo: geo.gen().cube().push(h).scale().bake(),
                mat: {
                    Ka: vec3(.5, .6, .7),
                    Kd: vec3(.1, .8, .9),
                    Ks: vec3(1, 1, 1),
                    Ke: vec3(1, 1, 1),
                    Lv: vec4(.2, .5, .8, 0),
                    Ns: 50,
                },
                tex: _.tex['noise']
            }),
            new SolidBoxPod({
                hsize: vec3(h, h, h), 
            }),
        ],
    }))
    _gUV = 0
}