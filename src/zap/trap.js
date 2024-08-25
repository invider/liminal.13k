function trap(eventName, st) {
    let fn = trap[eventName]
    if (fn) fn(st)
}

window.onkeydown = (e) => {
    if (e.repeat) return

    flags[e.code] = 1
    trap('keyDown', e)

    let action = env.bind.indexOf(e.code)
    if (action > 0 && lab.broker) {
        lab.broker.activate(action)
    }

    switch(e.code) {
        case 'KeyP':
            env.pause = !env.pause
            break
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

window.onclick = (e) => {
}

window.onmousemove = (e) => {
    if (lab.broker) lab.broker.onMouseMove(e)
}

window.onresize = expandCanvas

window.onhashchange = () => {
    start()
}
