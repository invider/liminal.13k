
class HUD {

    draw() {
        ctx.clearRect(0, 0, hcanvas.width, hcanvas.height)

        ctx.fillStyle = '#e06a10'
        ctx.textBaseline = 'top'
        ctx.textAlign = 'left'
        ctx.font = "24px monospace"

        env.dump.polygons += ` (${env.dump.polygons * env.fps}/s)`

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

        if (env.status) {
            ctx.textBaseline = 'bottom'
            ctx.textAlign = 'left'
            by = hcanvas.height - 20
            ctx.fillText(env.status, bx, by)
        }

        if (env.tag) {
            bx = hcanvas.width - 20
            ctx.textAlign = 'right'
            ctx.fillText(env.tag, bx, by)
        }
    }

}
