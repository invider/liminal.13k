let _trid = 0

const TSIZE = 64
const THEIGHT = 8

class MegaCity {

    constructor() {
        extend(this, {
            name: 'city',
            blocks: [],
        })
    }

    edge(dir, basePos) {
        let edge = 0
        this.blocks.forEach(b => {
            switch(dir) {
                case 1:
                    if (b.pos[2] < edge) edge = b.pos[2] - basePos[2]
                    break
                case 2:
                    if (b.pos[0] < edge) edge = b.pos[0] - basePos[0]
                    break
                case 3:
                    if (b.pos[2] > edge) edge = b.pos[2] - basePos[2]
                    break
                case 4:
                    if (b.pos[0] > edge) edge = b.pos[0] - basePos[0]
            }
        })
        return Math.abs(edge)
    }

    isClaimed(pos, hsize) {
        return this.blocks.filter(b => b.porous.touch(
            new SolidBoxPod({ pos, hsize })
        )).length
    }

    claimBlock(pos, hsize, connection) {
        if (this.isClaimed(pos, hsize)) return

        const b = lab.attach( new Terrace({
            _$: this,
            name: 'terrace' + (++_trid),
            _connection: connection,
            pos, hsize,
        }))
        this.blocks.push(b)
        return b
    }

    // release and garbage collect
    // a previously occupied block
    release(block) {
        // TODO
    }

    zone(cn) {
        const p = vec3.clone(cn.pos)
        const dx = dirDX(cn.dir),
              dz = dirDZ(cn.dir),
              hsize = vec3(TSIZE, THEIGHT, TSIZE)
        p[0] += hsize[0] * dx
        p[1] += 4 - rnd() * 8
        p[2] += hsize[2] * dz

        const block = this.claimBlock(p, hsize, cn)
        if (!block) {
            log(cn.src.name + ': unable to claim the block @' + dumpPS(p, hsize))
        } else {
            log(cn.src.name + ': successfully claimed the block @' + dumpPS(p, hsize))
            cn.join(block)
        }
    }

    establish(connection) {
        log('establishing a connection from ' + connection.src.name)
        this.zone(connection)
    }

    erect(dir) {
        const cnls= this.blocks.map(b => b.freeConnectionTowards(dir)).filter(c => c)
        const cn = cnls[floor(rnd() * cnls.length)]
        if (cn) this.establish(cn)
    }

    init() {
        // our first terrace
        this.blocks.push( lab.attach( new Terrace({
            _$: this,
            name: 'terrace' + (++_trid),
            pos:   vec3(0,  0, 0),
            hsize: vec3(TSIZE, THEIGHT, TSIZE),
        })))

        lab.attach( new Prop({
            name:  'superprop',
            pos:   vec3(0, 3, 0),
            reactive: 1,

            onKill: function() {
                log('consumed')
            }
        }))


        /*
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
        */
    }

    tryToGrow() {
        const wedge = this.edge(W, vec3.clone(lab.hero.pos))
        if (wedge < tune.minEdgeTrigger) {
            log('Not Enough Western Content!!! Go West!')
            this.erect(W)
        }
    }

    evo(dt) {
        this.tryToGrow()
    }
}
