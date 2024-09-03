function normalAngle(a) {
    a = a % PI2
    if (a < 0) a += PI2
    return a
}

function lpad(s, N) {
    const n = N - s.length
    for (let i = 0; i < n; i++) {
        s = ' ' + s
    }
    return s
}

function rpad(s, N) {
    const n = N - s.length
    for (let i = 0; i < n; i++) {
        s += ' '
    }
    return s
}

function genHitboxVertices(p, h) {
    return [
        // top face
        p[0] + h[0], p[1] + h[1], p[2] - h[2],
        p[0] - h[0], p[1] + h[1], p[2] - h[2],

        p[0] - h[0], p[1] + h[1], p[2] - h[2],
        p[0] - h[0], p[1] + h[1], p[2] + h[2],

        p[0] + h[0], p[1] + h[1], p[2] + h[2],
        p[0] - h[0], p[1] + h[1], p[2] + h[2],

        p[0] + h[0], p[1] + h[1], p[2] - h[2],
        p[0] + h[0], p[1] + h[1], p[2] + h[2],

        // sides
        p[0] + h[0], p[1] + h[1], p[2] - h[2],
        p[0] + h[0], p[1] - h[1], p[2] - h[2],

        p[0] - h[0], p[1] + h[1], p[2] - h[2],
        p[0] - h[0], p[1] - h[1], p[2] - h[2],

        p[0] + h[0], p[1] + h[1], p[2] + h[2],
        p[0] + h[0], p[1] - h[1], p[2] + h[2],

        p[0] - h[0], p[1] + h[1], p[2] + h[2],
        p[0] - h[0], p[1] - h[1], p[2] + h[2],


        // bottom face
        p[0] + h[0], p[1] - h[1], p[2] - h[2],
        p[0] - h[0], p[1] - h[1], p[2] - h[2],

        p[0] - h[0], p[1] - h[1], p[2] - h[2],
        p[0] - h[0], p[1] - h[1], p[2] + h[2],

        p[0] + h[0], p[1] - h[1], p[2] + h[2],
        p[0] - h[0], p[1] - h[1], p[2] + h[2],

        p[0] + h[0], p[1] - h[1], p[2] - h[2],
        p[0] + h[0], p[1] - h[1], p[2] + h[2],
    ]
}

function genHitBoxMesh(p, h) {
    const g = geo.gen().name('hitBox').vertices( genHitboxVertices(p, h) ).bakeWires()
    return new WireMesh({
        name: 'hitboxMesh',
        geo:  g,
        renderOptions: vec4(0, 1, 0, 0),
    })
}

// DEBUG?
function loadRes(url, handlerFn) {
    fetch(url).then(
        x => x.text()
    ).then(raw => {
        handlerFn(raw)
    })
}

// DEBUG?
function loadJSON(url, handlerFn) {
    fetch(url).then(
        x => x.json()
    ).then(json => {
        handlerFn(json)
    })
}

function uploadRes(url, raw, handlerFn) {
    fetch(url, {
        method: "POST",
        body: raw,
    }).then(res => {
        if (res.status !== 200) {
            err(`Failed to upload: ${url}`)
            err(`HTTP Response: ${res.status}`)
            console.dir(res)
        } else {
            handlerFn(res)
        }
    })
}

function loadLocalFile(file, handler) {
	let input = file.target

	let reader = new FileReader()
    reader.onload = handler
    /*
	reader.onload = function(){
        lab.vm.loadSource(reader.result)
	};
    */
	reader.readAsText(input.files[0]);
}

function saveLocalFile(name, plainText) {
    const a = document.createElement('a')
    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(plainText)
    a.download = name
    a.click()
}

function nodePickUp(x, y) {
    log('picking up some!')
    
    // tune materials into unique ambient
    // ...
    const pickable = []
    lab.apply(e => {
        if (!e.dead && !e.ghost && e.surface) {
            const _pid = pickable.length
            e._pid = _pid
            pickable.push(e)
            e.surface._mat = e.surface.mat
            e.surface._renderOptions = e.surface.renderOptions
            e.surface.renderOptions = vec4(1, 0, 0, 0)

            const idv3 = id2rgb(_pid)
            e.surface.mat = {
                Ka: idv3,
                //Ka: vec3(1, 0, 0),
                Kd: vec3(.1, .8, .9),
                Ks: vec3(1, 1, 1),
                Ke: vec3(0, 0, 0),
                Lv: vec4(1, 0, 0, 0),
                Ns: 1, // can't be 0, since can get NaN case in the shader!
            }
        }
    })
    console.dir(pickable)

    gl.clearColor(0, 0, 0, 0)
    drawScene()

    // TODO why we are not getting the right pixels?
    //      it works somewhere in the middle kinda
    //      but only one object in the middle gets picked
    //      others - return 0.0.0.255??? why???
    //      buffers needs to be preserved? render to a separate framebuffer? coordinates?
    log('pixel at ' + x + ':' + y)
    const pixel = new Uint8Array(4)
    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel)
    log(pixel)
    log('id: ' + rgb2id(pixel))

    // bring everything back
    pickable.forEach(e => {
        e.surface.mat = e.surface._mat
        e.surface.renderOptions = e.surface._renderOptions
    })
    
    // draw again
    drawScene()
}

function id2rgb(id) {
    ir = id % 256
    ig = ((id - ir)/256) % 256
    ib = Math.floor(((id - ir - ig)/(256*256)) % 256)
    return vec3( ir/255, ig/255, ib/255 )
}

function rgb2id(v) {
    return v[2]*256*256 + v[1]*256 + v[0]
}
