// extend the target with up to two provided extension objects
function extend(e, s, x) {
    for (let p in s) {
        e[p] = s[p]
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

function err(msg) {
    console.error(msg)
}

function log(msg) {
    console.log(msg)
}

function loadRes(url, handlerFn) {
    fetch(url).then(
        x => x.text()
    ).then(raw => {
        handlerFn(raw)
    })
}

