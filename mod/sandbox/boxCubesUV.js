_.boxCubesUV = function() {
    // sample boxes
    _gUV = 1   // enable texture mapping
    let h = 2

    lab.attach( new Form({
        name: 'cuboid',
        pos: vec3(-8, 2, -4),
        rot: vec3(0, 0, 0),
        scale: vec3(1, 1, 1),

        _pods: [
            new Surface({
                geo: geo.gen().cube().push(h).scale().bake(),
                m: {
                    a: vec3(.5, .6, .7),
                    d: vec3(.1, .8, .9),
                    s: vec3(1, 1, 1),
                    i: vec4(.2, .5, .8, 0),
                    n: 50,
                },
                tex: _.tex['simple']
            }),
            new SolidBoxPod({
                hsize: vec3(h, h, h), 
            }),
        ],
    }))

    lab.attach( new Form({
        name: 'cuboid2',
        pos: vec3(12, 5, -4),
        rot: vec3(0, 0, 0),
        scale: vec3(1, 1, 1),

        _pods: [
            new Surface({
                geo: geo.gen().cube().push(h).scale().bake(),
                m: {
                    a: vec3(.5, .6, .7),
                    d: vec3(.1, .8, .9),
                    s: vec3(1, 1, 1),
                    i: vec4(.2, .5, .8, 0),
                    n: 50,
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
