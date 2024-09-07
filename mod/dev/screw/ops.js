// screw vm operation codes reference table
const opsRef = [
    // mnemonics
    'neogeo',
    'drop',
    'swap',
    'mpush',
    'mpop',
    'add',
    'sub',
    'mul',
    'div',
    'precision',
    'smooth',
    'sharp',
    'mid',
    'mscale',
    'translate',
    'mrotX',
    'mrotY',
    'mrotZ',
    'reflectX',
    'reflectY',
    'reflectZ',
    'scale',
    'stretchX',
    'stretchY',
    'stretchZ',
    'tri',
    'plane',
    'cube',
    'sphere',
    'cylinder',
    'circle',
    'name',
    'brew',
    'brewWires',

    // debug ones
    'ring',
    'tetrahedron',
    'cone',
    'dump',
    'dumpv',


    // ghost codes
    // [!] not in the VMs ops manifest
    'pushs',
    'def',
    'end',

    'pushv',
]
// screw script mnemonics catalog
const mnemonics = opsRef.slice(0, opsRef.indexOf('pushs'))
