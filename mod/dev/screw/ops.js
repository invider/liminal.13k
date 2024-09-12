// screw vm operation codes reference table
const opsRef = [
    // mnemonics
    'neogeo',
    //'drop',
    //'swap',
    'mpush',
    'mpop',
    'buf',
    'unbuf',
    'HPI',
    //'add',
    //'sub',
    //'mul',
    //'div',
    'precision',
    //'smooth',
    //'sharp',
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
    'stretch',
    'tri',
    'tuv',
    'mt',           // define the material
    //'plane',
    //'sphere',
    //'cylinder',
    'circle',

    'bounds',
    'dat',
    'name',
    'brew',
    //'brewWires',

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
    'call',

    'push1i',
    'push1f',
    'push1d',
    'push1u',

    'push2i',
    'push2f',
    'push2d',
    'push2u',

    'push3i',
    'push3f',
    'push3d',
    'push3u',

    'push4i',
    'push4f',
    'push4d',
    'push4u',

    'push1iv',
    'push1fv',
    'push1dv',
    'push1uv',

    'push2iv',
    'push2fv',
    'push2dv',
    'push2uv',

    'push3iv',
    'push3fv',
    'push3dv',
    'push3uv',

    'push4iv',
    'push4fv',
    'push4dv',
    'push4uv',
]
// screw script mnemonics catalog
const mnemonics = opsRef.slice(0, opsRef.indexOf('pushs'))

if (typeof module !== 'undefined') {
    module.exports = {
        opsRef,
        mnemonics,
    }
}
