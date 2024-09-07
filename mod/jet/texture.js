function bindTexture(srcImage) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

    const glTexture = gl.createTexture()
    glTexture.srcImage = srcImage
    gl.bindTexture(gl.TEXTURE_2D, glTexture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, srcImage)
    gl.generateMipmap(gl.TEXTURE_2D)

    // TODO must be a property of material
    // enable smooth textures globally
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // enable pixelated textures
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    _.tex[srcImage.name] = glTexture
    // unbind it
    gl.bindTexture(gl.TEXTURE_2D, null);
}

/*
// DEBUG load dynamically
function loadTexture(name, url) {
    const img = new Image()
    img.onload = function() {
        if (!gl) _.texQueue.push(img)
        else bindTexture(name, img)
    }
    img.src = url
}
*/

function noiseData(st) {
    const bt = extend({
        size: 640,
        x: 0, y: 0, z: 0, fq: 1,
    }, st)

    const rgba = []
    for (let y = 0; y < bt.size; y++) {
        for (let x = 0; x < bt.size; x++) {
            rgba.push(
                floor(snoise(bt.x + x*bt.fq, bt.y + y*bt.fq, bt.z) * 256),
                floor(snoise(bt.x + x*bt.fq, bt.y + y*bt.fq, bt.z) * 256),
                floor(snoise(bt.x + x*bt.fq, bt.y + y*bt.fq, bt.z) * 256),
                0xff,
            )
        }
    }
    return rgba
}

function noise() {
    const size = 640
    const rgba = noiseData({
        size,
        x: 17, y: 21, z: 2,
        fq: .01
    })
    const idata = new ImageData(new Uint8ClampedArray(rgba), size, size)
    idata.name = 'noise'
    bindTexture(idata)
}

function checkboard() {
    const idata = new ImageData(new Uint8ClampedArray([
        0xff, 0xff, 0xff, 0xff,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0xff, 0xff, 0xff, 0xff,
    ]), 2, 2)
    idata.name = 'simple'
    bindTexture(idata)
}

function billboard() {
    const W = 160
    const canvas = document.createElement('canvas')
    const cx = canvas.getContext('2d')
    canvas.width  = W
    canvas.height = W

    cx.rect(0, 0, W, W);
    cx.fillStyle = '#202530'
    cx.fill();

    cx.fillStyle = '#FF0000'
    cx.textBaseline = 'middle'
    cx.textAlign = 'center'
    cx.font = "24px monospace"
    cx.fillText('Procedural', W/2, W/2)

    const idata = cx.getImageData(0, 0, W, W)
    idata.name = 'billboard'
    bindTexture(idata)
}

function zapTextures() {
    checkboard()
    billboard()
    noise()
}
