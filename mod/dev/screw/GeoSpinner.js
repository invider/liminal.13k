class GeoSpinner {

    constructor(st) {
        extend(this, {
            pos:   vec3z(),
            angle: 0,
            r:     12, // maybe dynamic derived from the geo meshes sizes values?

            target:      0,
            spin:        1,
            spinSpeed:   .4*PI,

            shapeStats: {
                spinSpeed: PI,
            }
        }, st)
    }

    init() {
        this.geoForm()

        const $ = this
        trap.register('keyDown', (e) => {
            switch(e.code) {
                case 'KeyZ':
                    $.targetPrev()
                    break
                case 'KeyX':
                    $.targetNext()
                    break
            }
        })
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
        gindex.forEach((g) => {
            const shape = $.geoShape(g)
            shape.geo = g
            g.shape = shape
            shapes.push(shape)
        })

        this.adjust()
    }

    geoShape(g) {
        return lab.attach( new Body({
            angle:       0,
            targetAngle: 0,
            spin:        1,
            stats:       this.shapeStats,

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

            setTargetAngle: function(ta) {
                this.targetAngle = ta
                /*
                // getermine the shortest spin ???
                const da = ta - this.angle
                const rd = da > 0? da : da + PI2
                const ld = da < 0? abs(da) : this.angle + PI2-ta

                if (rd < .5 || ld < .4) return
                if (rd < ld) this.spin = -1
                else this.spin = 1
                */
            },

            evoToTargetAngle: function(dt) {
                const ta = this.targetAngle
                if (this.angle === ta) return

                // adjust to the target angle
                const _angle = this.angle
                this.angle = normalAngle(this.angle + this.spin * this.stats.spinSpeed * dt)

                // fit the target
                if (this.spin > 0) {
                    if (_angle <= ta && this.angle >= ta) this.angle = ta
                } else {
                    if (_angle >= ta && this.angle <= ta) this.angle = ta
                }
            },

            evo: function(dt) {
                // rotate the shape
                this.rot[0] += this.rotSpeed[0] * dt
                this.rot[1] += this.rotSpeed[1] * dt 
                this.rot[2] += this.rotSpeed[2] * dt 

                this.evoToTargetAngle(dt)
            },
        }))
    }

    adjust() {
        const $ = this
        const sector = $.sector = PI2 / ($.shapes.length)
        this.shapes.forEach(shape => {
            const id = $.shapes.indexOf(shape)
            shape.setTargetAngle( normalAngle(-id*sector) )
        })
    }

    targetAngle() {
        const sector = this.sector = PI2 / (this.shapes.length)
        return normalAngle(this.target*sector - PI/2)
    }

    targetNext() {
        this.spin = 1
        this.target ++
        if (this.target >= this.shapes.length) this.target = 0
    }

    targetPrev() {
        this.spin = -1
        this.target --
        if (this.target < 0) this.target = this.shapes.length - 1
    }

    evoShapes(dt) {
        const $ = this
        this.shapes.forEach(shape => {
            const ra = shape.angle + $.angle
            const dx = cos(ra) * $.r
            const dy = 0
            const dz = sin(ra) * $.r
            vec3.set(shape.pos, dx, dy, dz)
            vec3.add(shape.pos, $.pos)
        })
    }

    evoSpin(dt) {
        // turn the geo spinner to target
        const ta = this.targetAngle()
        env.dump['Target Angle'] = Math.round(ta * RAD_TO_DEG) + ' - ' + Math.round(ta * 100)/100
        if (this.angle === ta) return

        const _angle = this.angle
        this.angle = normalAngle(this.angle + this.spin * this.spinSpeed * dt)

        // fit the target
        if (this.spin > 0) {
            if (_angle <= ta && this.angle >= ta) this.angle = ta
        } else {
            if (_angle >= ta && this.angle <= ta) this.angle = ta
        }
    }

    evo(dt) {
        this.adjust()
        this.evoShapes(dt)
        this.evoSpin(dt)
    }
}
