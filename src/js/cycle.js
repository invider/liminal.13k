let gl, glProg
let canvas, hcanvas
let lastTime

// DEBUG
let cubeVCBuffer, cubeFBuffer
let glDynamicBuffer
let mxAngle = 0, myAngle = 0, mzAngle = 0
let cxAngle = 0

function evo(dt) {
    lab.evo(dt)

    // DEBUG - rotate our fixed cube
    mxAngle += 20 * DEG_TO_RAD * dt
    myAngle += 40 * DEG_TO_RAD * dt
    mzAngle += 5  * DEG_TO_RAD * dt

    let w = ((env.time/8) % 2) - 1
    if (w < 0) w = -1 * w
    const wobble = .7
    cxAngle = PI - .4 + w * wobble
}

function drawScene() {
    // prepare the framebuffer and the drawing context
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    gl.clearDepth(1.0)
    // TODO figure the geometry and normals
    //gl.enable(gl.CULL_FACE)
    //gl.cullFace(gl.FRONT)

    // setup up the view and projection transformations
    const pMatrix = mat4.projection(70, canvas.width/canvas.height, 1, 1000)
    const vMatrix = mat4.lookAt(
        vec3(-5, -5, -35),
        vec3(0, 0, 0),
        vec3(0.2, 1, 0),
    )
    //mat4.mul(vMatrix, mat4.rotX(cxAngle))
    mat4.invert(vMatrix)
    // TODO merge view and projection into the pv matrix
    gl.uniformMatrix4fv(_vMatrix, false, vMatrix)
    gl.uniformMatrix4fv(_pMatrix, false, pMatrix)

    // draw the scene graph
    lab.draw()

    // draw the cube
    const mMatrix = mat4.identity()
    mat4
        .translate(mMatrix, vec3(-4, 2, 0))
        .rotX(mMatrix, mxAngle)
        .rotY(mMatrix, myAngle)
        .rotZ(mMatrix, mzAngle)
        .scale(mMatrix, vec3(.5, 4, 1))

    gl.uniformMatrix4fv(_mMatrix, false, mMatrix)

    gl.bindBuffer(gl.ARRAY_BUFFER, buf.cubeV)
    gl.vertexAttribPointer(_position, 3, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, buf.cubeC)
    gl.vertexAttribPointer(_color,    3, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf.cubeF)
    gl.drawElements(gl.TRIANGLES, cubeFaces.length, gl.UNSIGNED_SHORT, 0)
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
