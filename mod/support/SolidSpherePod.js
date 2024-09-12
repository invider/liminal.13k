class SolidSpherePod {

    constructor(st) {
        extend(this, {
            type: HIT_SPHERE,
            r: 1,
            pos: vec3(0, 0, 0),
        }, st)
    }

    init() {
        this.__.solid = this
    }

    fixBounds() {
        // TODO apply parent model matrix on .pos
        this.wpos = vec3.clone(this.pos)
        vec3.add(this.wpos, this.__.pos)
    }
}
