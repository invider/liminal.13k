// Runnable Mega-City 13 Block
class Terrace extends Frame {

    constructor(st) {
        super(st)
        this.cellHHeight = 1.5
        this.connections = []
        if (this._c) {
            this.connections[this._c.srcDir()] = this._c
            this._c.join(this)
            /*
            // activate next light source
            let p = this.plg = vec3.iadd(this.pos, vec3(0, 20, 0)) // point light source
            _ilt ++
            if (_ilt >= env.pl.length/4) _ilt = 0
            let j = _ilt * 3
            env.pl[j++] = p[0]
            env.pl[j++] = p[1]
            env.pl[j  ] = p[2]

            j = _ilt * 4
            env.pc[j++] =  1
            env.pc[j++] = .8
            env.pc[j++] =  1
            env.pc[j  ] =  1
            */
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

    createConnection(cell, pos, dir, j, e) {
        //log('connecting ' + dir + ' at ' + pos[0] + ':' + pos[2])
        const shift = CELL_HSIZE,
            dx = dirDX(dir),
            dz = dirDZ(dir)
        pos[0] += shift * dx
        pos[2] += shift * dz
        const cn = this.connections[dir] = new Connection({
                src: this,
                _j:  1,
                cell, pos, dir,
        })
        if (!j) return

        // activate the jumppad
        cell.m = mlib.blk
        cell.d = 720 * e
        cn._j = 1.2

        cell.evo = function() {
            if (lab.hero.HD < this.d) this.surface.m = mlib.blk
            else this.surface.m = mlib.pad
        }
        cell.onTouch = function(runner) {
            if (runner.lastJumpPad === this
                    || runner.mt[1] > -10
                    || runner.pos[1] < this.pos[1]
                    || runner.HD < this.d) return
            runner.lastJumpPad = runner.lastPad = this
            this.surface.m = mlib.bak
            this.onTouch = null
            this.zombie = true

            defer(() => {
                // push - push direction is a bad idea
                const dy = 45 // tune - jumpPad push
                _up[1][0] += this.d
                _hi(`Uploading ${this.d}Kb...`, 3)
                //runner.HD -= this.d
                //fx.up(1 + this.d/250)

                runner.mt[0] += dx
                runner.mt[1] += dy
                runner.mt[2] += dz
            })
        }
    }

    // search free connection
    sf(d) {
        if (d) {
            // select a random linked connection
            const cn = mrnd.elem(this.connections.filter(cn => cn.target))
            if (cn) return cn.target.sf(d - 1)
            else return this.sf(d - 1)
        } 
        // select a free connection
        return mrnd.elem(this.connections.filter(cn => cn.isFree()))
    }

    /*
    // free connections towards
    fct(dir) {
        const cn = this.connections[dir]
        if (cn) return cn.selfWhenFree()
    }
    */

    shape() {
        let np = vec3.isub(this.pos, this.hsize),
            xp = vec3.iadd(this.pos, this.hsize)

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
                    ],
                    icolor = ((iz % 2) + (ix % 2)) % 2,
                    yShift = floor(rnd() * 3)

                let h = this.cellHHeight,
                    pos = vec3(x+s, np[1]+h + yShift, z+s),
                    dir = 0, p
                // are we at the edge?
                if (iz === 0)           dir = 1
                else if (ix === 0)      dir = 2
                else if (iz === id - 1) dir = 3
                else if (ix === iw - 1) dir = 4
                if (dir) {
                    // got the edge and it is not a gap!
                    // TODO check that the cell type is passable and not a gap or a building
                    if (!this.connections[dir]) {
                        switch(dir) {
                            case 1: case 3:
                                if (ix < fw) dir = 0 // too early to create connection
                                break
                            case 2: case 4:
                                if (iz < fd) dir = 0 // it's too early
                                break
                        }
                    } else dir = 0
                } else {
                    // tune - floppy seeding level
                    const e = dst(pos, 7, .1, 18, 1)
                    if (e < 9) {
                        p = vec3.iadd(pos, vec3(0, 4.2, 0))
                        lab.attach( new Floppy({
                            pos:      p,
                            reactive: 1,
                            c:        360 * (floor(mrnd() * 4) + 1),
                        }))
                        if (this._c) {
                            let w = p[1] - 100
                            tw.n(p, 1, w, p[1], 5 * rnd() * 2, _tw[1])
                            p[1] = w
                        }
                    }
                }

                let e = dst(pos, 7, .1, 4, 10),  // jumppad field
                    j = dir && (e >= 2)? 1 : 0   // jumppad flag
                const cell = this.attach( new Form({
                    // DEBUG name
                    //name: `${this.name}/platform[${ix+1}:${iz+1}]`,
                    pos,
                    _pods: [
                        new Surface({
                            geo: j? glib.pad : glib.cell,
                            m: j? mlib.blk : extend({}, glib.cell.m, { d: colors[icolor] })
                        }),
                        new SolidBoxPod({
                            hsize: j? glib.pad.bounds : glib.cell.bounds, 
                        }),
                    ],
                }))
                if (dir) this.createConnection(cell, vec3.clone(cell.pos), dir, j, e)
                // animate
                if (this._c) {
                    let w = pos[1] - 100
                    tw.n(pos, 1, w, pos[1], 5 * rnd() * 2, _tw[1])
                    //tw.inc({ e: pos, p: 1,
                    //    v1: w,
                    //    v2: pos[1],
                    //    t: 5 + rnd() * 2, f: _tw[1]
                    //})
                    pos[1] = w
                }
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

    /*
    toString() {
        const links = this.connections.filter(cn => cn).map(cn => {
            if (cn.state === LINKED) return '='
            else if (cn.state === BLOCKED) return '+'
            else return '-'
        }).join('')

        let origin = ''
        if (this._c) {
            origin = '\n * ' + this._c.toString(1) + ' ' + this._c.src.toString()
        }

        return `${this.name}[${links}] @${floor(this.pos[0])}:${floor(this.pos[1])}:${floor(this.pos[2])}${origin}`
    }
    */
}
