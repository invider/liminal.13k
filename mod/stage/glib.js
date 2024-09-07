function zapGeoLib() {
    /*
    geo.gen()
        .cube()
        .pushv([.5, .5, .1])
        .stretchZ().stretchY().stretchX()
        .push('floppy').name()
        .bake()
    */
    screw('gen cube 0.5 0.5 0.1 stretchZ stretchY stretchX "floppy" name brew')
    glib.floppy.bounds = vec3(1.5, 1.5, 1)

    /*
    geo.gen().cube()
        .pushv([s, h, s])
        .stretchX()
        .stretchY()
        .stretchZ()
        .push('cell').name()
        .bake()
    */
    const s =  CELL_HSIZE, // block half-size
          h =  1
    screw('gen cube 8 1 8 stretchX stretchY stretchZ "cell" name brew')
    glib.cell.bounds = vec3(s, h, s)

    if (debug) {
        this._sphereMesh = geo.gen().push(12).precision().sphere().sharp().push('smoothSphere').name().bake()
    }
}
