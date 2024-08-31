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
