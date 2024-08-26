const img = {

    // download a data url by creating a hyperlink and clicking it
    downloadBlob: function(blob, name, ext) {
        if (!name) name = 'zap'
        if (!ext) ext = 'png'
        const dataURL = window.URL.createObjectURL(blob);

        let a  = document.createElement('a');
        a.href = dataURL;
        a.download = name + '.' + ext
        a.click()
    },

    // TODO refactor out
    screenshot: function(filename) {
        env._screenshot = true

        //if (!filename) filename = 'zap'
        /*
        const pixels = new Uint8Array(
            gl.drawingBufferWidth * gl.drawingBufferHeight * 4,
        )
        gl.readPixels(
              0,
              0,
              gl.drawingBufferWidth,
              gl.drawingBufferHeight,
              gl.RGBA,
              gl.UNSIGNED_BYTE,
              pixels,
        );
        console.log(pixels) // Uint8Array
        ctx.createImageData(gl.drawingBufferWidth, gl.drawingBufferHeight)
        */

        // open in a new tab
        // window.open(gcanvas.toDataURL('image/png'));
        //let dataURL = hcanvas.toDataURL('image/png');
        //this.downloadDataURL(dataURL, filename)
    },

    /*
    // make a screenshot of a screen area
    screenshotArea: function(filename, x, y, w, h) {
        if (!filename) filename = 'zap'
        const idata = gl.getImageData(x, y, w, h)
        const dataURL= this.imgToDataURL(idata)

        this.downloadDataURL(dataURL, filename)
    },
    */


    // convert image to a canvas with the same size and image content
    imgToCanvas: function(img) {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = img.width
        canvas.height = img.height

        if (img instanceof ImageData) {
            context.putImageData(img, 0, 0)
        } else {
            context.drawImage(img, 0, 0, img.width, img.height)
        }
        return canvas
    },

    // convert image to a data url
    imgToDataURL: function(img, type) {
        if (!type) type = 'image/png'
        return this.imgToCanvas(img).toDataURL(type)
    },

    // get image data from a provided image
    imgData: function(img) {
        const canvas = this.imgToCanvas(img)
        const context = canvas.getContext('2d')
        return context.getImageData(0, 0, img.width, img.height)
    },
}

trap.register('start', () => {
    if (env.started) return

    const screenshotController = lab.attach({
        name: 'screenshotController',

        gifDelay:   .15,
        gifTimer:   0,
        frameTimer: 0,

        scheduleScreenshot() {
            this.screenshot = true
        },

        scheduleGif(time) {
            this.gif = new GIF({
                workers: 4,
                quality: 10
            })
            this.gif.on('finished', function(blob) {
                window.open(URL.createObjectURL(blob));
            });

            this.gifTimer = time
        },

        evo(dt) {
            // make sure we are the last in the evolution line
            const i = lab._ls.indexOf(this)
            if (i < lab._ls.length - 1) this.dead = true // reattach itself

            if (this.gifTimer !== 0) {
                this.gifTimer -= dt
                this.frameTimer -= dt
            }
        },

        draw() {
            if (this.screenshot) {
                gcanvas.toBlob((blob) => {
                    img.downloadBlob(blob, 'zap')
                })
                this.screenshot = false
            }

            if (this.gifTimer !== 0) {

                if (this.gifTimer > 0) {
                    if (this.frameTimer < 0) {
                        this.gif.addFrame(gcanvas, { copy: true, delay: this.gifDelay * 1000 });
                        this.frameTimer = this.gifDelay
                    }
                } else {
                    this.gifTimer = 0 // we dont here
                    this.gif.render()
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
                // TODO handle switch - workers work only when hosted and not locally
                screenshotController.scheduleGif(5)
                e.preventDefault()
                break
        }
    })
})

