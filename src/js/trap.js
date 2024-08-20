function keyDown(e) {
    if (e.repeat) return

    switch(e.code) {
        case 'KeyE':
            lab.cam.jumpNext()
            break
    }
}

function keyUp(e) {}
