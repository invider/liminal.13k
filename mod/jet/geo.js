function calcNormals(v) {
    const n = [], w = [], gn = [], gN = []

    function indexVertex(vx, j, nv) {
        let o = -1, i = 0
        while(o < 0 && i < j) {
            vw = vec3.fromArray(v, i)
            if (vec3.equals(vx, vw)) {
                // found the leading vertex!
                o = i/3
            }
            i += 3
        }

        let wj = j/3
        w[wj] = o
        if (o < 0) o = wj

        if (gn[o]) {
            gn[o].push(nv)
        } else gn[o] = [nv]
    }

    function avgNormal(nlist) {
        const v = vec3(0, 0, 0)
        nlist.forEach(w => vec3.add(v, w))
        vec3.scale(v, 1/nlist.length)
        vec3.normalize(v)
        return v
    }

    for (let i = 0; i < v.length; i+=9) {
        let
            v1 = vec3.fromArray(v, i),
            v2 = vec3.fromArray(v, i + 3),
            v3 = vec3.fromArray(v, i + 6),
            v12 = vec3.isub(v1, v2),
            v13 = vec3.isub(v1, v3),
            nv = vec3.normalize( vec3.icross(v12, v13) )

        if (_gSmooth) {
            indexVertex(v1, i,     nv)
            indexVertex(v2, i + 3, nv)
            indexVertex(v3, i + 6, nv)
        }

        // push the same normal for all 3 vertices
        n.push(nv[0], nv[1], nv[2])
        n.push(nv[0], nv[1], nv[2])
        n.push(nv[0], nv[1], nv[2])
    }

    if (_gSmooth) {
        // TODO smooth the normals
        for (let i = 0; i < w.length; i++) {
            const leadIndex = w[i]

            let an
            if (leadIndex < 0) {
                an = avgNormal(gn[i]) 
                gN[i] = an
            } else {
                an = gN[leadIndex]
            }

            n[i*3]   = an[0]
            n[i*3+1] = an[1]
            n[i*3+2] = an[2]
        }
    }

    return n
}

// === geo state ===
let _g,
    _gSpherePrecision = 25,
    _gSmooth

const geo = {
    gen: function() {
        _g = {
            vertices: [],
            normals:  [],
            faces:    [],
            color:    [],
            uvs:      [],
        }
        return this
    },

    precision: function(v) {
        _gSpherePrecision = v
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
        _g.vertices = _g.vertices.concat(w)
        return this
    },

    faces: function(fv) {
        _g.faces = _g.faces.concat(fv)
        return this
    },

    normals: function(nv) {
        _g.normals = _g.normals.concat(nv)
        return this
    },

    uvs: function(uw) {
        _g.uvs = _g.uvs.concat(uw)
        return this
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
    
    ring(ir) {
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

    scale: function(s) {
        _g.vertices = _g.vertices.map(n => n * s)
        return this
    },

    stretch : function(t, s) {
        for (let i = 0; i < _g.vertices.length; i += 3) {
            _g.vertices[i + t] *= s
        }
        return this
    },

    name: function(n) {
        _g.name = n
        return this
    },

    bake: function() {
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

        if (_g.faces.length === 0) {
            _g.faces = null
        } else {
            _g.faces = new Uint16Array(_g.faces)
            _g.facesCount = _g.faces.length
        }

        if (_g.normals.length === 0) {
            _g.autocalcNormals = true
            _g.normals = new Float32Array( calcNormals(_g.vertices) ) 
        } else {
            _g.normals = new Float32Array(_g.normals) 
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

        return _g
    },

    bakeWires: function() {
        _g.wires = new Float32Array(_g.vertices)
        _g.wires.vertCount = _g.vertices.length / 3
        delete _g.vertices
        return _g
    },
}
