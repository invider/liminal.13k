class Hero extends Frame {

    constructor(st) {

        const df = {
            hh: 1,

            eyesShiftY: 1,
            tiltAngle: 0,
            minTilt: -1,
            maxTilt:  1,

            momentum: vec3(0, 0, 0),
        }
        
        st._pods = augment(st._pods, [ new FPSMovementControllerPod(), new SolidSpherePod() ])
        st._traits = augment(st._traits, [ AttitudeTrait ])
        super( extend(df, st) )
    }

    onImpact(src) {
        this._impact = true
        env.dump.Impact = 'Yes!'
        this._lastImpactor = src
    }

    collide(dt) {
        env.dump.Impact = 'None'

        const ls = this.__._ls
        const ln = ls.length
        this.solid.place()
        for (let i = ln - 1; i >= 0; --i) {
            const t = ls[i]
            if (this !== t && t.solid) {
                if (t.solid.touch(this.solid)) this.onImpact(t)
            }
        }
    }

    evo(dt) {
        super.evo(dt)

        const mt = this.momentum

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
        this._pos = vec3.clone(this.pos) // TODO keep a buffer
        vec3.scad(this.pos, mt, dt)

        // do the collision and rewinds across x/y/z
        if (!vec3.equals(this.pos, this._pos)) this.collide(dt)

        // apply restrains
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

    use() {
        const hits = this.cam.pick()
        hits.forEach(hit => log(hit.__.name))
    }

}
