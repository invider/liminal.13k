function bindTexture(img) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

    const glTexture = gl.createTexture()
    glTexture.srcImage = img
    gl.bindTexture(gl.TEXTURE_2D, glTexture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
    gl.generateMipmap(gl.TEXTURE_2D)

    // enable smooth textures globally
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // enable pixelated textures
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    _.tex[img.name] = glTexture
    // unbind it
    gl.bindTexture(gl.TEXTURE_2D, null);
}

function loadTexture(name, url) {

    const img = new Image()
    img.onload = function() {
        if (!gl) _.texQueue.push(img)
        else bindTexture(name, img)
    }
    img.src = url
}

function handleRusty() {
    const img = document.getElementById('rustyImage')
    img.name = 'rusty'

    if (!gl) {
        if (!_.texQueue) _.texQueue = []
        _.texQueue.push(img)
    } else {
        bindTexture(img)
    }
}

function zapTextures() {
    log('binding missing textures...')
    _.texQueue.forEach(t => bindTexture(t))
}
