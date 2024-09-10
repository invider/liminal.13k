class Hero extends Frame {

    constructor(st) {

        const df = {
            // strangeSolid: true, // DEBUG - hide wireframes for the hero
            hh: 1,
            HD: 0,

            eY: 1.5,
            tiltAngle: 0,
            minTilt: -PI/2,
            maxTilt:  PI/2,

            _pos:     vec3z(),
            mt: vec3z(),
            mtx:      vec3z(),
            mty:      vec3z(),
            mtz:      vec3z(),
        }
        
        st._pods = augment(st._pods, [
            new FPSMovementControllerPod(),
            new SolidBoxPod({
                hsize: vec3(.7, 1.5, .7), 
            }),
        ])
        st._traits = augment(st._traits, [ attitudeTrait ])
        super( extend(df, st) )

        this._initialPos = vec3.clone(this.pos)
    }

    reset() {
        log('=== TERMINAL FALL ===') 
        switch(env.resetMode) {
            case 0:
                // full map restore
                break
            case 1:
                // reset to starting point
                vec3.copy(this.pos, this._initialPos)
                // reset the momentum so we are no longer in the terminal fall!
                this.mt[1] = 0
                break
            case 2:
                // redeploy on the last touched platform
                vec3.copy(this.pos, this.lastPlatform.pos)
                this.pos[1] += 15
                this.mt[1] = 0
                break
        }
    }

    onImpact(src) {
        this.lastCollider = src
        if (debug) env.dump.lastCollider = src.name
        if (src instanceof Floppy) {
            // got a floppy
            this.HD += src.c
            // TODO play some sfx and feedback text
        }
    }

    detectCollisions(mv) {
        if (debug) env.dump.Impact = 'None'

        return lab.collide(this.solid, mv)
    }

    evo(dt) {
        super.evo(dt)

        const mt = this.mt,
              mtx = this.mtx,
              mty = this.mty,
              mtz = this.mtz

        // make some gravity
        /*
        mt[1] = Math.max(mt[1] - tune.gravity * dt, -tune.terminalVelocity)
        if (mt[1] === -tune.terminalVelocity) {
        }
        */

        const pym = mt[1]
        mt[1] -= tune.gravity * dt
        if (pym > 0 && mt[1] < 0) {
            // reached the peak
            this.lastJumpPad = null
        }
        if (mt[1] < -tune.terminalVelocity) {
            mt[1] = -tune.terminalVelocity

            if (this.pos[1] < this.lastPlatform.pos[1] - tune.terminalShift) {
                trap('terminalFall')
            }
        }

        // apply horizontal friction
        const friction = this.grounded? tune.friction : tune.airResistence
        const fv = vec3.normalize( vec3.clone(mt) )
        fv[1] = 0 // remove the Y component - applying in horizontal plane only 
        const ms2 = tune.maxSpeed * tune.maxSpeed
        const speedOverflow2 = Math.max(mt[0]*mt[0] + mt[2]*mt[2] - ms2, 0)
        const speedF = 1 + speedOverflow2 * tune.overspeedFactor
        if (debug) env.dump.frictionV = friction * speedF
        vec3.scale(fv, friction * speedF)
        if (abs(fv[0]) > abs(mt[0])) fv[0] = mt[0] // goes to 0
        if (abs(fv[2]) > abs(mt[2])) fv[2] = mt[2]
        vec3.scale(fv, -1)
        vec3.add(mt, fv)

        // === apply movement ===
        // TODO limit the max speed
        //const speed2 = mt[0]*m[0] + mt[2]*m[2]

        // deconstruct momentum into axis-components
        vec3.set(mtx,  mt[0], 0,     0    )
        vec3.set(mty,  0,     mt[1], 0    )
        vec3.set(mtz,  0,     0,     mt[2])

        // === move y ===
        this.grounded = false
        vec3.copy(this._pos, this.pos)
        vec3.scad(this.pos, mty, dt)
        if (!vec3.equals(this.pos, this._pos)) {
            if (this.detectCollisions(mty)) {
                if (mt[1] < 0) {
                    this.grounded = true
                    this.lastPlatform = this.lastCollider
                }
                vec3.copy(this.pos, this._pos) // rewind the y-motion
                // TODO do a feedback or hit recoil when land on the ground?
                mt[1] = 0 // reset y momentum
            }
        }

        // === move x ===
        // store current pos
        vec3.copy(this._pos, this.pos)
        vec3.scad(this.pos, mtx, dt)
        if (!vec3.equals(this.pos, this._pos)) {
            const cl = this.detectCollisions(mtx)
            if (cl === HIT_HARD) {
                vec3.copy(this.pos, this._pos) // rewind the x-motion
                // TODO do a feedback or hit recoil like in dronepolis?
                //mt[0] = 0 // reset x momentum
            } else if (cl === HIT_STEP) {
                // TODO figure how to avoid getting stuck as a result
                vec3.set(mty, 0, tune.stepUpSpeed, 0)
                vec3.scad(this.pos, mty, dt)
                if (this.detectCollisions(mtx) > 1) {
                    log('step hit hard!')
                    // rollback
                    vec3.copy(this.pos, this._pos) // rewind the step motion
                }
            }
        }

        // === move z ===
        vec3.copy(this._pos, this.pos)
        vec3.scad(this.pos, mtz, dt)
        if (!vec3.equals(this.pos, this._pos)) {
            const cl = this.detectCollisions(mtz)
            if (cl === HIT_HARD) {
                vec3.copy(this.pos, this._pos)
                // TODO do a feedback or hit recoil like in dronepolis?
                //mt[2] = 0 // reset y momentum
            } else if (cl === HIT_STEP) {
                // TODO figure how to avoid getting stuck as a result
                vec3.set(mty, 0, tune.stepUpSpeed, 0)
                vec3.scad(this.pos, mty, dt)
                if (this.detectCollisions(mtz) > 1) {
                    // rollback
                    vec3.copy(this.pos, this._pos) // rewind the step motion
                }
            }
        }

        // apply global restrains (DEBUG)
        if (env.groundLevel && this.pos[1] < this.hh) {
            // hit the ground
            this.pos[1] = this.hh
            mt[1] = 0
            this.grounded = true
        }

        /*
        this.pos[0] += this.dx
        this.pos[1] = Math.max(this.pos[1] + this.dy, this.hh)
        this.pos[2] += this.dz
        */

        // pin the camera to the eyes position
        vec3.set(this.cam.pos, this.pos[0], this.pos[1] + this.eY, this.pos[2])

        vec3.copy(this.cam.dir,  this.dir)
        vec3.copy(this.cam.left, this.left)
        vec3.copy(this.cam.up,   this.up)
        this.cam.pitch(this.tiltAngle)
    }

    draw() {
        super.draw()

        // show the status/HUD
        ctx.fillStyle = '#e06a10'
        ctx.textBaseline = 'top'
        ctx.textAlign = 'right'
        ctx.font = "32px monospace"
        ctx.fillText(`Data Collected: ${this.HD}Kb`, hc.width-20, 20)
    }

    tilt(phi) {
        this.tiltAngle = clamp(this.tiltAngle + phi, this.minTilt, this.maxTilt)
    }

    jump() {
        if (!this.grounded) return
        this.mt[1] += tune.jumpSpeed
    }

    use() {
        const hits = this.cam.pick()
        hits.sort((a, b) => {
            if (a.dist < b.dist) return -1
            else if (a.dist > b.dist) return 1
            return 0
        })
        const hit = hits[0]
        if (hit) {
            if (hit.__.name) log(hit.__.name)
            console.dir(hit.__)
        }
    }

}
