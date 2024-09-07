function zapDebug() {
    if (!debug) return

    // extend screw VM with extensions and debug opcodes

    // ring
    _gops.push(() => {
        const ir = pop(), v = [], w = []

        for (let lon = 0; lon < gSpherePrecision; lon++) {
            let phi = (lon * PI2) / gSpherePrecision,
                c = cos(phi),
                s = sin(phi)
            v.push(c, 1, s)
        }

        for (let lon = 0; lon < gSpherePrecision; lon++) {

                let at = lon * 3,
                    at2 = ((lon + 1) % gSpherePrecision) * 3

                w.push(
                    v[at2],    0,  v[at2+2],
                    v[at],     0,  v[at+2], 
                    v[at2]*ir, 0,  v[at2+2]*ir,

                    v[at],     0,  v[at+2],
                    v[at]*ir,  0,  v[at+2]*ir,
                    v[at2]*ir, 0,  v[at2+2]*ir

                    /*
                    v[at]*ir,  0,  v[at]*ir,
                    v[at],     0,  v[at],
                    v[at2]*ir, 0,  v[at2]*ir,

                    v[at2]*ir, 0,  v[at2]*ir,
                    v[at],     0,  v[at],
                    v[at2],    0,  v[at2]
                    */
                )
        }
        g.vertices = g.vertices.concat(w)
    })

    // tetrahedron
    _gops.push(() => {
        g.vertices = g.vertices.concat([
            -1, 1,-1,   -1,-1, 1,   1, 1, 1,
             1, 1, 1,    1,-1,-1,  -1, 1,-1, 
            -1,-1, 1,    1,-1,-1,   1, 1, 1,
            -1, 1,-1,    1,-1,-1,  -1,-1, 1,
        ])
    })

    // cone
    _gops.push(() => {
        const v = [], w = []

        for (let lon = 0; lon < gSpherePrecision; lon++) {
            let phi = (lon * PI2) / gSpherePrecision,
                c = cos(phi),
                s = sin(phi)
            v.push(c, 1, s)
        }

        for (let lon = 0; lon < gSpherePrecision; lon++) {

                let at = lon * 3,
                    at2 = ((lon + 1) % gSpherePrecision) * 3

                w.push(
                    0,  1,  0,
                    v[at2], -1,  v[at2+2],
                    v[at],  -1,  v[at+2],

                    v[at2], -1,  v[at2+2],
                    0,      -1,  0,
                    v[at],  -1,  v[at+2]
                )
        }
        g.vertices = g.vertices.concat(w)
    })


    // dump
    _gops.push(() => {
        const b = []

        b.push('=== matrix ===\n')
        _gMatrix.forEach((v, i) => {
            b.push(v)
            b.push('  ')
            if (i % 4 === 3) b.push('\n')
        })

        b.push('\n=== stack ===\n')
        stack.forEach((v, i) => {
            b.push(v)
            b.push('  ')
            if (i % 3 === 2) b.push('\n')
        })

        console.dir(stack)
        console.dir(_gMatrix)
        const d = b.join('')
        console.log(d)
        term.println('\n' + d)
    })

    // dumpv
    _gops.push(() => {
        const b = []

        b.push('\n=== verteces ===\n')
        _g.vertices.forEach((v, i) => {
            b.push(v)
            b.push('  ')
            if (i % 9 === 8) b.push('\n')
            else if (i % 3 === 2) b.push('    ')
        })

        const d = b.join('')
        console.dir(_g.vertices)
        console.log(d)
        term.println('\n' + d)
    })

    /*
    // if we want to have autostart for sandboxes
    window.onhashchange = () => {
        start()
    }
    */
}
