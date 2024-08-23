function trap(eventName, st) {
    let fn = trap[eventName]
    if (fn) fn(st)
}

function keyDown(e) {
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

function keyUp(e) {
    flags[e.code] = 0
    trap('keyUp', e)

    let action = env.bind.indexOf(e.code)
    if (action > 0 && lab.broker) {
        lab.broker.stop(action)
    }
}

function mouseMove(e) {
    const dx = e.movementX, dy = e.movementY
    lab.cam.turn(dx, dy)
}
