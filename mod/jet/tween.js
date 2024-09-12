const _tw = [
    (t) => t,
    (t) => t > 0.5 ? 4*Math.pow((t-1),3)+1 : 4*Math.pow(t,3),
]

class Tween extends Frame {

    inc(tw) {
        tw.s = env.time
        this.attach(tw)
    }

    evo(dt) {
        super.evo(dt)
        for (let w of this._ls) {
            let v = w.f((env.time - w.s)/w.t)
            w.e[w.p] = w.v1 + (w.v2 - w.v1) * v
            if (v >= 1) kill(w)
        }
    }

}

lab.attach(new Tween({
    name: 'tw'
}))
