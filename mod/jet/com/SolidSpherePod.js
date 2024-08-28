class SolidSpherePod {

    constructor(st) {
        extend(this, {
            r: 1,
            pos: vec3(0, 0, 0),
        }, st)
    }

    init() {
        this.__.solid = this
    }

    impact(src) {
        this.__.onImpact(src)
    }

    place() {
        // TODO apply parent model matrix on .pos
        this.wpos = vec3.clone(this.pos)
        vec3.add(this.wpos, this.__.pos)
    }
}
