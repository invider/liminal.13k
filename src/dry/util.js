// extend the target with up to two provided extension objects
function extend(e, s, x) {
    for (let p in s) {
        e[p] = s[p]
    }
    if (x) extend(e, x)
    return e
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

function err(msg) {
    console.error(msg)
}

function log(msg) {
    console.log(msg)
}

