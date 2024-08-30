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
