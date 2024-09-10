const
    FLY_UP      = 10,
    FLY_DOWN    = 11,
    ROLL_LEFT   = 12,
    ROLL_RIGHT  = 13

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
        // register additional actions
        env.bind.push('KeyE')     // fly up
        env.bind.push('KeyC')     // fly down
        env.bind.push('Delete')   // roll left
        env.bind.push('PageDown') // roll right
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
                break
            case SHIFT_PITCH:
                __.moveY(speed * factor * dt)
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
        if (this.disabled) return
        this.pushers[action] = 1
    }

    stop(action) {
        if (this.disabled) return
        this.pushers[action] = 0
    }

    onMouseDown(e) {
        if (this.disabled) return
        /*
        if (e.button == 0) {
            if (!env.mouseLock) captureMouse()
        }
        */
    }

    onMouseUp(e) {}

    onMouseMove(e) {
        if (this.disabled) return

        if (e.buttons & 4) {
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
        if (this.disabled) return

        const dx = e.deltaX, dy = e.deltaY

        if (dy) {
            // accumulate zoom
            this.pushers[ZOOM_Y] += dy * .25
        }
    }
}
