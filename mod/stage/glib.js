function zapGeoLib() {

    // compile screw source into bytecodes
    let enops = screwUp('neogeo cube 0.5 0.5 0.1 stretchZ stretchY stretchX "floppy" name brew')
    // TODO encoded ops are supposed to be prep by the toolchain
    geo.screw(enops)

    /*
    geo.gen()
        .cube()
        .pushv([.5, .5, .1])
        .stretchZ().stretchY().stretchX()
        .push('floppy').name()
        .bake()
    */
    // TODO screw MUST be called on the geo bytecodes generated in the dev toolchain
    //screwUp('neogeo cube 0.5 0.5 0.1 stretchZ stretchY stretchX "floppy" name brew')

    // TODO move to screw bytecode as well
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
    //enops = screwUp('neogeo cube 4 0.5 4 stretchX stretchY stretchZ 2 scale "cell" name brew')
    enops = screwUp('neogeo cube 4 0.5 4 stretchX stretchY stretchZ "cell" name brew')
    geo.screw(enops)

    glib.cell.bounds = vec3(s, h, s)

    if (debug) {
        enops = screwUp('neogeo 4 3 mul precision sharp sphere "smoothSphere" name brew')
        geo.screw(enops)
    }
}
