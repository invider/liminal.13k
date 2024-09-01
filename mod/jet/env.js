const debug = 1

let nfps = 0
const ifps = []

const flags = {},
    // keyboard controls
    FORWARD      = 1,
    STRAFE_LEFT  = 2,
    BACKWARD     = 3,
    STRAFE_RIGHT = 4,
    FLY_UP       = 5,
    FLY_DOWN     = 6,
    LOOK_UP      = 7,
    LOOK_LEFT    = 8,
    LOOK_DOWN    = 9,
    LOOK_RIGHT   = 10,
    ROLL_LEFT    = 11,
    ROLL_RIGHT   = 12,
    JUMP         = 13,
    // special
    USE          = 14,
    // mouse controls
    SHIFT_YAW    = 21,
    SHIFT_PITCH  = 22,
    SHIFT_ROLL   = 23,

    // colliders
    HIT_BOX       = 1,
    HIT_SPHERE    = 2,
    EPHEMERAL     = 0,
    HARD          = 1

const env = {
    time: 0,
    fps: 60,

    // DEBUG
    //groundLevel:    1,
    //showHitboxes:   1,

    bind: [
        '',
        // movement controls
        'KeyW',        // 1..4 - WASD movements
        'KeyA',
        'KeyS',
        'KeyD',
        'KeyE',        // 5-6 - fly up and down 
        'KeyC',        
        'ArrowUp',     // 7  - look up
        'ArrowLeft',   // 8  - turn left
        'ArrowDown',   // 9  - look down
        'ArrowRight',  // 10 - turn right
        'Delete',      // 11 - roll left
        'PageDown',    // 12 - roll right
        'Space',       // 13 - jump

        'Enter',       // 14 - use

        // ...
    ],

    directionalLightVector: vec3(1, -.5, .7),
    directionalLightColorI: vec4(1, 1, 1, .8),
    //directionalLightVector: vec4(0, 0, 1, 1),
    
    pointLightPosition: vec3(0, 10, 0),
    pointLightColorI: vec4(1, 1, 1, .7),

    backfaces: true,
}

if (debug) {
    env.stat = {}
    env.dump = {}
    env.tag = '=== debug ==='
}
