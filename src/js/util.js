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

