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
    ZOOM_Y       = 24,

    // collider bounding volumes
    HIT_BOX       = 1,
    HIT_SPHERE    = 2,
    // collider kinds
    EPHEMERAL     = 0,
    HARD          = 1,
    // collision types
    HIT_NONE      = 0,
    HIT_STEP      = 1,
    HIT_HARD      = 2,

    N             = 1,
    W             = 2,
    S             = 3,
    E             = 4,

    // respawn modes
    RESPAWN_GAME  = 0, // full restart of the run
    RESPAWN_ZERO  = 1, // respawn at the starting point
    RESPAWN_LAST  = 2  // respawn on the last platform


const env = {
    time: 0,
    fps: 60,

    vol: .2,

    // #0f20e1
    clearColor: rgba('200725FF'),
    fogColor:   rgba('251230FF'),

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
    resetMode: RESPAWN_LAST,
}

if (debug) {
    env.stat = {}
    env.dump = {}
    env.tag = '=== debug ==='
}
