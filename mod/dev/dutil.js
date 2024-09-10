function normalAngle(a) {
    a = a % PI2
    if (a < 0) a += PI2
    return a
}

function genHitBoxVertices(p, h) {
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
    //const g = geo.gen().name('hitBox').vertices( genHitBoxVertices(p, h) ).bakeWires()

    geo.unscrewOne(screwUp('neogeo "hitBox" name'))
    const g = geo.cg()
    g.v = g.v.concat( genHitBoxVertices(p, h) )
    geo.unscrewOne(screwUp('brewWires'))

    return new WireMesh({
        name: 'hitBoxMesh',
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
    const pickable = []
    lab.apply(e => {
        if (!e.dead && !e.ghost && e.surface) {
            pickable.push(e)
            const _pid = e._pid = pickable.length // start with #1, #0 is reserved for the empty spot
            e.surface._m = e.surface.m
            e.surface._renderOptions = e.surface.renderOptions
            e.surface.renderOptions = vec4(1, 0, 0, 0)

            // tune materials into unique ambient colors
            const idv4 = id2rgba(_pid)
            e.surface.m = {
                a: idv4,
                d: vec4(.1, .8, .9, 0),
                s: vec4(1, 1, 1, 0),
                n: 1, // can't be 0, since can get NaN case in the shader!
            }
        }
    })

    env._clearColor = env.clearColor  // buffer current clear color
    env.clearColor = vec4(0, 0, 0, 0) // we need the totally black background for picking
    drawScene()

    const pixel = new Uint8Array(4)
    // [!] The framebuffer coordinates are originating at the bottom left!!!
    gl.readPixels(x, gc.height - y, 1, 1, gl.RGB, gl.UNSIGNED_BYTE, pixel)
    const pid = rgb2id(pixel)
    // log('#' + pid)
    const picked = pickable[pid - 1] // shift one left to compensate for the empty spot

    // bring everything back
    pickable.forEach(e => {
        e.surface.m = e.surface._m
        e.surface.renderOptions = e.surface._renderOptions
    })
    env.clearColor = env._clearColor

    // draw again
    drawScene()

    return picked
}

function id2rgba(id) {
    ir = id % 256
    ig = ((id - ir)/256) % 256
    ib = Math.floor(((id - ir - ig)/(256*256)) % 256)
    return vec4( ir/255, ig/255, ib/255, 1)
}

function rgb2id(v) {
    return v[2]*256*256 + v[1]*256 + v[0]
}

function dumpV3(v3) {
    return `${floor(v3[0]*10)/10}:${floor(v3[1]*10)/10}:${floor(v3[2]*10)/10}`
}
