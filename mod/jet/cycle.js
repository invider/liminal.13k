let gl, glProg,
    gc, hc,
    _lt

function evo(dt) {
    if (env.paused) return
    lab.evo(dt)
}

function drawScene() {
    if (!lab.cam) return
    // TODO move out to a debug node?
    //if (debug) {
    //    env.stat.lastPolygons = env.stat.polygons
    //    env.stat.polygons = 0
    //}
    // prepare the framebuffer and the drawing context
    gl.clearColor(.11, .02, .13, 1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    gl.clearDepth(1.0)
    if (env.backfaces) {
        gl.disable(gl.CULL_FACE)
    } else {
        gl.enable(gl.CULL_FACE)
        gl.cullFace(gl.BACK)
    }

    // set model matrix to identity
    mat4.copy(mMatrix, iMatrix)

    // setup up the view and projection transformations
    // TODO merge view and projection into the pv matrix and get it from the camera
    gl.uniformMatrix4fv(_a.p, false, lab.cam.projectionMatrix())
    gl.uniformMatrix4fv(_a.v, false, lab.cam.viewMatrix())
    gl.uniform3fv(_a.ucp, lab.cam.pos)

    // TODO precalc in _dirLight buffer and use that instead?
    const rnv = vec3.clone(env.dv)
    vec3.scale(rnv, -1)
    vec3.n(rnv)

    gl.uniform3fv(_a.udv, rnv)
    gl.uniform4fv(_a.udc, env.dc)

    // set point light uniforms
    gl.uniform3fv(_a.upl, env.pl)
    gl.uniform4fv(_a.upc, env.pc)

    // tune - fog color
    gl.uniform4fv(_a.uF, rgba('1d0722FF'))

    // draw the scene graph
    lab.draw()
}


function draw(dt) {
    if (dt > .01) {
        // accumulate FPS
        ifps[nfps++] = 1/dt
        if (nfps > 59) {
            nfps = 0
            // update the average FPS value
            env.fps = (ifps.reduce((v, acc) => acc + v) / ifps.length) << 0
        }
    }

    // clear 2D canvas
    ctx.clearRect(0, 0, hc.width, hc.height)

    drawScene()
}

function cycle() {
    const now = Date.now()
    const delta = (now - _lt) / 1000
    let dt = delta

    if (dt > .3) dt = .3
    env.time += dt
    while (dt > .2) {
        evo(.2)
        dt -= .2
    }
    evo(dt)

    draw(delta)

    _lt = now
    requestAnimationFrame(cycle)
}
