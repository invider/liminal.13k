// === geo library ===
const glib = {}, gix = []

const geo = (() => {

// === geo state ===
let _g,
    _gSpherePrecision = 25,
    _gSmooth,
    _gMatrix = mat4.identity()

    _gUV = 0 // enable UV mapping experiment?

const stack = [], mstack = []

// DEBUG
const sv = vec3(1, 1, 1)
vec3.scale(sv, 0.1)
mat4.scale(_gMatrix, sv)

function vxApply(fn) {
    for (let i = 0; i < _g.vertices.length; i++) {
        _g.vertices[i] = fn(_g.vertices[i], i)
    }
}

function vx(x, y, z) {
    const v = vec3(x, y, z)
    vec3.mulM4(v, _gMatrix)
    _g.vertices.push(v[0])
    _g.vertices.push(v[1])
    _g.vertices.push(v[2])
}

// mesh generator
const $ = {
    gen: function() {
        _g = {
            vertices: [],
            normals:  [],
            faces:    [],
            colors:   [],
            uvs:      [],
        }
        return this
    },
    push: v => {
        stack.push(v)
        return $
    },
    pushv: w => {
        console.dir(w)
        for (x of w) stack.push(x)
        return $
    },
    drop: () => {
        stack.pop()
    },
    pushm: () => {
        mstack.push( mat4.clone(_gMatrix) )
    },
    popm: () => {
        _gMatrix = mstack.pop()
    },

    precision: function(v) {
        _gSpherePrecision = v || stack.pop()
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

    tri: function() {
        for (let i = 0; i < 9; i += 3) {
            const z = stack.pop(), y = stack.pop(), x = stack.pop()
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
        const ir = stack.pop(), v = [], w = []

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

    scale: function() {
        const s = stack.pop()
        vxApply(n => n * s)
        return this
    },

    stretchX: function() {
        const s = stack.pop()
        vxApply((n, i) => (i % 3) == 0? n * s : n)
        return this
    },

    stretchY: function() {
        const s = stack.pop()
        vxApply((n, i) => i % 3 == 1? n * s : n)
        return this
    },

    stretchZ: function() {
        const s = stack.pop()
        vxApply((n, i) => i % 3 == 2? n * s : n)
        return this
    },

    name: function(n) {
        _g.name = n || stack.pop()
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

        if (_g.normals.length === 0) {
            _g.autocalcNormals = true
            _g.normals = new Float32Array( calcNormals(_g.vertices, _gSmooth) ) 
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
}

return $

})()

