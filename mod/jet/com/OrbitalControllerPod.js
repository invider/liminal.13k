class OrbitalControllerPod {

    constructor(st) {
        extend(this, {
            name:      'mover',
            speed:     20,
            turnSpeed: 2,
            r:         10,
            maxDist:   3,
        }, st)

        this.pushers = new Float32Array(ZOOM_Y + 1) // (!) need to be zeroed for accumulation!
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
                if (vec3.dist(__.pos, __.lookAt) > this.maxDist) {
                    __.moveZ(-speed * dt)
                }
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

            case ZOOM_Y:
                if (factor > 0 || vec3.dist(__.pos, __.lookAt) > this.maxDist) {
                    __.moveZ(factor * dt)
                }
                break

            case SHIFT_YAW:
                __.moveX(speed * factor * dt)
                //__.yaw(-turnSpeed * factor * dt)
                break
            case SHIFT_PITCH:
                __.moveY(speed * factor * dt)
                //__.pitch(turnSpeed * factor * dt)
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
        /*
        if (e.button == 0) {
            if (!env.mouseLock) captureMouse()
        }
        */
    }

    onMouseUp(e) {}

    onMouseMove(e) {
        if (e.buttons & 1) {
            const dx = e.movementX, dy = e.movementY

            if (dx) {
                // accumulate horizontal mouse movement
                this.pushers[SHIFT_YAW] -= dx * .2
            }
            if (dy) {
                // accumulate vertical mouse movement
                this.pushers[SHIFT_PITCH] += dy * 0.2
            }
        } else if (e.buttons & 2) {
            // TODO
        }
    }

    onMouseWheel(e) {
        const dx = e.deltaX, dy = e.deltaY

        if (dy) {
            // accumulate zoom
            this.pushers[ZOOM_Y] += dy * .25
        }
    }
}
