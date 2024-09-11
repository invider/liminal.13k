let _trid = 0

const BASE_BLOCK_SIZE = 1,
      VAR_BLOCK_SIZE = 7,
      CELL_HSIZE = 8,
      TSIZE = 32,
      THEIGHT = 8

const mrnd = LNGSource(7)

class MegaCity {

    constructor() {
        extend(this, {
            name: 'city',
            blocks: [],
            lastGenesis: 0,
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
        log(`[!] NEW ${b.toString()}`)
        return b
    }

    // release and garbage collect
    // a previously occupied block
    release(block) {
        // TODO
    }

    // zoning for the specified connection
    zone(cn) {
        const p = vec3.clone(cn.pos)
        const dx = dirDX(cn.dir),
              dz = dirDZ(cn.dir),
              bw = (BASE_BLOCK_SIZE + floor(mrnd() * VAR_BLOCK_SIZE)) * CELL_HSIZE,
              bd = (BASE_BLOCK_SIZE + floor(mrnd() * VAR_BLOCK_SIZE)) * CELL_HSIZE,
              hsize = vec3(bw, THEIGHT + floor(mrnd() * 4), bd)
        const gap = floor(mrnd()*12) * CELL_HSIZE/2
        p[0] += (gap + hsize[0]) * dx
        p[1] += hsize[1] + floor(mrnd() * 5 - 2)
        p[2] += (gap + hsize[2]) * dz

        const block = this.claimBlock(p, hsize, cn)
        if (!block) {
            // log(cn.src.name + ': unable to claim the block @' + dumpPS(p, hsize))
        } else {
            // log(cn.src.name + ': successfully claimed the block @' + dumpPS(p, hsize))
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
        const t = lab.attach( new Terrace({
            _$: this,
            name: 'terrace' + (++_trid),
            pos:   vec3(0,  0, 0),
            hsize: vec3(TSIZE, THEIGHT, TSIZE),
        }))
        this.blocks.push(t)
        //this.edges = [t, t, t, t, t]
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
        let cn = lab.hero.lastPlatform.__.sf(1 + floor(mrnd() * 9))
        if (cn) return this.zone(cn)
        // we prefer to build westward
        //if (!this.edgeGenesis(W)) if (!this.edgeGenesis(N)) this.edgeGenesis(S)
    }

    evo(dt) {
        if (env.time - this.lastGenesis > 1) {
            this.genesisBomb()
            this.lastGenesis = env.time
        }
    }
}
