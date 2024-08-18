let gl, glProg
let canvas, hcanvas
let lastTime

// DEBUG
let _position, _color
let _mMatrix, _vMatrix, _pMatrix
let cubeVCBuffer, cubeFBuffer
let glDynamicBuffer
let mxAngle = 0, myAngle = 0, mzAngle = 0

let nfps = 0
const ifps = []

const env = {
    time: 0,
    fps: 60,
}

function log(msg) {
    console.log('>' + msg)
}

function expandCanvas() {
    const newWidth = window.innerWidth
    const newHeight = window.innerHeight

    canvas.width = newWidth
    canvas.height = newHeight
    canvas.style.width = newWidth + 'px'
    canvas.style.height = newHeight + 'px'
    gl.viewport(0, 0, canvas.width, canvas.height)

    hcanvas.width = newWidth
    hcanvas.height = newHeight
    hcanvas.style.width = newWidth + 'px'
    hcanvas.style.height = newHeight + 'px'

    draw()
}

function compileShader(id, type) {
    const src = document.getElementById(id).innerHTML
    const shader = gl.createShader(type? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER)

    gl.shaderSource(shader, src)
    gl.compileShader(shader)

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader
    else {
        log('shader error!')
        log(gl.getShaderInfoLog(shader))
    }
}

function setupShaders() {
    const v = compileShader('v-shader', 1)
    const f = compileShader('f-shader', 0)

    glProg = gl.createProgram()
    gl.attachShader(glProg, v)
    gl.attachShader(glProg, f)
    gl.linkProgram(glProg)

    if (gl.getProgramParameter(glProg, gl.LINK_STATUS)) {
        // all fine!
        return
    } else {
        // TODO show the link error
        log('unable to link the GL program!')
    }
}

function setupBuffers() {
    cubeVBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW)

    cubeCBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeCBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, cubeColors, gl.STATIC_DRAW)

    cubeFBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeFBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cubeFaces, gl.STATIC_DRAW)
}

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
    _vMatrix = gl.getUniformLocation(glProg, 'vMatrix')
    _pMatrix = gl.getUniformLocation(glProg, 'pMatrix')
}

function setup() {
    canvas = document.getElementById('canvas')
    gl = canvas.getContext('webgl2', {
        alpha: false,
    })
    hcanvas = document.getElementById('hcanvas')
    ctx = hcanvas.getContext('2d')

    if (!gl) alert('No WebGL!')

    gl.clearColor(0.2, 0.2, 0.2, 1.0)
    //gl.clear(gl.COLOR_BUFFER_BIT)

    setupBuffers()
    setupShaders()
    setupUniforms()

    // bind buffers to attributes
    _position = gl.getAttribLocation(glProg, 'aVertexPosition')
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVBuffer)
    gl.vertexAttribPointer(_position, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(_position)

    _color = gl.getAttribLocation(glProg, 'aVertexColor')
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeCBuffer)
    gl.vertexAttribPointer(_color,    3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(_color)

    gl.useProgram(glProg)

    expandCanvas()
    lastTime = Date.now()
    cycle()
}

function evo(dt) {
    mxAngle += 20 * DEG_TO_RAD * dt
    myAngle += 40 * DEG_TO_RAD * dt
    mzAngle += 5  * DEG_TO_RAD * dt
}

function drawHUD() {
    ctx.clearRect(0, 0, hcanvas.width, hcanvas.height)

    ctx.fillStyle = '#ffff00'
    ctx.textBaseline = 'top'
    ctx.textAlign = 'left'
    ctx.font = "24px monospace"

    const bx = hcanvas.width - 160
    let by = 20
    ctx.fillText(`FPS: ${env.fps}`, bx, by)
    by += 30
    ctx.fillText(`Time: ${env.time << 0}`, bx, by)
}

function drawScene() {
    const pMatrix = mat4.projection(70, canvas.width/canvas.height, 1, 1000)
    //const pMatrix = mat4.identity()
    const vMatrix = mat4.identity()
    const mMatrix = mat4.identity()

    vMatrix[12] -= 0  // translate x
    vMatrix[13] -= 0  // translate y
    vMatrix[14] -= 4  // translate z

    mat4.mul(mMatrix, mat4.rotX(mxAngle))
        .mul(mMatrix, mat4.rotY(myAngle))
        .mul(mMatrix, mat4.rotZ(mzAngle))

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    gl.clearDepth(1.0)

    gl.uniformMatrix4fv(_mMatrix, false, mMatrix)
    gl.uniformMatrix4fv(_vMatrix, false, vMatrix)
    gl.uniformMatrix4fv(_pMatrix, false, pMatrix)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeFBuffer)
    gl.drawElements(gl.TRIANGLES, cubeFaces.length, gl.UNSIGNED_SHORT, 0)

    /*
    fixBuffers()
    const vertexPositionAttribute = gl.getAttribLocation(glProg, 'aVertexPosition')
    gl.enableVertexAttribArray(vertexPositionAttribute)
    gl.bindBuffer(gl.ARRAY_BUFFER, glDynamicBuffer)
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    */
}

function draw(dt) {
    if (dt > .013) {
        ifps[nfps++] = 1/dt
        if (nfps > 59) {
            nfps = 0
            // update the average FPS value
            env.fps = (ifps.reduce((v, acc) => acc + v) / ifps.length) << 0
        }
    }

    drawScene()
    drawHUD()
}

function cycle() {
    const now = Date.now()
    const delta = (now - lastTime) / 1000
    let dt = delta

    // TODO handle inputs
    // ...

    if (dt > .3) dt = .3
    env.time += dt
    while (dt > .05) {
        evo(.05)
        dt -= .05
    }
    evo(dt)

    draw(delta)

    lastTime = now
    requestAnimationFrame(cycle)
}


window.onload = setup
window.onresize = function() {
    expandCanvas()
}
