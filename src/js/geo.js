function calcNormals(v) {
    const n = []

    for (let i = 0; i < v.length; i+=9) {
        let
            v1 = vec3.fromArray(v, i),
            v2 = vec3.fromArray(v, i + 3),
            v3 = vec3.fromArray(v, i + 6),
            v12 = vec3.isub(v1, v2),
            v13 = vec3.isub(v1, v3),
            nv = vec3.normalize( vec3.icross(v12, v13) )

        // push the same normal for all 3 vertices
        n.push(nv[0], nv[1], nv[2])
        n.push(nv[0], nv[1], nv[2])
        n.push(nv[0], nv[1], nv[2])
    }

    return n
}

let _g,
    _gSpherePrecision = 25

const geo = {
    gen: function() {
        _g = {
            vertices: [],
            faces:    [],
            color:    [],
        }
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

    sphere: function() {
        const v = [], w = []

        for (let lat = 0; lat <= _gSpherePrecision; lat++) {
            let theta = (lat * PI) / _gSpherePrecision,
                cost = cos(theta),
                sint = sin(theta)

            for (let lon = 0; lon < _gSpherePrecision; lon++) {
                let phi = (lon * 2 * PI) / _gSpherePrecision,
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

                const s = 0.1
                w.push(
                    v[at], v[at+1], v[at+2],
                    v[at3], v[at3+1], v[at3+2],
                    v[at2], v[at2+1], v[at2+2],

                    v[at2], v[at2+1], v[at2+2],
                    v[at3], v[at3+1], v[at3+2],
                    v[at4], v[at4+1], v[at4+2],

                )
            }
        }

        _g.vertices = _g.vertices.concat(w)
        return this
    },

    scale: function(s) {
        _g.vertices = _g.vertices.map(n => n * s)
        return this
    },

    bake: function() {
        // normalize
        _g.vertCount = _g.vertices.length / 3
        _g.vertices = new Float32Array(_g.vertices)

        _g.normals = new Float32Array( calcNormals(_g.vertices) ) 

        // TODO create other Float32 as well!
        return _g
    },
}



// DEBUG test cube
const cubeVertices = new Float32Array([
    -1,-1,-1,    1,-1,-1,   1, 1,-1,  -1, 1,-1,
    -1,-1, 1,    1,-1, 1,   1, 1, 1,  -1, 1, 1,
    -1,-1,-1,   -1, 1,-1,  -1, 1, 1,  -1,-1, 1,
     1,-1,-1,    1, 1,-1,   1, 1, 1,   1,-1, 1,
    -1,-1,-1,   -1,-1, 1,   1,-1, 1,   1,-1,-1,
    -1, 1,-1,   -1, 1, 1,   1, 1, 1,   1, 1,-1,
])

const cubeColors = new Float32Array([
    5,3,7,  5,3,7,  5,3,7,  5,3,7,
    1,1,3,  1,1,3,  1,1,3,  1,1,3,
    0,0,1,  0,0,1,  0,0,1,  0,0,1,
    1,0,0,  1,0,0,  1,0,0,  1,0,0,
    1,1,0,  1,1,0,  1,1,0,  1,1,0,
    0,1,0,  0,1,0,  0,1,0,  0,1,0,
])

const cubeFaces = new Uint16Array([
    0, 1, 2,        0, 2, 3,
    4, 5, 6,        4, 6, 7,
    8, 9, 10,       8, 10,11,
    12,13,14,       12,14,15,
    16,17,18,       16,18,19,
    20,21,22,       20,22,23,
])

