const collidableTrait = {

    collide: function(impactor) {
        let hit = false
        const ls = this._ls
        const n = ls.length
        for (let i = n - 1; i >= 0; --i) {
            const t = ls[i]
            if (t.collide) {
                if (t.collide(impactor)) hit = true
            } else if (t.solid && t.solid !== impactor) {
                if (t.solid.touch(impactor)) {
                    hit = true // TODO some object are transient and shouldn't raise that flag
                    if (impactor.onImpact) impactor.onImpact(t)
                }
            }
        }
        return hit
    }

}
