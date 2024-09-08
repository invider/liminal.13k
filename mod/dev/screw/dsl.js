(() => {

// mesh generator
const $ = {
    gen: function() {
        _g = {
            v: [],
            n:  [],
            f:    [],
            c:   [],
            u:      [],
        }
        return this
    },
    push: v => {
        stack.push(v)
        return $
    },
    pushv: w => {
        for (x of w) stack.push(x)
        return $
    },
    drop: () => {
        pop()
    },
    swap: () => {
        const v1 = pop(), v2 = pop()
        stack.push(v1)
        stack.push(v2)
    },
    mpush: () => {
        mstack.push( mat4.clone(_gMatrix) )
    },
    mpop: () => {
        _gMatrix = mstack.pop()
    },

    // basic ops
    add: () => {
        stack.push( pop() + pop() )
    },

    sub: () => {
        const v = pop()
        stack.push( pop() - v )
    },

    mul: () => {
        stack.push( pop() * pop() )
    },

    div: () => {
        const v = pop()
        stack.push( pop() / v )
    },

    precision: function(v) {
        _gSpherePrecision = v || pop()
        return this
    },

    smooth: function() {
        _gSmooth = 1
        return this
    },

    sharp: function() {
        _gSmooth = 0
        return this
    },

    vertices: function(w) {
        for (let i = 0; i < w.length; i += 3) {
            vx(w[i], w[i+1], w[i+2])
        }
        //_g.vertices = _g.vertices.concat(w)
        return this
    },

    faces: function(fv) {
        _g.faces = _g.faces.concat(fv)
        return this
    },

    normals: function(w) {
        for (let i = 0; i < w.length; i += 3) {
            nx(w[i], w[i+1], w[i+2])
        }
        //_g.normals = _g.normals.concat(nv)
        return this
    },

    uvs: function(uw) {
        _g.uvs = _g.uvs.concat(uw)
        return this
    }, 

    tri: function() {
        for (let i = 0; i < 9; i += 3) {
            const z = pop(), y = pop(), x = pop()
            vx(x, y, z)
        }
    },

    plane: function() {
        _g.vertices = _g.vertices.concat([
            -1, 0,-1,  1, 0, 1,  1, 0,-1,    
            -1, 0,-1, -1, 0, 1,  1, 0, 1
        ])
        return this
    },

    cube: function() {
        _g.vertices = _g.vertices.concat([
            // top face
            -1, 1,-1,  -1, 1, 1,   1, 1, 1,
            -1, 1,-1,   1, 1, 1,   1, 1,-1,   

            // back face
            -1,-1,-1,  -1, 1,-1,   1, 1,-1,
            -1,-1,-1,   1, 1,-1,   1,-1,-1,

            // left face
            -1,-1,-1,  -1,-1, 1,  -1, 1, 1,
            -1,-1,-1,  -1, 1, 1,  -1, 1,-1,

            // front face
            -1,-1, 1,   1,-1, 1,   1, 1, 1,
            -1,-1, 1,   1, 1, 1,  -1, 1, 1,

            // right face
            1,-1,-1,   1, 1,-1,   1, 1, 1,
            1,-1,-1,   1, 1, 1,   1,-1, 1,

            // bottom face
            -1,-1,-1,  1,-1,-1,   1,-1, 1,
            -1,-1,-1,  1,-1, 1,  -1,-1, 1,
        ])

        if (_gUV) {
            _g.uvs = _g.uvs.concat([
                1, 0,   1, 1,   0, 1,
                1, 0,   0, 1,   0, 0,
            ])
            for (let j = 0; j < 12; j++) {
                for (let i = 0; i < 12; i++) {
                    _g.uvs.push(_g.uvs[i])
                }
            }
        }
        return this
    },

    tetrahedron: function() {
        _g.vertices = _g.vertices.concat([
            -1, 1,-1,   -1,-1, 1,   1, 1, 1,
             1, 1, 1,    1,-1,-1,  -1, 1,-1, 
            -1,-1, 1,    1,-1,-1,   1, 1, 1,
            -1, 1,-1,    1,-1,-1,  -1,-1, 1,
        ])
        return this
    },

    sphere: function() {
        const v = [], w = []

        for (let lat = 0; lat <= _gSpherePrecision; lat++) {
            let theta = (lat * PI) / _gSpherePrecision,
                cost = cos(theta),
                sint = sin(theta)

            for (let lon = 0; lon < _gSpherePrecision; lon++) {
                let phi = (lon * PI2) / _gSpherePrecision,
                    cosp = cos(phi),
                    sinp = sin(phi)
                    v.push(
                        cosp * sint,  // x
                        cost,         // y
                        sinp * sint   // z
                    )
            }
        }

        for (let lat = 0; lat < _gSpherePrecision; lat++) {
            for (let lon = 0; lon < _gSpherePrecision; lon++) {
                
                let base = lat * _gSpherePrecision
                    base2 = ((lat + 1)) * _gSpherePrecision
                    nextLon = (lon + 1) % _gSpherePrecision
                    at = (base + lon) * 3,
                    at2 = (base + nextLon) * 3
                    at3 = (base2 + lon) * 3
                    at4 = (base2 + nextLon) * 3

                w.push(
                    v[at], v[at+1], v[at+2],
                    v[at2], v[at2+1], v[at2+2],
                    v[at3], v[at3+1], v[at3+2],

                    v[at2], v[at2+1], v[at2+2],
                    v[at4], v[at4+1], v[at4+2],
                    v[at3], v[at3+1], v[at3+2],
                )
            }
        }

        _g.vertices = _g.vertices.concat(w)
        return this
    },

    cylinder() {
        const v = [], w = []

        for (let lon = 0; lon < _gSpherePrecision; lon++) {
            let phi = (lon * PI2) / _gSpherePrecision,
                c = cos(phi),
                s = sin(phi)
            v.push(c, 1, s)
        }

        for (let lon = 0; lon < _gSpherePrecision; lon++) {

                let at = lon * 3,
                    at2 = ((lon + 1) % _gSpherePrecision) * 3

                w.push(
                    v[at],   1,  v[at+2],
                    v[at2],  1,  v[at2+2],
                    v[at],  -1,  v[at+2],

                    v[at2],  1,  v[at2+2],
                    v[at2], -1,  v[at2+2],
                    v[at],  -1,  v[at+2],

                    v[at],   1,  v[at+2],
                    0,       1,  0,
                    v[at2],  1,  v[at2+2],

                    v[at2], -1,  v[at2+2],
                    0,      -1,  0,
                    v[at],  -1,  v[at+2]
                )
        }

        _g.vertices = _g.vertices.concat(w)
        return this
    },
    
    cone() {
        const v = [], w = []

        for (let lon = 0; lon < _gSpherePrecision; lon++) {
            let phi = (lon * PI2) / _gSpherePrecision,
                c = cos(phi),
                s = sin(phi)
            v.push(c, 1, s)
        }

        for (let lon = 0; lon < _gSpherePrecision; lon++) {

                let at = lon * 3,
                    at2 = ((lon + 1) % _gSpherePrecision) * 3

                w.push(
                    0,  1,  0,
                    v[at2], -1,  v[at2+2],
                    v[at],  -1,  v[at+2],

                    v[at2], -1,  v[at2+2],
                    0,      -1,  0,
                    v[at],  -1,  v[at+2]
                )
        }

        _g.vertices = _g.vertices.concat(w)
        return this
    },

    circle: function() {
        const v = [], w = []

        for (let lon = 0; lon < _gSpherePrecision; lon++) {
            let phi = (lon * PI2) / _gSpherePrecision,
                c = cos(phi),
                s = sin(phi)
            v.push(c, 1, s)
        }

        for (let lon = 0; lon < _gSpherePrecision; lon++) {
                let at = lon * 3,
                    at2 = ((lon + 1) % _gSpherePrecision) * 3

                w.push(
                    v[at2], 0,  v[at2+2],
                    0,      0,  0,
                    v[at],  0,  v[at+2]
                )
        }

        _g.vertices = _g.vertices.concat(w)
        return this
    },
    
    ring() {
        const ir = pop(), v = [], w = []

        for (let lon = 0; lon < _gSpherePrecision; lon++) {
            let phi = (lon * PI2) / _gSpherePrecision,
                c = cos(phi),
                s = sin(phi)
            v.push(c, 1, s)
        }

        for (let lon = 0; lon < _gSpherePrecision; lon++) {

                let at = lon * 3,
                    at2 = ((lon + 1) % _gSpherePrecision) * 3

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

        _g.vertices = _g.vertices.concat(w)
        return this
    },

    mid: function() {
        _gMatrix = mat4.identity()
        return this
    },

    mscale: function() {
        mat4.scale(_gMatrix, popV3())
        return this
    },

    mtranslate: function() {
        mat4.translate(_gMatrix, popV3())
        return this
    },

    mrotX: function() {
        mat4.rotX(_gMatrix, pop())
        return this
    },

    mrotY: function() {
        mat4.rotY(_gMatrix, pop())
        return this
    },

    mrotZ: function() {
        mat.rotZ(_gMatrix, pop())
        return this
    },

    reflectX: function() {
        v3Clone((x, y, z) => vec3(-x, y, z))
    },

    reflectY: function() {
        v3Clone((x, y, z) => vec3(x, -y, z))
    },

    reflectZ: function() {
        v3Clone((x, y, z) => vec3(x, y, -z))
    },

    // scale the existing geometry
    scale: function() {
        const s = pop()
        vxApply(n => n * s)
        return this
    },

    stretchX: function() {
        const s = pop()
        vxApply((n, i) => (i % 3) == 0? n * s : n)
        return this
    },

    stretchY: function() {
        const s = pop()
        vxApply((n, i) => i % 3 == 1? n * s : n)
        return this
    },

    stretchZ: function() {
        const s = pop()
        vxApply((n, i) => i % 3 == 2? n * s : n)
        return this
    },

    name: function(n) {
        _g.name = n || pop()
        return this
    },

    brew: function() {
        // normalize
        _g.vertices = new Float32Array(_g.vertices)
        _g.vertCount = _g.vertices.length / 3

        // wireframe points
        _g.wires = []
        for (let i = 0; i < _g.vertices.length; i += 9) {
            let v1 = vec3.fromArray(_g.vertices, i),
                v2 = vec3.fromArray(_g.vertices, i+3),
                v3 = vec3.fromArray(_g.vertices, i+6)
            vec3.push(_g.wires, v1).push(_g.wires, v2)
                .push(_g.wires, v2).push(_g.wires, v3)
                .push(_g.wires, v3).push(_g.wires, v1)
        }
        _g.wires = new Float32Array(_g.wires)

        if (_g.uvs.length > 0) {
            _g.uvs = new Float32Array(_g.uvs)
        } else {
            _g.uvs = null
        }

        if (_g.colors.length > 0) {
            _g.colors = new Float32Array(_g.colors)
        } else {
            _g.colors = null
        }

        if (_g.faces.length === 0) {
            _g.faces = null
        } else {
            _g.faces = new Uint16Array(_g.faces)
            _g.facesCount = _g.faces.length
        }

        if (_g.n.length === 0) {
            _g.autocalcNormals = true
            _g.n= new Float32Array( calcNormals(_g.vertices, _gSmooth) ) 
        } else {
            _g.n= new Float32Array(_g.n) 
        }

        // DEBUG vertex stat
        if (debug) {
            if (!this._vertexCount) this._vertexCount = 0
            this._vertexCount += _g.vertCount

            if (!this._polygonCount) this._polygonCount = 0
            this._polygonCount += _g.vertCount / 3

            if (!this._geoCount) this._geoCount = 0
            this._geoCount ++

            env.dump['Geometry Library'] = `${this._geoCount} (${this._polygonCount} polygons)`
        }

        gix.push(_g)
        if (_g.name) glib[_g.name] = _g
        return this
    },

    bake: function() {
        this.brew()
        return _g
    },

    last: function() {
        return _g
    },

    bakeWires: function() {
        _g.wires = new Float32Array(_g.vertices)
        _g.wires.vertCount = _g.vertices.length / 3
        delete _g.vertices
        return _g
    },

    dump: function() {
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
    },

    dumpv: function() {
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
    },
}

return $

})()
