const collidableTrait = {

    collide: function(impactor) {
        let hit = false
        const ls = this._ls
        const n = ls.length
        for (let i = n - 1; i >= 0; --i) {
            const t = ls[i]
            if (t.collide) {
                if (t.collide(impactor)) hit = true
            } else if (!t.dead && t.solid && t.solid !== impactor) {
                if (t.solid.touch(impactor)) {
                    // test if the touch is hard or ephemeral
                    if (t.solid.kind) {
                        hit = true // got a hard collision
                    }
                    if (t.solid.onTouch) t.solid.onTouch(impactor)
                    if (t.solid.__.reactive && impactor.onImpact) impactor.onImpact(t)
                }
            }
        }
        return hit
    }

}
