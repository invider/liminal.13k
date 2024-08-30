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

function genHitboxMesh(p, h) {
    const g = geo.gen().name('hitBox').vertices( genHitboxVertices(p, h) ).bakeWires()
    return new WireMesh({
        name: 'hitboxMesh',
        geo:  g,
        renderOptions: vec4(0, 1, 0, 0),
    })
}
