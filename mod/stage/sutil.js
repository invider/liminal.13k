function dirDX(dir) {
    switch(dir) {
        case W: return -1
        case E: return  1
    }
    return 0
}

function dirDZ(dir) {
    switch(dir) {
        case N: return -1
        case S: return  1
    }
    return 0
}

function dumpPS(p, hs) {
    return (p.join(',') + ' --- ' + hs.join(','))
}

