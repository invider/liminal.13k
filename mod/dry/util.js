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

function defer(fn, t) {
    setTimeout(fn, t*1000 || 0)
}

function expandCanvas() {
    const newWidth = window.innerWidth
    const newHeight = window.innerHeight

    gc.width = newWidth
    gc.height = newHeight
    gc.style.width = newWidth + 'px'
    gc.style.height = newHeight + 'px'
    gl.viewport(0, 0, gc.width, gc.height)

    hc.width = newWidth
    hc.height = newHeight
    hc.style.width = newWidth + 'px'
    hc.style.height = newHeight + 'px'

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

function _x2d(x) {
    let d = x.charCodeAt(0) - 48
    return d > 9? d - 7 : d
}

const F = 255
function rgb(h) {
    const d = h.toUpperCase().split('').map(c => _x2d(c))
    return vec3((16*d[0]+d[1])/F, (16*d[2]+d[3])/F, (16*d[4]+d[5])/F)
}

function rgba(h) {
    const d = h.toUpperCase().split('').map(c => _x2d(c))
    return vec4((16*d[0]+d[1])/F, (16*d[2]+d[3])/F, (16*d[4]+d[5])/F, (16*d[6]+d[7])/F)
}

const err = console.error
const log = console.log

function captureMouse() {
    // calculate a safe delay to avoid capture lock DOM exception
    const t = 1000 - Math.min(abs((env.prt || 0) - Date.now()), 1000)
    setTimeout(() => {
        gc.requestPointerLock()
    }, t * 2.5)
}

