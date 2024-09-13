let tw, _tw = [
    (t) => t,
    (t) => t > 0.5 ? 4*Math.pow((t-1),3)+1 : 4*Math.pow(t,3),
]

class Tween extends Frame {

    inc(w) {
        w.m = env.time
        this.attach(w)
    }

    n(a, p, s, e, t, f, k) {
        this.inc({a,p,s,e,t,f, onKill: k})
    }

    evo(dt) {
        super.evo(dt)
        for (let w of this._ls) {
            if (w.dead) continue
            let v = clamp(w.f((env.time - w.m)/w.t), 0, 1)
            w.a[w.p] = w.s + (w.e - w.s) * v
            if (v >= 1) kill(w)
        }
    }

}

tw = lab.attach(new Tween({
    name: 'tw'
}))
