// shader attributes
let _m, _n, _v, _p,
    _uOpt,
    _ucp,
    _uDirectionalLightVector,
    _uDirectionalLightColorI,
    _upl,
    _upc,
    _uFogColor,
    _uAmbientColor,
    _uDiffuseColor,
    _uSpecularColor,
    _uEmissionColor,
    _uLightIntensities,
    _uShininess,
    _uTexture

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
    _m = gl.getUniformLocation(glProg, 'm')
    _n = gl.getUniformLocation(glProg, 'n')
    _v = gl.getUniformLocation(glProg, 'v')
    _p = gl.getUniformLocation(glProg, 'p')

    _uOpt = gl.getUniformLocation(glProg, 'uOpt')
    _ucp = gl.getUniformLocation(glProg, 'ucp')
    _uDirectionalLightVector = gl.getUniformLocation(glProg, 'uDirectionalLightVector')
    _uDirectionalLightColorI = gl.getUniformLocation(glProg, 'uDirectionalLightColorI')
    _upl = gl.getUniformLocation(glProg, 'upl')
    _upc = gl.getUniformLocation(glProg, 'upc')
    _uFogColor = gl.getUniformLocation(glProg, 'uFogColor')
    _uAmbientColor = gl.getUniformLocation(glProg, 'uAmbientColor')
    _uDiffuseColor = gl.getUniformLocation(glProg, 'uDiffuseColor')
    _uSpecularColor = gl.getUniformLocation(glProg, 'uSpecularColor')
    _uEmissionColor = gl.getUniformLocation(glProg, 'uEmissionColor')
    _uLightIntensities = gl.getUniformLocation(glProg, 'uLightIntensities')
    _uShininess = gl.getUniformLocation(glProg, 'uShininess')
    _uTexture = gl.getUniformLocation(glProg, 'uTexture')
}

function setupStage() {
    // setup the stage
    let stageFn = _.defaultStage
    if (debug) {
        if (location.hash.startsWith('#box')) {
            const args = location.hash.substring(1).split('/')
            const name = args[0]

            const fn = _[name] || window[name]
            if (!fn) throw `[${name}] is not found!`
            if (args.length > 1) {
                args.shift()
                stageFn = () => { fn(args) }
            } else {
                stageFn = fn
            }
        }
    }
    if (stageFn) stageFn()
    trap('stage')
}

function setupGL() {
    setupShaders()
    setupUniforms()
    gl.useProgram(glProg)
}

window.onload = () => {
    gc = document.getElementById('gc')
    gl = gc.getContext('webgl2', {
        alpha: false,
        preserveDrawingBuffer: true,
    })
    gc.onwebglcontextlost = e => e.preventDefault()
    gc.webglcontextrestored = setupGL()
    hc= document.getElementById('hc')
    ctx = hc.getContext('2d')

    if (!gl) alert('No WebGL!')

    setupGL()

    // run zaps
    if (debug) {
        for (prop in window) if (prop.startsWith('zap')) {
            log(`Zapping [${prop}]!`)
            window[prop]()
        }
    } else {
        // zap directly, so they not be optimized
        zapAudioController()
        zapTextures()
        zapGeoLib()
        zapScrewLib()
        zapPreStage()
    }

    setupStage()

    window.onresize = expandCanvas
    expandCanvas()
    trap('start')
    _lt = Date.now()
    cycle()
}
