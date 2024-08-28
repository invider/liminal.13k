function parseObj(data) {
    log('trying to parse...')

    function doLine(line, args) {
        switch(args[0]) {
            case 'v':
                geo.vertices([
                    parseFloat(args[1]),
                    parseFloat(args[2]),
                    parseFloat(args[3])
                ])
                break
            case 'f':
                geo.faces([
                    parseInt(args[1]),
                    parseInt(args[2]),
                    parseInt(args[3])
                ])
                break
            default:
                log(`unknown command: [${line}]`)
        }
    }

    geo.gen()
    data.split('\n')
        .map(l => l.trim())
        .filter(l => !l.startsWith('#') && l.length !== 0)
        .forEach(line => doLine(line, line.split(' ')))

    return geo.bake()
}
