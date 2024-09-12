let _trid = 0

const BASE_BLOCK_SIZE = 1,
      VAR_BLOCK_SIZE = 15,
      CELL_HSIZE = 8,
      TSIZE = 32,
      BHEIGHT = 8

const mrnd = LNGSource(7)

function dst(v, s, f, q) {
    return floor(((snoise(v[0]*f, v[1]*f, (v[2]+s)*f) * 10) % 1)* q)
}

class MegaCity {

    constructor() {
        extend(this, {
            name: 'city',
            blocks: [],
            lG: 0,
        })
    }

    /*
    // search for the city edge in the provided direction as related to the hero
    edge(dir, basePos) {
        let edge = 0, edges = this.edges, e
        this.blocks.forEach(b => {
            switch(dir) {
                case N:
                    e = b.pos[2] - basePos[2]
                    if (e < edge) {
                        edge = e
                        edges[N] = b
                    }
                    break
                case W:
                    e = b.pos[0] - basePos[0]
                    if (e < edge) {
                        edge = e
                        edges[W] = b
                    }
                    break
                case S:
                    e = b.pos[2] - basePos[2]
                    if (e > edge) {
                        edge = e
                        edges[S] = b
                    }
                    break
                case E:
                    e = b.pos[0] - basePos[0]
                    if (e > edge) {
                        edge = e
                        edges[E] = b
                    }
            }
        })
        return Math.abs(edge)
    }
    */

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
        //log(`[!] NEW ${b.toString()}`)
        log(`[!] NEW ${b.name}`)
        return b
    }

    // release and garbage collect
    // a previously occupied block
    release(block) {
        // TODO
    }

    // zoning for the specified connection
    zone(cn) {
        let q = [], d = dat.nfq
        for (let i = 0; i < 18; i += 3) {
            q.push( dst(cn.pos, d[i], d[i+1], d[i+2]) )
        }

        const p = vec3.clone(cn.pos),
              dx = dirDX(cn.dir),
              dz = dirDZ(cn.dir),
              bw = (BASE_BLOCK_SIZE + q[0]) * CELL_HSIZE,
              bd = (BASE_BLOCK_SIZE + q[1]) * CELL_HSIZE,
              hsize = vec3(bw, BHEIGHT + q[2], bd),
              gap = q[3] * CELL_HSIZE/2
        p[0] += (gap + hsize[0]) * dx
        p[1] += hsize[1] + q[4] - 2
        p[2] += (gap + hsize[2]) * dz

        log(`density @[${cn.pos[0]}:${cn.pos[1]}:${cn.pos[2]}]:`)
        log(` * size: ${1 + q[0]}:${1 + q[1]}:${BHEIGHT + q[2]}`)
        log(` * gap: ${gap}, shift:${q[4] - 2}`)

        const block = this.claimBlock(p, hsize, cn)
        if (!block) {
            cn.state = 2 // BLOCKED
            log(cn.src.name + ': unable to claim the block @' + dumpPS(p, hsize))
        } else {
            log(cn.src.name + ': successfully claimed the block @' + dumpPS(p, hsize))
            return block
        }
    }

    /*
    // TODO not in particular direction, but select links in the region of interest (like westward)
    //      and grow somewhere in that area
    erect(dir) {
        const cnls= this.blocks.map(b => b.freeConnectionTowards(dir)).filter(c => c)
        // select a random link to expand to
        const cn = cnls[floor(mrnd() * cnls.length)]
        if (cn) return this.establish(cn)
    }
    */

    init() {
        // our first terrace
        let t = lab.attach( new Terrace({
            _$: this,
            pos:   vec3(0,  0, 0),
            hsize: vec3(TSIZE, BHEIGHT, TSIZE),
        }))
        this.blocks.push(t)
        this.T = t._ls[0]
    }

    /*
    edgeGenesis(dir) {
        const edge = this.edge(dir, vec3.clone(lab.hero.pos))
        if (edge < MIN_EDGE_TRIGGER) {
            // log('Genesis to ' + dir + ': -> ' + edge)
            const edgeBlock = this.edges[dir]

            // TODO do with fandom steps
            const cn = edgeBlock.sf(4 + floor(mrnd() * 8))
            if (cn) return this.zone(cn)
        }
    }
    */

    genesisBomb() {
        let p = lab.hero.lastPlatform || this.T,
            cn = p.__.sf(1 + floor(rnd() * 9))
        if (cn) return this.zone(cn)
    }

    evo(dt) {
        if (env.time - this.lG > 1) {
            this.genesisBomb()
            this.lG = env.time
        }
    }
}
