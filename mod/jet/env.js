const debug = 1

let nfps = 0
const ifps = []

const flags = {},
    // keyboard controls
    FORWARD    = 1,
    LEFT       = 2,
    BACKWARD   = 3,
    RIGHT      = 4,
    UP         = 5,
    DOWN       = 6,
    LOOK_UP    = 7,
    LOOK_LEFT  = 8,
    LOOK_DOWN  = 9,
    LOOK_RIGHT = 10,
    ROLL_LEFT  = 11,
    ROLL_RIGHT = 12,
    // mouse controls
    SHIFT_YAW   = 21,
    SHIFT_PITCH = 22,
    SHIFT_ROLL  = 23

const env = {
    time: 0,
    fps: 60,

    bind: [
        '',
        // movement controls
        'KeyW',        // 1
        'KeyA',
        'KeyS',
        'KeyD',
        'KeyE',
        'KeyC',
        'ArrowUp',
        'ArrowLeft',   // 8
        'ArrowDown',
        'ArrowRight',
        'PageUp',      // 11
        'PageDown',

        // ...
    ],

    directionalLightVector: vec3(-1, -1, -1),
    directionalLightColorI: vec4(1, 1, 1, .2),
    //directionalLightVector: vec4(0, 0, 1, 1),
    
    pointLightPosition: vec3(0, 10, 0),
    pointLightColorI: vec4(1, 1, 1, 1),

    backfaces: true,

    // TODO should be set by the HUD node
    status: '',
    tag: 'debug',
    dump: {},
}
