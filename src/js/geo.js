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

let _g
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
            -1,-1,-1,   1,-1, 1,   1,-1,-1,    
            -1,-1,-1,  -1,-1, 1,   1,-1, 1,

            // back face
             1,-1,-1,   1, 1,-1,  -1,-1,-1,
            //-1,-1,-1,  -1, 1,-1,   1, 1,-1,

            // left face
            -1, 1, 1,  -1, 1,-1,  -1,-1, 1,
            -1,-1, 1,  -1, 1,-1,  -1,-1,-1,

            // bottom face
            -1,  1,-1,  1, 1, 1,   1, 1,-1,    
            -1,  1,-1, -1, 1, 1,   1, 1, 1,
        ])
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

