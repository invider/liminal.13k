const dfFMCP = {
    name:      'mover',
    speed:     20,
    turnSpeed: 2,
}

class FreeMovementControllerPod {

    constructor(st) {
        extend(this, dfFMCP, st)

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
        const speed     = this.speed
        const turnSpeed = this.turnSpeed
        switch(action) {
            case FORWARD:
                __.moveZ(-speed * dt)
                break
            case STRAFE_LEFT:
                __.moveX(-speed * dt)
                break
            case BACKWARD:
                __.moveZ(speed * dt)
                break
            case STRAFE_RIGHT:
                __.moveX(speed * dt)
                break
            case FLY_UP:
                __.moveY(speed * dt)
                break
            case FLY_DOWN:
                __.moveY(-speed * dt)
                break

            case LOOK_LEFT:
                __.yaw(-turnSpeed * dt)
                break
            case LOOK_RIGHT:
                __.yaw(turnSpeed * dt)
                break
            case LOOK_UP:
                __.pitch(-turnSpeed * dt)
                break
            case LOOK_DOWN:
                __.pitch(turnSpeed * dt)
                break
            case ROLL_LEFT:
                __.roll(turnSpeed * dt)
                break
            case ROLL_RIGHT:
                __.roll(-turnSpeed * dt)
                break

            case SHIFT_YAW:
                __.yaw(-turnSpeed * factor * dt)
                break
            case SHIFT_PITCH:
                __.pitch(turnSpeed * factor * dt)
                break
            case SHIFT_ROLL:
                __.roll(turnSpeed * factor * dt)
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
        }
    }

    onMouseUp(e) {}

    onMouseMove(e) {
        if (!env.mouseLock) return

        const dx = e.movementX, dy = e.movementY

        if (dx) {
            if (e.shiftKey) {
                // accumulate mouse roll
                this.pushers[SHIFT_ROLL] += dx * .1
            } else {
                // accumulate horizontal mouse movement
                this.pushers[SHIFT_YAW] -= dx * .1
            }
        }
        if (dy) {
            // accumulate vertical mouse movement
            this.pushers[SHIFT_PITCH] += dy * 0.075
        }
    }
}
