function trap(eventName, st) {
    let fn = trap[eventName]
    if (fn) fn(st)
}

trap.register = function(eventName, fn) {
    if (!trap[eventName]) trap[eventName] = fn
    else trap[eventName] = wrap(trap[eventName], fn)
}

window.onkeydown = (e) => {
    if (e.repeat) return
    fx.touch()

    /*
    switch(e.code) {
        case 'KeyP':
            if (!env.disabled) env.paused = !env.paused
            break
    }
    if (env.paused) return
    */

    trap('keyDown', e)

    if (env.paused || env.disabled) return

    flags[e.code] = 1
    let action = env.bind.indexOf(e.code)
    if (action > 0 && lab.broker) {
        lab.broker.activate(action)
    }
}

window.onkeyup = (e) => {
    flags[e.code] = 0
    trap('keyUp', e)

    let action = env.bind.indexOf(e.code)
    if (action > 0 && lab.broker) {
        lab.broker.stop(action)
    }
}

window.onmousedown = (e) => {
    if (env.paused || env.disabled) return
    fx.touch()
    trap('mdn', e)
    if (lab.broker) lab.broker.onMouseDown(e)
}

window.onmouseup = (e) => {
    if (env.paused || env.disabled) return
    trap('mup', e)
    if (lab.broker) lab.broker.onMouseUp(e)
}

window.onmousemove = (e) => {
    if (env.paused || env.disabled) return
    if (lab.broker) lab.broker.onMouseMove(e)
}

window.onwheel = (e) => {
    if (env.paused || env.disabled) return
    if (lab.broker && lab.broker.onMouseWheel) lab.broker.onMouseWheel(e)
}

document.onpointerlockchange = (e) => {
    if (document.pointerLockElement) {
        env.mouseLock = true
    } else {
        env.mouseLock = false
        env.pointerReleaseTime = Date.now()
    }
}
