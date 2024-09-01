class GeoSpinner {

    constructor(st) {
        extend(this, {
            pos:   vec3z(),
            angle: 0,
            r:     12, // maybe dynamic derived from the geo meshes sizes values?
            spin:  .1,
        }, st)
    }

    init() {
        this.geoForm()
    }

    geoForm() {
        const $ = this
        const glib = this.glib
        const gindex = this.gindex = []
        // index glib
        for (let name in glib) {
            log('indexing: ' + name)
            gindex.push(glib[name])
        }
        log('shapes found in geo: ' + gindex.length)

        const shapes = this.shapes = []
        gindex.forEach((g, id) => {
            const shape = $.geoShape(g)
            shape.id = id
            shape.geo = g
            g.shape = shape
            shapes.push(shape)
        })

        this.adjust()
    }

    geoShape(g) {
        return lab.attach( new Body({
            _pods: [
                new Mesh({
                    geo: g,
                    // TODO should come from material library
                    mat: {
                        Ka: vec3(.5, .6, .7),
                        Kd: vec3(.2, .8, .7),
                        Ks: vec3(1, 1, 1),
                        Ke: vec3(1, 1, 1),
                        Lv: vec4(.2, .7, .5, 0),
                        Ns: 21,
                    },
                }),
            ],

            rotSpeed: vec3(-.1, .5, 0),
            evo: function(dt) {
                this.rot[0] += this.rotSpeed[0] * dt
                this.rot[1] += this.rotSpeed[1] * dt 
                this.rot[2] += this.rotSpeed[2] * dt 
            },
        }))
    }

    adjust() {
        const $ = this
        const sector = $.sector = PI2 / ($.shapes.length)
        this.shapes.forEach(shape => {
            const ra = $.angle + shape.id*sector
            const dx = cos(ra) * $.r
            const dy = 0
            const dz = sin(ra) * $.r
            vec3.set(shape.pos, dx, dy, dz)
            vec3.add(shape.pos, $.pos)
        })
    }

    evo(dt) {
        this.angle = (this.angle + this.spin * dt) % PI2
        this.adjust()
    }

}
