const dfSMCP = {
    name:         'mover',
    acceleration: 60,       // TODO move out to tune maybe?
}

class FPSMovementControllerPod {

    constructor(st) {
        extend(this, dfSMCP, st)

        this.pushers = new Float32Array(SHIFT_ROLL+1)
    }

    capture() {
        lab.broker = this
    }

    init() {
        this.capture()

        document.onpointerlockchange = (e) => {
            if (document.pointerLockElement) {
                env.mouseLock = true
            } else {
                env.mouseLock = false
            }
        }
    }

    push(action, factor, dt) {
        const __ = this.__
        const speed = this.acceleration * dt

        switch(action) {
            case FORWARD:
                if (__.grounded) vec3.scad(__.momentum, __.dir, -speed)
                break
            case STRAFE_LEFT:
                if (__.grounded) vec3.scad(__.momentum, vec3(-__.dir[2], 0, __.dir[0]), speed)
                break
            case BACKWARD:
                if (__.grounded) vec3.scad(__.momentum, __.dir, speed)
                break
            case STRAFE_RIGHT:
                if (__.grounded) vec3.scad(__.momentum, vec3(__.dir[2], 0, -__.dir[0]), speed)
                break

            // keyboard look
            case LOOK_LEFT:
                __.yaw(-tune.turnSpeed * dt)
                break
            case LOOK_RIGHT:
                __.yaw(tune.turnSpeed * dt)
                break
            case LOOK_UP:
                __.tilt(-tune.tiltSpeed * dt)
                break
            case LOOK_DOWN:
                __.tilt(tune.tiltSpeed * dt)
                break

            // mouse look
            case SHIFT_YAW:
                __.yaw(tune.turnMouseSpeed * factor * dt)
                break
            case SHIFT_PITCH:
                __.tilt(-tune.tiltMouseSpeed * factor * dt)
                break
        }
    }

    evo(dt) {
        // activate pushers
        for (let i = 0; i < this.pushers.length; i++) {
            const f = this.pushers[i]
            if (f) {
                this.push(i, f, dt)
                if (i > 20) this.pushers[i] = 0 // reset the mouse movement accumulation buffers
            }
        }
    }

    activate(action) {
        this.pushers[action] = 1

        if (action === JUMP) {
            this.__.jump()
        }
        if (action === USE) {
            this.__.use()
        }
    }

    stop(action) {
        this.pushers[action] = 0
    }

    onMouseDown(e) {
        if (e.button == 0) {
            if (!env.mouseLock) this.captureMouse()
        } else if (e.button == 2) {
            this.__.use()
        }
    }

    onMouseUp(e) {
    }

    onMouseMove(e) {
        if (!env.mouseLock) return

        const dx = e.movementX, dy = e.movementY
        if (dx) {
            if (e.shiftKey) {
                // accumulate mouse roll
                this.pushers[SHIFT_ROLL] += dx
            } else {
                // accumulate horizontal mouse movement
                this.pushers[SHIFT_YAW] += dx
            }
        }
        if (dy) {
            // accumulate vertical mouse movement
            this.pushers[SHIFT_PITCH] += dy
        }
    }

    captureMouse() {
        gcanvas.requestPointerLock()
    }
}
