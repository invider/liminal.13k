class MegaCity {

    constructor() {
        extend(this, {
            name: 'city',
            blocks: [],
        })
    }

    isClaimed(pos, hsize) {
        return this.blocks.filter(b => b.porous.touch(
            new SolidBoxPod({ pos, hsize })
        )).length
    }

    claimBlock(pos, hsize) {
        if (this.isClaimed(pos, hsize)) return

        this.blocks.push( lab.attach( new Terrace({
            name: 'terrace1',
            seed:  101,
            pos, hsize,
        })))
    }

    // release and garbage collect
    // a previously occupied block
    release(block) {
        // TODO
    }

    erect(dir) {
        this.blocks.filter(b => b.freeConnector(dir))
    }

    init() {
        // our first terrace
        this.blocks.push( lab.attach( new Terrace({
            name: 'terrace1',
            seed:  101,
            pos:   vec3(0,  0, 0),
            hsize: vec3(64, 4, 64),
        })))

        lab.attach( new Prop({
            name:  'superprop',
            pos:   vec3(0, 3, 0),
            reactive: 1,

            onKill: function() {
                log('consumed')
            }
        }))


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

    evo(dt) {
    }


}
