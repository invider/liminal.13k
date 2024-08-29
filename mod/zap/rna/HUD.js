
class HUD {

    init() {
        env.dump = {}
        env.status = ''
        if (debug) {
            env.tag = '=== debug ==='
        }
    }

    draw() {
        if (env.stat) {
            const polygons = env.stat.lastPolygons
            env.dump['Polygons'] = `${polygons} (${polygons * env.fps}/s)`
        }

        ctx.clearRect(0, 0, hcanvas.width, hcanvas.height)

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
            ctx.fillStyle = '#54d9e1'
            ctx.textBaseline = 'top'
            ctx.textAlign = 'center'
            bx = hcanvas.width * .5
            by = 20
            ctx.fillText(env.title, bx, by)
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
    }

}
