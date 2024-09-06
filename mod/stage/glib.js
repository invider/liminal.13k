function zapGeoLib() {
    geo.gen()
        .cube()
        .pushv([.5, .5, .1])
        .stretchZ().stretchY().stretchX()
        .push('floppy').name()
        .bake()
    glib.floppy.bounds = vec3(1.5, 1.5, 1)

    const s =  CELL_HSIZE, // block half-size
          h =  1
    geo.gen().cube()
        .pushv([s, h, s])
        .stretchX()
        .stretchY()
        .stretchZ()
        .push('cell').name()
        .bake()
    glib.cell.bounds = vec3(s, h, s)
}
