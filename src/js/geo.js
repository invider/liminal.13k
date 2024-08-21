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


let _g
const geo = {
    gen: function() {
        _g = {
            vertices: [],
            normals:  [],
            faces: [],
            color: [],
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

    scale: function(s) {
        _g.vertices = _g.vertices.map(n => n * s)
        return this
    },

    get: function() {
        // normalize
        _g.vertCount = _g.vertices.length / 3
        _g.vertices = new Float32Array(_g.vertices)
        // TODO create other Float32 as well!
        return _g
    },
}
