let _up = [
    [ 0, 0, 0.5, 360,  1 ],
    [ 0, 0, 1,   360, -1 ],
], _gr = 0, _score, _ilt = 0

class Hero extends Frame {

    constructor(st) {

        const df = {
            // strangeSolid: true, // DEBUG - hide wireframes for the hero
            s:  0,
            hh: 1,
            HD: 0,
            DD: 0,

            eY: 2.5,
            tiltAngle: 0,
            minTilt: -PI/2,
            maxTilt:  PI/2,

            _f:       true,
            _pos:     vec3z(),
            mt: vec3z(),
            mtx:      vec3z(),
            mty:      vec3z(),
            mtz:      vec3z(),
        }
        
        st._pods = augment(st._pods, [
            new FPSMovementControllerPod(),
            new SolidBoxPod({
                hsize: vec3(1, 2, 1), 
            }),
        ])
        st._traits = augment(st._traits, [ attitudeTrait ])
        super( extend(df, st) )

        this._initialPos = vec3.clone(this.pos)
    }

    redeploy() {
        // redeploy on the last touched jumppad
        let $ = this
        if ($.lastPad) vec3.copy($.pos, $.lastPad.pos)
        else vec3.copy($.pos, $._initialPos)
        $.pos[1] += 15
        vec3.set($.mt, 0, 0, 0)
        $.HD = $.DD = _up[0][0] = _up[1][0] = 0
        $._f = true
        $.st = 0
    }

    reset() {
        if (this.st > 0) return
        this.st = 1
        lab.fader.roll(2) // fade out and show the score
        fx(5) // fall sfx
    }

    onImpact(src) {
        this.lastCollider = src
        //if (debug) env.dump.lastCollider = src.name
        if (src instanceof Floppy) {
            // got a floppy
            _up[0][0] += src.c
            kill(src)
        }
    }

    detectCollisions(mv) {
        //if (debug) env.dump.Impact = 'None'
        return lab.collide(this.solid, mv)
    }

    evo(dt) {
        super.evo(dt)

        // uploading and downloading
        _up.forEach((e, i)=> {
            if (e[0] > 0 && e[1] < 0) {
                // time for action!
                let c = e[0] > e[3]? e[3] : e[0]
                e[0] -= c
                this.HD += c * e[4] // increase or reduce
                if (i) this.DD += c // increase upload value
                e[1] = e[2]         // reset the timer
                if (i) fx.up(1)
                else {
                    fx(3)
                    if (rnd() < .3) setTimeout(() => fx(3), 150)
                }
            } else {
                e[1] -= dt
            }
        })

        const mt = this.mt,
              mtx = this.mtx,
              mty = this.mty,
              mtz = this.mtz,
              pym = mt[1]

        // apply gravity
        mt[1] -= GRAVITY * dt
        if (pym > 0 && mt[1] < 0) {
            // reached the peak
            this.lastJumpPad = null
            this._f = true
        }
        if (mt[1] < -TERMINAL_VELOCITY) {
            mt[1] = -TERMINAL_VELOCITY

            if (this.pos[1] < this.lastPlatform.pos[1] - TERMINAL_SHIFT) {
                this.reset()
            }
        }

        if (this.grounded && this.HD > K) {
            // ALERT!!! OVERLOAD!!!
            this.jump(4)
        }

        // apply horizontal friction
        let hm = 0
        const friction = this.grounded? FRICTION : AIR_RESISTENCE,
              ms2 = MAX_SPEED * MAX_SPEED,
              speedOverflow2 = Math.max(mt[0]*mt[0] + mt[2]*mt[2] - ms2, 0),
              speedF = 1 + speedOverflow2 * OVERSPEED_FACTOR,
              fv = vec3.n( vec3.clone(mt) )
        fv[1] = 0 // remove the Y component - applying in horizontal plane only 
        // if (debug) env.dump.frictionV = friction * speedF
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
                    if (this._f) {
                        // the hero has landed
                        this._f = false
                        fx(6) // landing sfx
                    }
                }
                vec3.copy(this.pos, this._pos) // rewind the y-motion
                // TODO do a feedback or hit recoil when and on the ground?
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
                vec3.set(mty, 0, STEP_UP_SPEED, 0)
                vec3.scad(this.pos, mty, dt)
                if (this.detectCollisions(mtx) > 1) {
                    // rollback
                    vec3.copy(this.pos, this._pos) // rewind the step motion
                } 
                hm++
            } else hm++
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
                vec3.set(mty, 0, STEP_UP_SPEED, 0)
                vec3.scad(this.pos, mty, dt)
                if (this.detectCollisions(mtz) > 1) {
                    // rollback
                    vec3.copy(this.pos, this._pos) // rewind the step motion
                }
                hm++
            } else hm++
        }

        if (this.grounded && hm) {
            _gr += dt
            if (_gr > .25) {
                fx(8)
                _gr -= .25
            }
        }

        /*
        // apply global restrains (DEBUG)
        if (env.groundLevel && this.pos[1] < this.hh) {
            // hit the ground
            this.pos[1] = this.hh
            mt[1] = 0
            this.grounded = true
        }
        */

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
        ctx.font = env.fnt
        ctx.fillStyle = env.cl
        ctx.textBaseline = 'top'

        ctx.textAlign = 'left'
        ctx.fillText(`Collected: ${this.HD}Kb`, 20, 20)

        ctx.textAlign = 'right'
        ctx.fillText(`Uploaded: ${this.DD}Kb`, hc.width-20, 20)

        if (this.HD > K) {
            ctx.textAlign = 'center'
            if (env.time % 1 < .5) ctx.fillText(`DATA OVERLOAD!!! EXCEEDED 13Mb!!!`, hc.width*.5, hc.height*.7)
        }
    }

    tilt(phi) {
        this.tiltAngle = clamp(this.tiltAngle + phi, this.minTilt, this.maxTilt)
    }

    jump(x) {
        this.mt[1] += JUMP_SPEED
        fx(x) // jump sfx
    }

    /*
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
    */

}
