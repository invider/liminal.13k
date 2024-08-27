const dfMCP = {
    name:      'mover',
    speed:     20,
    turnSpeed: 2,
}

class MovementControllerPod {

    constructor(st) {
        extend(this, dfMCP, st)

        this.pushers = new Float32Array(SHIFT_ROLL+1)
    }

    push(action, factor, dt) {
        const __ = this.__
        const speed     = this.speed
        const turnSpeed = this.turnSpeed
        switch(action) {
            case FORWARD:
                __.moveZ(-speed * dt)
                break
            case LEFT:
                __.moveX(-speed * dt)
                break
            case BACKWARD:
                __.moveZ(speed * dt)
                break
            case RIGHT:
                __.moveX(speed * dt)
                break
            case UP:
                __.moveY(speed * dt)
                break
            case DOWN:
                __.moveY(-speed * dt)
                break

            case LOOK_LEFT:
                __.yaw(turnSpeed * dt)
                break
            case LOOK_RIGHT:
                __.yaw(-turnSpeed * dt)
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
                __.yaw(turnSpeed * factor * dt)
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

    onMouseMove(e) {
        if (e.buttons != 1) return
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
