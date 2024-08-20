function keyDown(e) {
    if (e.repeat) return

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

        case 'KeyP':
            env.pause = !env.pause
            break
    }
}

function keyUp(e) {
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
}
