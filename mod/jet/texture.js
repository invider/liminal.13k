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

function genTextures() {
    const idata = new ImageData(new Uint8ClampedArray([
        0xff, 0xff, 0xff, 0xff,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        0xff, 0xff, 0xff, 0xff,
    ]), 2, 2)
    idata.name = 'simple'
    bindTexture(idata)
}

function zapTextures() {
    log('generating textures...')
    genTextures()
}
