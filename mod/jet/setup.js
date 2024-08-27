// shader attributes
let _mMatrix, _nMatrix, _vMatrix, _pMatrix,
    _uCamPos,
    _uDirectionalLightVector,
    _uDirectionalLightColorI,
    _uPointLightPosition,
    _uPointLightColorI,
    _uAmbientColor,
    _uDiffuseColor,
    _uSpecularColor,
    _uEmissionColor,
    _uLightIntensities,
    _uShininess

function compileShader(src, type) {
    //const src = document.getElementById(id).innerHTML
    const shader = gl.createShader(type? gl.FRAGMENT_SHADER: gl.VERTEX_SHADER)

    gl.shaderSource(shader, src)
    gl.compileShader(shader)

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader
    else {
        err(`#${type?'frag':'vert'}: ` + gl.getShaderInfoLog(shader))
    }
}

function setupShaders() {
    const v = compileShader(_vshader, 0)
    const f = compileShader(_fshader, 1)

    glProg = gl.createProgram()
    gl.attachShader(glProg, v)
    gl.attachShader(glProg, f)
    gl.linkProgram(glProg)

    if (!gl.getProgramParameter(glProg, gl.LINK_STATUS)) {
        // TODO show the link error
        err(gl.getProgramInfoLog(glProg))
    }
}

function setupUniforms() {
    _mMatrix = gl.getUniformLocation(glProg, 'mMatrix')
    _nMatrix = gl.getUniformLocation(glProg, 'nMatrix')
    _vMatrix = gl.getUniformLocation(glProg, 'vMatrix')
    _pMatrix = gl.getUniformLocation(glProg, 'pMatrix')

    _uCamPos = gl.getUniformLocation(glProg, 'uCamPos')
    _uDirectionalLightVector = gl.getUniformLocation(glProg, 'uDirectionalLightVector')
    _uDirectionalLightColorI = gl.getUniformLocation(glProg, 'uDirectionalLightColorI')
    _uPointLightPosition = gl.getUniformLocation(glProg, 'uPointLightPosition')
    _uPointLightColorI = gl.getUniformLocation(glProg, 'uPointLightColorI')
    _uAmbientColor = gl.getUniformLocation(glProg, 'uAmbientColor')
    _uDiffuseColor = gl.getUniformLocation(glProg, 'uDiffuseColor')
    _uSpecularColor = gl.getUniformLocation(glProg, 'uSpecularColor')
    _uEmissionColor = gl.getUniformLocation(glProg, 'uEmissionColor')
    _uLightIntensities = gl.getUniformLocation(glProg, 'uLightIntensities')
    _uShininess = gl.getUniformLocation(glProg, 'uShininess')
}

function setupStage() {
    // setup the stage
    let stageFn = _.defaultStage
    if (debug) {
        if (location.hash.startsWith('#box')) {
            const name = location.hash.substring(1)
            const fn = _[name]
            if (!fn) throw `[${name}] is not found!`
            startFn = fn
        }
    }
    if (stageFn) stageFn()
    trap('stage')
}

window.onload = () => {
    gcanvas = document.getElementById('gcanvas')
    gl = gcanvas.getContext('webgl2', {
        alpha: false,
    })
    hcanvas = document.getElementById('hcanvas')
    ctx = hcanvas.getContext('2d')

    if (!gl) alert('No WebGL!')

    gl.clearColor(0.12, .07, .14, 1.0)
    //gl.clear(gl.COLOR_BUFFER_BIT)

    setupShaders()
    setupUniforms()

    gl.useProgram(glProg)

    _.preStage()
    setupStage()

    expandCanvas()
    trap('start')
    _lastTime = Date.now()
    cycle()
}

