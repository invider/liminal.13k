let gl, glProg
let canvas, hcanvas
let lastTime

// DEBUG
let _position, _color
let _mMatrix, _vMatrix, _pMatrix
let cubeVCBuffer, cubeFBuffer
let glDynamicBuffer
let mxAngle = 0, myAngle = 0, mzAngle = 0


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
