
class HUD {

    constructor(st) {
        extend(this, {
            name: 'hud',
        }, st)
    }

    init() {
        env.status = ''

        const __ = this
        trap.register('keyDown', (e) => {
            switch(e.code) {
                case 'F10':
                    __.toggle()
                    e.preventDefault()
                    break
            }
        })
    }

    toggle() {
        this.ghost = !this.ghost
    }

    hide() {
        this.ghost = true
    }

    show() {
        this.ghost = false
    }

    draw() {
        ctx.fillStyle = '#e06a10'
        ctx.textBaseline = 'top'
        ctx.textAlign = 'left'
        ctx.font = "24px monospace"

        let bx = 20
        let by = 20
        ctx.fillText(`FPS: ${env.fps}`, bx, by)
        by += 30
        ctx.fillText(`Time: ${env.time << 0}`, bx, by)
        if (env.dump) {
            Object.keys(env.dump).forEach(name => {
                const line = env.dump[name]
                by += 30
                ctx.fillText(name + ': ' + line, bx, by)
            })
        }

        if (env.title) {
            const lines = env.title.split('\n')
            ctx.fillStyle = '#54d9e1'
            ctx.textBaseline = 'top'
            ctx.textAlign = 'center'
            bx = hcanvas.width * .5
            by = 20
            lines.forEach(line => {
                ctx.fillText(line, bx, by)
                by += 40
            })
        }

        if (env.status) {
            ctx.fillStyle = '#e06a10'
            ctx.textBaseline = 'bottom'
            ctx.textAlign = 'left'
            bx = 20
            by = hcanvas.height - 20
            ctx.fillText(env.status, bx, by)
        }

        if (env.tag) {
            ctx.fillStyle = '#cc422d'
            bx = hcanvas.width - 20
            ctx.textAlign = 'right'
            ctx.fillText(env.tag, bx, by)
        }

        if (env.banner && (env.time*.75) % 1 < .5) {
            ctx.font = "32px monospace"
            ctx.fillStyle = '#54d9e1'
            ctx.textBaseline = 'middle'
            ctx.textAlign = 'center'
            bx = hcanvas.width * .5
            by = hcanvas.height * .75
            ctx.fillText(env.banner, bx, by)
        }
    }

}
