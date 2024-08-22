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
    /*
    switch(e.code) {
        case 'KeyW':
            lab.cam.move(1)
            break
        case 'KeyA':
            lab.cam.move(2)
            break
        case 'KeyS':
            lab.cam.move(3)
            break
        case 'KeyD':
            lab.cam.move(4)
            break

        case 'KeyQ':
            lab.cam.looseIt()
            break
        case 'KeyE':
            lab.cam.jumpNext()
            break

    }
    */
}

function keyUp(e) {
    flags[e.code] = 0
    trap('keyUp', e)

    let action = env.bind.indexOf(e.code)
    if (action > 0 && lab.broker) {
        lab.broker.stop(action)
    }

    /*
    switch(e.code) {
        case 'KeyW':
            lab.cam.stop(1)
            break
        case 'KeyA':
            lab.cam.stop(2)
            break
        case 'KeyS':
            lab.cam.stop(3)
            break
        case 'KeyD':
            lab.cam.stop(4)
            break
    }
    */
}

function mouseMove(e) {
    const dx = e.movementX, dy = e.movementY
    lab.cam.turn(dx, dy)
}
