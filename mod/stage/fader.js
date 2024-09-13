lab.attach({
    name: 'fader',
    fade: 0,

    roll: function(r) {
        let $ = this
        this.R = r
        switch(r) {
            case 2:
                tw.n($, 'fade', 0, 1, 1, _tw[1], () => {
                    env.paused = 1
                    $.roll(3)
                    //$.redeploy()
                })
                break
        }
    },

    redraw: function() {
        if (this.fade) {
            let style = '#000000' + (floor(this.fade * 255)).toString(16).padStart(2, '0')
            ctx.fillStyle = style
            ctx.fillRect(0, 0, hc.width, hc.height)
        }
        switch(this.R) {
            case 3:
                ctx.font = env.fnt
                ctx.fillStyle = env.cl
                ctx.textBaseline = _S[0]
                ctx.textAlign = _S[3]

                let cy = hc.height * .3,
                    cx = hc.width * .5
                ctx.fillText(`Data Run is Over`, cx, cy)
                cy += 50
                ctx.fillText(`Uploaded: ${Math.round(hero.DD/102.4)/10}Mb`, cx, cy)

                cy = hc.height * .7
                if (env.time % 1 > .5) ctx.fillText(`Press Any Key`, hc.width*.5, cy)
                break
        }
    },

    touch: function(e) {
        let $ = this
        switch(this.R) {
            case 3:
                lab.hero.redeploy()
                env.paused = 0
                tw.n($, 'fade', 1, 0, 1, _tw[1], () => {})
                this.R = 0
                break
        }
    }
})
