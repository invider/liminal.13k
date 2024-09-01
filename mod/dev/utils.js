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
