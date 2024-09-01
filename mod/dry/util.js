// extend the target with up to two provided extension objects
function extend(e, s, x) {
    for (let p in s) {
        if (!p.startsWith('__')) e[p] = s[p]
    }
    if (x) extend(e, x)
    return e
}

function augment(array, extensions) {
    return (array || []).concat(extensions)
}

function wrap(fn1, fn2) {
    return (st) => {
        fn1(st)
        fn2(st)
    }
}

function defer(fn) {
    setTimeout(fn, 0)
}

function expandCanvas() {
    const newWidth = window.innerWidth
    const newHeight = window.innerHeight

    gcanvas.width = newWidth
    gcanvas.height = newHeight
    gcanvas.style.width = newWidth + 'px'
    gcanvas.style.height = newHeight + 'px'
    gl.viewport(0, 0, gcanvas.width, gcanvas.height)

    hcanvas.width = newWidth
    hcanvas.height = newHeight
    hcanvas.style.width = newWidth + 'px'
    hcanvas.style.height = newHeight + 'px'

    draw()
}

// convert image to a canvas with the same size and image content
function imgToCanvas(img) {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = img.width
    canvas.height = img.height

    if (img instanceof ImageData) {
        context.putImageData(img, 0, 0)
    } else {
        context.drawImage(img, 0, 0, img.width, img.height)
    }
    return canvas
}

// get image data from a provided image
function imgData(img) {
    const canvas = this.imgToCanvas(img)
    const context = canvas.getContext('2d')
    return context.getImageData(0, 0, img.width, img.height)
}

const err = console.error
const log = console.log

// DEBUG?
function loadRes(url, handlerFn) {
    fetch(url).then(
        x => x.text()
    ).then(raw => {
        handlerFn(raw)
    })
}

// DEBUG?
function loadJSON(url, handlerFn) {
    fetch(url).then(
        x => x.json()
    ).then(json => {
        handlerFn(json)
    })
}

