let gl, glProg
let canvas, hcanvas
let lastTime

function evo(dt) {
    if (env.pause) return
    lab.evo(dt)
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
    const pMatrix = mat4.projection(lab.cam.vfov, canvas.width/canvas.height, 1, 1024)
    const vMatrix = lab.cam.viewMatrix()

    // TODO merge view and projection into the pv matrix
    gl.uniformMatrix4fv(_vMatrix, false, vMatrix)
    gl.uniformMatrix4fv(_pMatrix, false, pMatrix)

    // draw the scene graph
    lab.draw()
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

    if (env.status) {
        ctx.textBaseline = 'bottom'
        ctx.textAlign = 'right'
        by = hcanvas.height - 20
        ctx.fillText(env.status, bx, by)
    }
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
