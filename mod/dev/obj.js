function parseObj(data) {

    function doLine(line, args) {
        switch(args[0]) {
            case 'o':
                // TODO assume just one object for now
                geo.name(args[1])
                break

            case 'v':
                const x = parseFloat(args[1]),
                      y = parseFloat(args[2]),
                      z = parseFloat(args[3])
                geo.v([ x, y, z ])
                break
            case 'f':
                // .obj support not only triangles
                // so need to repackage if we have more vertices indexed (e.g. for a quad)
                if (args[1].indexOf('/') >= 0) {
                    for (let i = 1; i < args.length; i++) {
                        const face = args[i].split('/')
                        face.forEach(f => geo.faces([ parseInt(f) - 1 ]))
                        // TODO parse only the first one for now
                        //geo.faces([ parseInt(face[0]) - 1 ])
                    }
                } else {
                    geo.faces([
                        parseInt(args[1]) - 1,
                        parseInt(args[2]) - 1,
                        parseInt(args[3]) - 1
                    ])
                }
                break
            case 'vn':
                geo.normals([
                    parseFloat(args[1]),
                    parseFloat(args[2]),
                    parseFloat(args[3])
                ])
                break

            case 'vt':
                geo.uvs([
                    parseInt(args[1]),
                    parseInt(args[2]),
                ])
                break

            default:
                log(`unknown command: [${line}]`)
                console.dir(args)
        }
    }

    geo.gen()
    data.split('\n')
        .map(l => l.trim())
        .filter(l => !l.startsWith('#') && l.length !== 0) // filter out comments and empty lines
        .forEach(line => doLine(line, line.split(/\s+/)))

    return geo.bake()
}


function parseJsonModel(data) {
    geo.gen()
    geo.v( data.vertexPositions )
    geo.n( data.vertexNormals ) // TODO something wrong with how we apply normals
    geo.u( data.vertexTextureCoords )
    geo.f( data.indices)

    return geo.bake()
}
