lab.attach({
    name: 'fader',
    fade: 0,

    roll: function(r) {
        let $ = this
        this.R = r
        switch(r) {
            case 0:
                env.paused = 1
                break
            case 2:
                tw.n($, 'fade', 0, 1, 1, _tw[1], () => {
                    env.paused = 1
                    $.roll(3)
                    //$.redeploy()
                })
                break
            case 3:
                log('score overall')
                log('and press any key')
                break
        }
    },

    evo: function(dt) {
    },

    redraw: function() {
        if (this.fade) {
            let style = '#000000' + (floor(this.fade * 255)).toString(16).padStart(2, '0')
            ctx.fillStyle = style
            ctx.fillRect(0, 0, hc.width, hc.height)
        }
        switch(this.R) {
            case 3:
                ctx.fillStyle = '#e06a10'
                ctx.textBaseline = 'top'
                ctx.font = "28px monospace"

                ctx.textAlign = 'left'
                ctx.fillText(`Data Collected: ${lab.hero.HD}Kb`, 20, 20)

                ctx.textAlign = 'right'
                ctx.fillText(`Data Uploaded: ${lab.hero.DD}Kb`, hc.width-20, 20)

                ctx.fillText(`Press Any Key`, hc.width*.5, hc.height*.5)
                break
        }
    },

    touch: function(e) {
        let $ = this
        switch(this.R) {
            case 3:
                log('scheduling redeploy')
                lab.hero.redeploy()
                env.paused = 0
                tw.n($, 'fade', 1, 0, 1, _tw[1], () => {
                    log('launching')
                })
                this.R = 0
                break
        }
    }
})
