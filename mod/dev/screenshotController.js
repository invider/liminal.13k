function zapScreenshotController() {
    if (env.started) return

    const screenshotController = lab.attach({
        name: 'screenshotController',

        gifDelay:   .075,
        gifTimer:   0,
        frameTimer: 0,

        scheduleScreenshot() {
            this.screenshot = true
        },

        scheduleGif() {
            this.gif = new GIF({
                workers: 4,
                quality: 10
            })
            this.gif.on('finished', function(blob) {
                window.open(URL.createObjectURL(blob));
            });
            this.capturingGif = true
        },

        captureGif() {
            log(`captured GIF for ${this.gifTimer} seconds`)

            this.gif.render()

            this.gifTimer = 0
            this.capturingGif = false
        },

        evo(dt) {
            // make sure we are the last in the evolution line
            const i = lab._ls.indexOf(this)
            if (i < lab._ls.length - 1) this.dead = true // reattach itself

            if (this.capturingGif) {
                this.gifTimer += dt
                this.frameTimer -= dt
            }
        },

        draw() {
            if (this.screenshot) {
                gc.toBlob((blob) => {
                    img.downloadBlob(blob, 'zap')
                })
                this.screenshot = false
            }

            if (this.capturingGif) {

                if (this.frameTimer < 0) {
                    this.gif.addFrame(gc, { copy: true, delay: this.gifDelay * 1000 });
                    this.frameTimer = this.gifDelay
                }

            }
        },

        onKill() {
            const e = this
            defer(() => {
                e.dead = false
                lab.attach(e)
            })
        }
    })

    // make a screenshot on F8
    trap.register('keyDown', (e) => {
        switch(e.code) {
            case 'F8':
                screenshotController.scheduleScreenshot()
                e.preventDefault()
                break
            case 'F9':
                if (window.location.protocol === 'file:') {
                    console.warn("Can't capture a gif locally - run from a server!")
                    return
                }
                screenshotController.scheduleGif()
                e.preventDefault()
                break
        }
    })

    trap.register('keyUp', (e) => {
        switch(e.code) {
            case 'F9':
                if (!screenshotController.capturingGif) return
                // finalize the gif capture
                screenshotController.captureGif()
                break
        }
    })
}
