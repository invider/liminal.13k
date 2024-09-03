const collidableTrait = {

    collide: function(impactor, mv) {
        let hit = HIT_NONE
        const ls = this._ls
        const n = ls.length
        for (let i = n - 1; i >= 0; --i) {
            const t = ls[i]
            if (t.collide) {
                const cl = t.collide(impactor, mv)
                if (!hit) hit = cl
            } else if (!t.dead && t.solid && t.solid !== impactor) {
                if (t.solid.touch(impactor)) {
                    // test if the touch is hard or ephemeral
                    if (t.solid.kind) {
                        hit = HIT_HARD // got a hard collision
                    }
                    if (t.onTouch) t.onTouch(impactor.__)
                    if (t.reactive && impactor.__.onImpact) impactor.__.onImpact(t)
                }
            }
        }
        return hit
    }

}
