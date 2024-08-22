const debug = 1

let nfps = 0
const ifps = []

const flags = {},
    FORWARD  = 1,
    LEFT     = 2,
    BACKWARD = 3,
    RIGHT    = 4,
    UP       = 5,
    DOWN     = 6


const env = {
    time: 0,
    fps: 60,

    bind: [
        '',
        'KeyW',
        'KeyA',
        'KeyS',
        'KeyD',
        'KeyE',
        'KeyC',
        // ...
    ],

    status: '',
    tag: 'debug',
    dump: {},
}

