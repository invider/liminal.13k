// Runnable Mega-City 13 Block
class Terrace extends Frame {

    constructor(st) {
        super(st)
        this.cellHSize = 8
        this.connections = []
        if (this._connection) {
            this.connections[this._connection.srcDir()] = this._connection
        }
        this.geoform() // TODO get geo from the glib
        this.shape()

        // custom collidable trait install
        this.collideWithin = collidableTrait.collide
        // custom hitbox install
        this.attach( new SolidBoxPod({
            name:  'porous',
            hsize: this.hsize,
        }))
    }

    collide(impactor, mv) {
        if (!this.porous.touch(impactor)) return // the impactor is outside the range
        return this.collideWithin(impactor, mv)
    }

    // create geometry
    // TODO must be obtained from the geo library
    geoform() {
        const s =  this.cellHSize, // block half-size
              h = .5
        this._cube = geo.gen().cube()
            .pushv([s, h, s])
            .stretchX()
            .stretchY()
            .stretchZ()
            .bake()
    }

    createConnection(cell, pos, dir) {
        const shift = this.cellHSize * 1.25,
            dx = dirDX(dir),
            dz = dirDZ(dir)
        pos[0] += shift * dx
        pos[2] += shift * dz
        const cn = this.connections[dir] = new Connection({
            src: this,
            cell, pos, dir,
        })
        console.dir(cn)

        const r = 1.5
        const sphereMesh = geo.gen().push(15).precision().sphere().push(r).scale().smooth().bake()
        geo.sharp()

        this.attach( new Body({
            pos: vec3(
                cn.pos[0],
                cn.pos[1],
                cn.pos[2]
            ),

            _pods: [
                new Surface({
                    geo: sphereMesh,
                    mat: {
                        Ka: vec3(1, 0, 0),
                        Kd: vec3(1, 0, 0),
                        Ks: vec3(1, 1, 1),
                        Ke: vec3(1, 1, 1),
                        Lv: vec4(.4, .7, 1, 0),
                        Ns: 20,
                    },
                }),
            ],
        }))
    }

    freeConnectionTowards(dir) {
        return this.connections[dir].selfWhenFree()
    }

    shape() {
        let np = vec3.isub(this.pos, this.hsize),
            xp = vec3.iadd(this.pos, this.hsize)

        // create connections
        // x4 for this terrace configuration

        let count = 0
        const gapChance = .2
        const s = this.cellHSize, // block half-size
              iw = floor(this.hsize[0]/s),
              id = floor(this.hsize[2]/s)
        for (let z = np[2], iz = 0; z < xp[2]; z += s*2, iz++) {
            for (let x = np[0], ix = 0; x < xp[0]; x += s*2, ix++) {
                if (rnd() < gapChance) continue // got a gap

                // sky block

                // checkboard pattern
                const colors = [
                    vec3(.2, .2, .2),
                    vec3(.2, .6, .8),
                ]
                const icolor = ((iz % 2) + (ix % 2)) % 2

                const yShift = floor(rnd() * 4)

                let h = .5
                const cell = this.attach( new Body({
                    pos: vec3(x+s, np[1]+h + yShift, z+s),

                    _pods: [
                        new Surface({
                            geo: this._cube,
                            /*
                            geo: geo.gen().cube()
                                .stretch(0, s)
                                .stretch(1, h)
                                .stretch(2, s)
                                .bake(),
                            */
                            mat: {
                                Ka: vec3(.5, .6, .7),
                                Kd: colors[icolor],
                                Ks: vec3(1, 1, 1),
                                Ke: vec3(1, 1, 1),
                                Lv: vec4(.2, .5, .8, 0),
                                Ns: 20,
                            },
                        }),
                        new SolidBoxPod({
                            hsize: vec3(s, h, s), 
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
                                if (ix > iw/3) this.createConnection(cell, vec3.clone(cell.pos), dir)
                                break
                            case 2: case 4:
                                if (iz > id/3) this.createConnection(cell, vec3.clone(cell.pos), dir)
                                break
                        }
                    }
                }

                count ++
            }
        }

        log('terrace generated: ' + count + ' cells')
    }

}
