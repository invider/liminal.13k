const _ = {}

// shader attributes
let _mMatrix, _nMatrix, _vMatrix, _pMatrix

function compileShader(id, type) {
    const src = document.getElementById(id).innerHTML
    const shader = gl.createShader(type? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER)

    gl.shaderSource(shader, src)
    gl.compileShader(shader)

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader
    else {
        err(`#${id}: ` + gl.getShaderInfoLog(shader))
    }
}

function setupShaders() {
    const v = compileShader('v-shader', 1)
    const f = compileShader('f-shader', 0)

    glProg = gl.createProgram()
    gl.attachShader(glProg, v)
    gl.attachShader(glProg, f)
    gl.linkProgram(glProg)

    if (!gl.getProgramParameter(glProg, gl.LINK_STATUS)) {
        // TODO show the link error
        err(gl.getProgramInfoLog(glProg))
    }
}

const buf = {}
function setupBuffers() {
    buf.cubeV = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf.cubeV)
    // TODO ask geo for mesh data, e.g. give me cube geometry etc...
    gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW)

    buf.cubeC = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf.cubeC)
    gl.bufferData(gl.ARRAY_BUFFER, cubeColors, gl.STATIC_DRAW)

    buf.cubeF = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf.cubeF)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cubeFaces, gl.STATIC_DRAW)
}

// DEBUG x2 triangles buffer
function fixBuffers() {
    // TODO load or proceduraly generate our geometry
    const shift = 1 - env.time % 1
    const sh2 = (env.time % 4) / 4
    const vertices = new Float32Array([
        // left triangle
         -1,   shift,  .0,
         .0,  .0,  .0,
         -1,  -shift,  .0,

        // right triangle
         sh2,    1,  .0,
        .0,   .0,  .0,
         sh2,   -1,  .0,
    ])

    // TODO do we need to recreate buffers all the time?
    glDynamicBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, glDynamicBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW)
}

function setupUniforms() {
    _mMatrix = gl.getUniformLocation(glProg, 'mMatrix')
    _nMatrix = gl.getUniformLocation(glProg, 'nMatrix')
    _vMatrix = gl.getUniformLocation(glProg, 'vMatrix')
    _pMatrix = gl.getUniformLocation(glProg, 'pMatrix')
}

window.onload = () => {
    canvas = document.getElementById('canvas')
    gl = canvas.getContext('webgl2', {
        alpha: false,
    })
    hcanvas = document.getElementById('hcanvas')
    ctx = hcanvas.getContext('2d')

    if (!gl) alert('No WebGL!')

    gl.clearColor(0.12, .07, .14, 1.0)
    //gl.clear(gl.COLOR_BUFFER_BIT)

    setupBuffers()
    setupShaders()
    setupUniforms()


    gl.useProgram(glProg)

    start()

    expandCanvas()
    lastTime = Date.now()
    cycle()
}

function start() {
    if (debug) {
        if (location.hash.startsWith('#box')) {
            _[location.hash.substring(1)]()
            return
        }
    }
    if (_.onStart) _.onStart()
}

