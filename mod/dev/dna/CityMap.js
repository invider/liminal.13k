const ZOOM_IN  = 0,
      ZOOM_OUT = 1

class CityMap {

    constructor(st) {
        extend(this, {
            name:    'map',
            ghost:   true,
            zoom:    1,
            zoomFactor: 1.75,
            pushers: [],
        }, st)

        const __ = this
        trap.register('keyDown', (e) => {
            // global control
            switch(e.code) {
                case 'F6':
                    __.toggle()
                    e.preventDefault()
                    break
            }

            if (this.ghost) return
            // map local controls
            switch(e.code) {
                case 'Equal':
                    this.pushers[ZOOM_IN] = 1
                    break
                case 'Minus':
                    this.pushers[ZOOM_OUT] = 1
                    break
            }
        })

        trap.register('keyUp', (e) => {
            if (this.ghost) return
            // map local controls
            switch(e.code) {
                case 'Minus':
                    this.pushers[ZOOM_OUT] = 0
                    break
                case 'Equal':
                    this.pushers[ZOOM_IN] = 0
                    break
            }
        })

        const size = 640
        const rgba = noiseData({
            size,
            x: 9, y: 7, z: 7,
            fq: .01
        })
        const idata = new ImageData(new Uint8ClampedArray(rgba), size, size)
        idata.name = 'noise'
        this.noiseCanvas = imgToCanvas(idata)
    }

    toggle() {
        this.ghost = !this.ghost
        if (this.ghost) lab.hud.show()
        else lab.hud.hide()
    }

    push(action, dt) {
        switch(action) {
            case ZOOM_IN:
                this.zoom *= 1 + this.zoomFactor * dt
                break
            case ZOOM_OUT:
                this.zoom *= 1 - this.zoomFactor * dt
                break
        }
    }

    evo(dt) {
        for (let i = 0; i < this.pushers.length; i++) {
            if (this.pushers[i]) this.push(i, dt)
        }
    }

    drawNoise() {
        ctx.globalAlpha = .5
        const img = this.noiseCanvas
        const bx = hc.width * .5 - img.width * .5,
              by = hc.height * .5 - img.height* .5
        ctx.drawImage(img, bx, by, img.width, img.height)
        ctx.globalAlpha = 1
    }

    drawBlock(e) {
        if (!(e instanceof Terrace)) return
        const mpos = vec3.isub(e.pos, lab.cam.pos)
        const mhsize = vec3.clone(e.hsize)
        vec3.scale(mpos, this.zoom)
        vec3.scale(mhsize, this.zoom)
        mpos[0] += hc.width*.5
        mpos[2] += hc.height*.5
        
        ctx.strokeStyle = '#ffff00'
        ctx.lineWidth = 2
        ctx.strokeRect(
            mpos[0] - mhsize[0],
            mpos[2] - mhsize[2],
            mhsize[0]*2,
            mhsize[2]*2,
        )
    }

    drawHero() {
        ctx.strokeStyle = '#ff0000'

        const r = 15, len = 25
        const bx = hc.width * .5
        const by = hc.height * .5
        const dir = lab.hero.dir

        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(bx, by, r, 0, PI2)
        ctx.stroke()

        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(bx, by)
        // TODO figure out why direction is opposite on the 2D map?
        //      or in 3D as well?
        ctx.lineTo(bx - dir[0] * len, by - dir[2] * len)
        ctx.stroke()
    }

    draw() {
        // render the title
        ctx.fillStyle = '#FF0000'
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'
        ctx.font = "32px monospace"

        let bx = hc.width/2
        let by = hc.height * .1

        ctx.fillText('MegaCity 13 Map', bx, by)

        this.drawNoise()
        for (let e of lab._ls) this.drawBlock(e)
        this.drawHero()
    }
}
