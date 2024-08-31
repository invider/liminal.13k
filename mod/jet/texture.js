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

// DEBUG load dynamically
function loadTexture(name, url) {
    const img = new Image()
    img.onload = function() {
        if (!gl) _.texQueue.push(img)
        else bindTexture(name, img)
    }
    img.src = url
}

function noise() {
    const nbx = 17, nby = 21, nbz = 2, nfq = .01
    const W = 640, rgba = []
    for (let y = 0; y < W; y++) {
        for (let x = 0; x < W; x++) {
            rgba.push(
                Math.floor(snoise(nbx + x*nfq, nby + y*nfq, nbz) * 256),
                Math.floor(snoise(nbx + x*nfq, nby + y*nfq, nbz) * 256),
                Math.floor(snoise(nbx + x*nfq, nby + y*nfq, nbz) * 256),
                0xff,
            )
        }
    }

    const idata = new ImageData(new Uint8ClampedArray(rgba), W, W)
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

function genTextures() {
    checkboard()
    billboard()
    noise()
}

function zapTextures() {
    log('generating textures...')
    genTextures()
}
