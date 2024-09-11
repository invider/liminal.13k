// shader attributes
let ctx
    _a = {},
    _A = [
        'm',
        'n',
        'v',
        'p',
        'uOpt',
        'ucp',
        'udv',
        'udc',
        'upl',
        'upc',
        'uFogColor',
        'ua',
        'ud',
        'us',
        'un',
        'uTexture'
    ]
/*
let _m, _n, _v, _p,
    _uOpt,
    _ucp,
    _udv,
    _udc,
    _upl,
    _upc,
    _uFogColor,
    _ua,
    _ud,
    _us,
    _un,
    _uTexture,
*/

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
    _A.forEach(u => _a[u] = gl.getUniformLocation(glProg, u))
    /*
    _m = gl.getUniformLocation(glProg, 'm')
    _n = gl.getUniformLocation(glProg, 'n')
    _v = gl.getUniformLocation(glProg, 'v')
    _p = gl.getUniformLocation(glProg, 'p')

    _uOpt = gl.getUniformLocation(glProg, 'uOpt')
    _ucp = gl.getUniformLocation(glProg, 'ucp')
    _udv = gl.getUniformLocation(glProg, 'udv')
    _udc = gl.getUniformLocation(glProg, 'udc')
    _upl = gl.getUniformLocation(glProg, 'upl')
    _upc = gl.getUniformLocation(glProg, 'upc')
    _uFogColor = gl.getUniformLocation(glProg, 'uFogColor')
    _ua = gl.getUniformLocation(glProg, 'ua')
    _ud = gl.getUniformLocation(glProg, 'ud')
    _us = gl.getUniformLocation(glProg, 'us')
    _un = gl.getUniformLocation(glProg, 'un')
    _uTexture = gl.getUniformLocation(glProg, 'uTexture')
    */
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
        for (let prop in window) if (prop.startsWith('zap')) {
            log(`Zapping [${prop}]!`)
            window[prop]()
        }
    } else {
        // zap directly, so they not be optimized
        zapAudioController()
        zapTextures()
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
