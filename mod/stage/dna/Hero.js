class Hero extends Frame {

    constructor(st) {

        const df = {
            strangeSolid: true,
            hh: 1,

            eyesShiftY: .7,
            tiltAngle: 0,
            minTilt: -1,
            maxTilt:  1,

            _pos:     vec3z(),
            momentum: vec3z(),
            mtx:      vec3z(),
            mty:      vec3z(),
            mtz:      vec3z(),
        }
        
        st._pods = augment(st._pods, [
            new FPSMovementControllerPod(),
            new SolidBoxPod({
                hsize: vec3(.7, 1, .7), 
            }),
        ])
        st._traits = augment(st._traits, [ AttitudeTrait ])
        super( extend(df, st) )
    }

    onImpact(src) {
        this._impact = true
        env.dump.Impact = 'Impact!'
        this._lastImpactor = src
    }

    collide(dt) {
        let hit = false
        env.dump.Impact = 'None'

        const ls = this.__._ls
        const ln = ls.length
        this.solid.place()
        for (let i = ln - 1; i >= 0; --i) {
            const t = ls[i]
            if (this !== t && t.solid) {
                if (t.solid.touch(this.solid)) {
                    hit = true
                    this.onImpact(t)
                }
            }
        }
        return hit
    }

    evo(dt) {
        super.evo(dt)

        const mt = this.momentum,
              mtx = this.mtx,
              mty = this.mty,
              mtz = this.mtz

        // make some gravity
        if (this.pos[1] - this.hh > 0) {
            mt[1] -= tune.gravity * dt
        }

        // apply horizontal friction
        // TODO should work only when in contact with the ground
        const fv = vec3.normalize( vec3.clone(mt) )
        fv[1] = 0 // remove the Y component - applying in horizontal plane only 
        vec3.scale(fv, tune.friction)
        if (abs(fv[0]) > abs(mt[0])) fv[0] = mt[0]
        if (abs(fv[2]) > abs(mt[2])) fv[2] = mt[2]
        vec3.scale(fv, -1)
        vec3.add(mt, fv)

        // apply movement
        // TODO limit the max speed

        // deconstruct momentum into axis-components
        vec3.set(mtx,  mt[0], 0,     0    )
        vec3.set(mty,  0,     mt[1], 0    )
        vec3.set(mtz,  0,     0,     mt[2])
        
        // === move x ===
        // store current pos
        vec3.copy(this._pos, this.pos)
        vec3.scad(this.pos, mtx, dt)
        if (!vec3.equals(this.pos, this._pos)) {
            if (this.collide(dt)) {
                vec3.copy(this.pos, this._pos)
                // TODO do a feedback or hit recoil like in dronepolis?
                mt[0] = 0 // reset x momentum
            }
        }

        // === move z ===
        vec3.copy(this._pos, this.pos)
        vec3.scad(this.pos, mtz, dt)
        if (!vec3.equals(this.pos, this._pos)) {
            if (this.collide(dt)) {
                vec3.copy(this.pos, this._pos)
                // TODO do a feedback or hit recoil like in dronepolis?
                mt[2] = 0 // reset y momentum
            }
        }

        // === move y ===
        vec3.copy(this._pos, this.pos)
        vec3.scad(this.pos, mty, dt)
        if (!vec3.equals(this.pos, this._pos)) {
            if (this.collide(dt)) {
                vec3.copy(this.pos, this._pos)
                // TODO do a feedback or hit recoil when land on the ground?
                mt[1] = 0 // reset y momentum
            }
        }

        // apply global restrains (DEBUG)
        if (this.pos[1] < 0) {
            // hit the ground
            this.pos[1] = this.hh
            mt[1] = 0
        }
        
        /*
        this.pos[0] += this.dx
        this.pos[1] = Math.max(this.pos[1] + this.dy, this.hh)
        this.pos[2] += this.dz
        */

        // pin the camera to the eyes position
        vec3.set(this.cam.pos, this.pos[0], this.pos[1] + this.eyesShiftY, this.pos[2])

        vec3.copy(this.cam.dir,  this.dir)
        vec3.copy(this.cam.left, this.left)
        vec3.copy(this.cam.up,   this.up)
        this.cam.pitch(this.tiltAngle)
    }

    tilt(phi) {
        this.tiltAngle = clamp(this.tiltAngle + phi, this.minTilt, this.maxTilt)
    }

    jump() {
        //this.__.pos[1] - this.__.hh === 0 // jump only from the ground
        this.momentum[1] += tune.jumpSpeed
    }

    use() {
        const hits = this.cam.pick()
        hits.forEach(hit => log(hit.__.name))
    }

}
