
// Runnable Mega-City 13 Block
class Terrace extends Frame {

    constructor(st) {
        super(st)
        this.cellHHeight = 1.5
        this.connections = []
        if (this._connection) {
            this.connections[this._connection.srcDir()] = this._connection
            this._connection.join(this)
        }
        this.shape()

        // custom collidable trait install
        this.collideWithin = collidableTrait.collide
        // custom hitbox install
        this.attach( new SolidBoxPod({
            name:  'porous',
            hsize: this.hsize,
        }))

        /*
        if (debug) {
            this.attach( new Form({
                name: `${this.name}-hitbox-mesh/#debug`,
                pos: this.pos,
                _pods: [ this.hitBoxMesh ],
            }))
            this.detach(this.hitBoxMesh)
        }
        */
    }

    createConnection(cell, pos, dir) {
        //log('connecting ' + dir + ' at ' + pos[0] + ':' + pos[2])
        const shift = CELL_HSIZE,
            dx = dirDX(dir),
            dz = dirDZ(dir)
        pos[0] += shift * dx
        pos[2] += shift * dz
        const cn = this.connections[dir] = new Connection({
            src: this,
            cell, pos, dir,
        })

        // activate the jumppad
        cell.surface.m = mlib.pad
        cell.onTouch = function(runner) {
            if (runner.lastJumpPad === this
                || runner.mt[1] > -10
                || runner.HD < 100) return
            runner.HD -= 100
            runner.lastJumpPad = this
            defer(() => {
                // push - push direction is a bad idea
                const dy = JUMP_PAD_PUSH

                runner.mt[0] += dx
                runner.mt[1] += dy
                runner.mt[2] += dz
            })
        }
    }

    // search free connection
    sf(d) {
        if (d) {
            log(`search deeper ${d} @${this.name}`)
            // select a random linked connection
            const cn = mrnd.elem(this.connections.filter(cn => cn.target))
            if (cn) return cn.target.sf(d - 1)
            else return this.sf(d - 1)
        } 
        log('selecting free @' + this.name)
        // select a free connection
        return mrnd.elem(this.connections.filter(cn => cn.isFree()))
    }

    freeConnectionTowards(dir) {
        const cn = this.connections[dir]
        if (cn) return cn.selfWhenFree()
    }

    shape() {
        let np = vec3.isub(this.pos, this.hsize),
            xp = vec3.iadd(this.pos, this.hsize)

        // create connections
        // x4 for this terrace configuration

        let count = 0
        const gapChance = .2,
              s  = CELL_HSIZE,
              iw = floor(this.hsize[0]/s),
              id = floor(this.hsize[2]/s),
              fw = floor(iw * mrnd()),
              fd = floor(id * mrnd())

        for (let z = np[2], iz = 0; z <= xp[2]-2*s; z += s*2, iz++) {
            for (let x = np[0], ix = 0; x <= xp[0]-2*s; x += s*2, ix++) {
                if (mrnd() < gapChance) continue // got a gap

                // sky block

                // checkerboard pattern
                const colors = [
                    vec4(.2, .2, .2, .9),
                    vec4(.2, .6, .8, .9),
                ]
                const icolor = ((iz % 2) + (ix % 2)) % 2

                const yShift = floor(rnd() * 3)

                let h = this.cellHHeight
                const cell = this.attach( new Form({
                    name: `${this.name}/platform[${ix+1}:${iz+1}]`,
                    pos: vec3(x+s, np[1]+h + yShift, z+s),

                    _pods: [
                        new Surface({
                            geo: glib.cell,
                            m: extend({}, glib.cell.m, { d: colors[icolor] })
                        }),
                        new SolidBoxPod({
                            hsize: glib.cell.bounds, 
                        }),
                    ],
                }))

                // are we at the edge?
                let dir = 0
                if (iz === 0)           dir = 1
                else if (ix === 0)      dir = 2
                else if (iz === id - 1) dir = 3
                else if (ix === iw - 1) dir = 4
                if (dir) {
                    // got the edge and it is not a gap!
                    // TODO check that the cell type is passable and not a gap or a building
                    if (!this.connections[dir]) {
                        //log('got the edge at: ' + ix + ':' + iz + ' -> ' + dir)
                        switch(dir) {
                            case 1: case 3:
                                if (ix >= fw) this.createConnection(cell, vec3.clone(cell.pos), dir)
                                break
                            case 2: case 4:
                                if (iz >= fd) this.createConnection(cell, vec3.clone(cell.pos), dir)
                                break
                        }
                    }
                } else {
                    // tune - floppy seeding level
                    if (snoise(21 + cell.pos[0] * .02, 17 + cell.pos[2] * .02, 14) < .4) {
                         const p = vec3.iadd(cell.pos, vec3(0, 4.2, 0))
                        lab.attach( new Floppy({
                            pos:      p,
                            reactive: 1,
                            c:        100 + floor(mrnd() * 540),
                        }))
                    }
                }
                count ++
            }
        }
    }

    collide(impactor, mv) {
        if (!this.porous.touch(impactor)) return // the impactor is outside the range
        return this.collideWithin(impactor, mv)
    }

    draw() {
        if (vec3.distSq(this.pos, lab.cam.pos) < MAX_VIS_DIST_SQ) {
            super.draw()
        }
    }

    toString() {
        const links = this.connections.filter(cn => cn).map(cn => {
            if (cn.state === LINKED) return '='
            else if (cn.state === BLOCKED) return '+'
            else return '-'
        }).join('')

        let origin = ''
        if (this._connection) {
            origin = '\n * ' + this._connection.toString(1) + ' ' + this._connection.src.toString()
        }

        return `${this.name}[${links}] @${floor(this.pos[0])}:${floor(this.pos[1])}:${floor(this.pos[2])}${origin}`
    }
}
