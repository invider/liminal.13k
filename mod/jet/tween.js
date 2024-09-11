const _tw = {
    linear: (t) => t,
    inOut: (t) => t > 0.5 ? 4*Math.pow((t-1),3)+1 : 4*Math.pow(t,3),
}

class Tween extends Frame {

    inc(tw) {
        tw.s = env.time
        this.attach(tw)
    }

    evo(dt) {
        super.evo(dt)
        for (let e of this._ls) {
            let v = e.f((env.time - e.s)/e.t)
            e.tar[e.p] = e.v1 + (e.v2 - e.v1) * v
            if (v >= 1) kill(e)
        }
    }

}

lab.attach(new Tween({
    name: 'tw'
}))
