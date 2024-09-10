class SpinnerControl {

    constructor(st) {
        extend(this, {
            shading: true,
            wireframes: false,
            pos: vec3z(),
            spinners: [],
            pushers:  [],
        }, st)
    }

    init() {
        const $ = this
        trap.register('keyDown', (e) => {
            if ($.disabled || env.disabled) return

            switch(e.code) {
                case 'PageUp': case 'KeyZ':
                    $.active.targetPrev()
                    break
                case 'PageDown': case 'KeyX':
                    $.active.targetNext()
                    break
                case 'Backslash':
                    this.switchWireframes()
                    this.switchShading()
                    break
            }
        })
    }

    downgradeSpinners() {
        this.spinners.forEach(spinner => {
            spinner.anchor = vec3(
                spinner.pos[0],
                spinner.pos[1] - spinner.r * 1.5,
                spinner.pos[2] + spinner.r * 1.5,
            )
        })
    }

    switchWireframes() {
        this.wireframes = !this.wireframes
        this.spinners.forEach(spinner => spinner.wireframes(this.wireframes))
    }

    switchShading() {
        this.shading = !this.shading
        this.spinners.forEach(spinner => spinner.shading(this.shading))
    }

    createSpinner(g) {
        this.downgradeSpinners()

        let gindex, glib
        if (Array.isArray(g)) gindex = g
        else glib = g

        // place the geometry lib spinner
        const R = 12
        const spinner = lab.attach( new GeoSpinner({
            name:    'geoSpinner',
            glib:    glib,
            gindex:  gindex,
            pos:     vec3(0, 0, R),
            r:       R,
        }))
        this.spinners.push(spinner)
        this.active = spinner
    }

    screwUp( script ) {
        const enops = screwUp(script)
        const brews = geo( enops )
        brews.screw = script
        log(`enops:[${enops}]`)
        log('screwed geometry:')
        console.dir(brews)

        this.createSpinner(brews)
    }

    activeScript() {
        if (!this.active) return 'NO ACTIVE SPINNER'
        return this.active.getScript()
    }

    push(action, factor, dt) {
        if (!this.active) return
        const __ = this.active

        switch(action) {
            case LOOK_LEFT:
                break
            case LOOK_RIGHT:
                break
            case LOOK_UP:
                __.scale(factor)
                break
            case LOOK_DOWN:
                __.scale(-factor)
                break
            case ROLL_LEFT:
                break
            case ROLL_RIGHT:
                break
        }
    }

    evo(dt) {
        // activate pushers
        for (let i = 0; i < this.pushers.length; i++) {
            const f = this.pushers[i]
            if (f) {
                this.push(i, f, dt)
                if (i > 20) this.pushers[i] = 0 // reset the mouse movement accumulation buffers
            }
        }
    }

    activate(action) {
        if (this.disabled) return
        this.pushers[action] = 1
    }

    stop(action) {
        if (this.disabled) return
        this.pushers[action] = 0
    }
}
