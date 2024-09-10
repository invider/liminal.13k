const dfSMCP = {
    name:         'mover',
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
    }

    push(action, factor, dt) {
        const __ = this.__
        const speed = dt * (__.grounded? ACCELERATION : AIR_ACCELERATION)

        switch(action) {
            case JUMP:
                if (__.grounded) {
                    __.mt[1] += JUMP_SPEED
                }
                break
            case FORWARD:
                vec3.scad(__.mt, __.dir, -speed)
                break
            case STRAFE_LEFT:
                vec3.scad(__.mt, vec3(-__.dir[2], 0, __.dir[0]), speed)
                break
            case BACKWARD:
                vec3.scad(__.mt, __.dir, speed)
                break
            case STRAFE_RIGHT:
                vec3.scad(__.mt, vec3(__.dir[2], 0, -__.dir[0]), speed)
                break

            // keyboard look
            case LOOK_LEFT:
                __.yaw(-TURN_SPEED * dt)
                break
            case LOOK_RIGHT:
                __.yaw(TURN_SPEED * dt)
                break
            case LOOK_UP:
                __.tilt(-TILT_SPEED * dt)
                break
            case LOOK_DOWN:
                __.tilt(TILT_SPEED * dt)
                break

            // mouse look
            case SHIFT_YAW:
                __.yaw(MOUSE_TURN_SPEED * factor * dt)
                break
            case SHIFT_PITCH:
                __.tilt(-MOUSE_TILT_SPEED * factor * dt)
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
    }

    stop(action) {
        this.pushers[action] = 0
    }

    onMouseDown(e) {
        if (e.button == 0) {
            if (!env.mouseLock) captureMouse()
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
}
