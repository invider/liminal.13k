let gl
let canvas
let lastTime

function expandCanvas() {
    const newWidth = window.innerWidth
    const newHeight = window.innerHeight

    canvas.width = newWidth
    canvas.height = newHeight
    canvas.style.width = newWidth + 'px'
    canvas.style.height = newHeight + 'px'
    gl.viewportWidth = newWidth
    gl.viewportHeight = newHeight
}

function setup() {
    canvas = document.getElementById('canvas')
    gl = canvas.getContext('webgl', {
        alpha: false,
    })

    if (!gl) alert('No WebGL!')

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    expandCanvas()
    draw(0)
    lastTime = Date.now()
}

function evo() {
}

function draw(dt) {
}

function cycle() {
}


window.onload = setup
window.onresize = function() {
    expandCanvas()
}
