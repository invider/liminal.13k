// === geo library ===
const glib = {}, gix = []

let _gops,
    _gUV                    // enable UV generation

const geo = (() => {

// === geo state ===
let g,                      // current geo form
    x,y,z,w,                // working registers

    M = mat4.identity(),    // current geo model matrix
    P = 13,                 // current precision qualifier
    S                       // smooth flag, sharp if not set

const s = [], m = [] // value and matrix stacks

function pop() {
    if (debug) if (s.length === 0) throw 'Empty stack!'
    return s.pop()
}

// apply a function for each vertice value
function vxApply(fn) {
    for (let i = 0; i < g.v.length; i++) {
        g.v[i] = fn(g.v[i], i)
    }
}

function v3c(fn) {
    swap = true
    let bv
    const ln = g.v.length
    for (let i = 0; i < ln; i += 3) {
        const x = g.v[i], y = g.v[i+1], z = g.v[i+2]
        const v = fn(x, y, z)
        if (swap && i % 9 === 3) {
            bv = v
        } else {
            v3x(v)
            if (swap && i % 9 === 6 && bv) {
                v3x(bv)
            }
        }
    }
}

// merge x/y/z into a vec3, apply the geo matrix and push the results to vertices
function v3x(v) {
    vec3.mulM4(v, M)
    g.v.push(v[0])
    g.v.push(v[1])
    g.v.push(v[2])
}

// merge x/y/z into a vec3, apply the geo matrix and push the results to vertices
function vx(x, y, z) {
    const v = vec3(x, y, z)
    vec3.mulM4(v, M)
    g.v.push(v[0])
    g.v.push(v[1])
    g.v.push(v[2])
}

// apply geo transformations to nx before pushing in
function nx(x, y, z) {
    const v = vec3(x, y, z)
    vec3.mulM4(v, M)
    g.n.push(v[0])
    g.n.push(v[1])
    g.n.push(v[2])
}

function pV3() {
    z = pop(), y = pop(), x = pop()
    return vec3(x, y, z)
}

const ops = _gops = [
    // neogeo
    () => {
        g = {
            v: [], // vertices
            n: [], // normals
            f: [], // faces 
            c: [], // colors
            u: [], // uvs
        }
    },
    // drop
    () => { pop() },
    // swap
    () => {
        x = pop(), y = pop()
        s.push(x)
        s.push(y)
    },
    // mpush
    () => { m.push( mat4.clone(M) ) },
    // mpop
    () => { M = m.pop() },
    // add
    () => { s.push( pop() + pop() ) },
    // sub
    () => {
        x = pop()
        s.push( pop() - x )
    },
    // mul
    () => {
        s.push( pop() * pop() )
    },
    // div
    () => {
        const x = pop()
        s.push( pop() / v )
    },
    // precision
    () => { P = pop() },
    // smooth
    () => { S = 1 },
    // sharp
    () => { S = 0 },

    // === modifiers ===
    // mid - set identity matrix
    () => { M = mat4.identity() },
    // mscale
    () => { mat4.scale(M, pV3()) },
    // translate
    () => { mat4.translate(M, pV3()) },
    // mrotX
    () => { mat4.rotX(M, pop()) },
    // mrotY
    () => { mat4.rotY(M, pop()) },
    // mrotZ
    () => { mat.rotZ(M, pop()) },
    // reflectX
    () => { v3c((x, y, z) => vec3(-x, y, z)) },
    // reflectY
    () => { v3c((x, y, z) => vec3(x, -y, z)) },
    // reflectZ
    () => { v3c((x, y, z) => vec3(x, y, -z)) },
    // scale
    () => {
        x = pop()
        vxApply(n => n * x)
    },
    // stretchX
    () => {
        x = pop()
        vxApply((n, i) => (i % 3) == 0? n * x : n)
    },
    // stretchY
    () => {
        x = pop()
        vxApply((n, i) => i % 3 == 1? n * x : n)
    },
    // stretchZ
    () => {
        x = pop()
        vxApply((n, i) => i % 3 == 2? n * x : n)
    },

    // === basic geometries ===
    // tri
    () => {
        for (let i = 0; i < 9; i += 3) {
            z = pop(), y = pop(), x = pop()
            vx(x, y, z)
        }
    },
    // plane
    () => {
        g.v = g.v.concat([
            -1, 0,-1,  1, 0, 1,  1, 0,-1,    
            -1, 0,-1, -1, 0, 1,  1, 0, 1
        ])
    },

    // === complex geometries ===
    // cube
    () => {
        g.v = g.v.concat([
            // top face
            -1, 1,-1,  -1, 1, 1,   1, 1, 1,
            -1, 1,-1,   1, 1, 1,   1, 1,-1,   

            // back face
            -1,-1,-1,  -1, 1,-1,   1, 1,-1,
            -1,-1,-1,   1, 1,-1,   1,-1,-1,

            // left face
            -1,-1,-1,  -1,-1, 1,  -1, 1, 1,
            -1,-1,-1,  -1, 1, 1,  -1, 1,-1,

            // front face
            -1,-1, 1,   1,-1, 1,   1, 1, 1,
            -1,-1, 1,   1, 1, 1,  -1, 1, 1,

            // right face
            1,-1,-1,   1, 1,-1,   1, 1, 1,
            1,-1,-1,   1, 1, 1,   1,-1, 1,

            // bottom face
            -1,-1,-1,  1,-1,-1,   1,-1, 1,
            -1,-1,-1,  1,-1, 1,  -1,-1, 1,
        ])

        if (_gUV) {
            g.u = g.u.concat([
                1, 0,   1, 1,   0, 1,
                1, 0,   0, 1,   0, 0,
            ])
            // apply UVs for each face
            for (let j = 0; j < 12; j++) {
                for (let i = 0; i < 12; i++) {
                    g.u.push(g.u[i])
                }
            }
        }
        return this
    },
    // sphere
    () => {
        const v = [], w = []

        for (let lat = 0; lat <= P; lat++) {
            let theta = (lat * PI) / P,
                cost = cos(theta),
                sint = sin(theta)

            for (let lon = 0; lon < P; lon++) {
                let phi = (lon * PI2) / P,
                    cosp = cos(phi),
                    sinp = sin(phi)
                    v.push(
                        cosp * sint,  // x
                        cost,         // y
                        sinp * sint   // z
                    )
            }
        }

        for (let lat = 0; lat < P; lat++) {
            for (let lon = 0; lon < P; lon++) {
                
                let base = lat * P 
                    base2 = ((lat + 1)) * P 
                    nextLon = (lon + 1) % P 
                    at = (base + lon) * 3,
                    at2 = (base + nextLon) * 3
                    at3 = (base2 + lon) * 3
                    at4 = (base2 + nextLon) * 3

                w.push(
                    v[at], v[at+1], v[at+2],
                    v[at2], v[at2+1], v[at2+2],
                    v[at3], v[at3+1], v[at3+2],

                    v[at2], v[at2+1], v[at2+2],
                    v[at4], v[at4+1], v[at4+2],
                    v[at3], v[at3+1], v[at3+2],
                )
            }
        }
        g.v = g.v.concat(w)
    },
    // cylinder
    () => {
        const v = [], w = []

        for (let lon = 0; lon < P; lon++) {
            let phi = (lon * PI2) / P,
                c = cos(phi),
                s = sin(phi)
            v.push(c, 1, s)
        }

        for (let lon = 0; lon < P; lon++) {

                let at = lon * 3,
                    at2 = ((lon + 1) % P) * 3

                w.push(
                    v[at],   1,  v[at+2],
                    v[at2],  1,  v[at2+2],
                    v[at],  -1,  v[at+2],

                    v[at2],  1,  v[at2+2],
                    v[at2], -1,  v[at2+2],
                    v[at],  -1,  v[at+2],

                    v[at],   1,  v[at+2],
                    0,       1,  0,
                    v[at2],  1,  v[at2+2],

                    v[at2], -1,  v[at2+2],
                    0,      -1,  0,
                    v[at],  -1,  v[at+2]
                )
        }
        g.v = g.v.concat(w)
    },
    // circle
    () => {
        const v = [], w = []

        for (let lon = 0; lon < P; lon++) {
            let phi = (lon * PI2) / P,
                c = cos(phi),
                s = sin(phi)
            v.push(c, 1, s)
        }

        for (let lon = 0; lon < P; lon++) {
                let at = lon * 3,
                    at2 = ((lon + 1) % P) * 3

                w.push(
                    v[at2], 0,  v[at2+2],
                    0,      0,  0,
                    v[at],  0,  v[at+2]
                )
        }
        g.v = g.v.concat(w)
        return this
    },

    // === finalizer ===
    // name
    () => { g.name = pop() },
    // brew
    () => {
        // normalize
        g.v = new Float32Array(g.v)
        g.vc = g.v.length / 3

        // wireframe points
        g.w = []
        for (let i = 0; i < g.v.length; i += 9) {
            let v1 = vec3.fromArray(g.v, i),
                v2 = vec3.fromArray(g.v, i+3),
                v3 = vec3.fromArray(g.v, i+6)
            vec3.push(g.w, v1).push(g.w, v2)
                .push(g.w, v2).push(g.w, v3)
                .push(g.w, v3).push(g.w, v1)
        }
        g.w = new Float32Array(g.w)

        if (g.u.length > 0) g.u = new Float32Array(g.u)
        else g.u = null

        if (g.c.length > 0) g.c = new Float32Array(g.c)
        else g.c = null

        if (g.f.length === 0) {
            g.f = null
        } else {
            g.f = new Uint16Array(g.f)
            g.fc = g.f.length
        }

        if (g.n.length === 0) {
            g.n = new Float32Array( calcNormals(g.v, S) ) 
        } else {
            g.n = new Float32Array(g.n) 
        }

        // DEBUG vertex stat
        if (debug) {
            if (!this.vc) this.vc = 0
            this.vc += g.vc

            if (!this.pc) this.pc = 0
            this.pc += g.vc / 3

            if (!this.gc) this.gc = 0
            this.gc ++

            env.dump['Geometry Library'] = `${this.gc} (${this.pc} polygons)`
        }

        gix.push(g)
        if (g.name) glib[g.name] = g
        brews.push(g)
    },
    // brewWires
    () => {
        g.w = new Float32Array(g.v)
        g.w.vc = g.v.length / 3
        delete g.v
    },
]

// === SCREW VM ===
let def = {}, brews = []

// emu modes
const
      EMOD = 0,
      DMOD = 1

function unscrewRune(r) {
    let n = r.charCodeAt(0)
    if (debug) if (n > 196) throw `Corrupted rune: [${r}]`
    if (n > 96) n--
    if (n > 92) n--
    return n - 32
}

function unscrewNumber(n) {
    if (n > 41) n -= 92
    return n/10
}

function unscrewOpcodes(rawcodes) {
    const opcodes = rawcodes.map(r => unscrewRune(r))
    opcodes.raw = rawcodes
    return opcodes
}

/*
// TODO
function rerr(msg) {
    throw new Error(`Screw Runtime Error: ${msg}`)
}
function defineWords(ops) {
    let st = EMOD, word
    const rops = []

    for (let i = 0; i < ops.length; i++) {
        const op = ops[i]
        if (st) {
            // do definition
            if (op.t === END) {
                st = EMOD
            } else if (op.t === DEF) {
                rerr(`Can't define a word [${op.v}] inside another word!`)
            } else {
                word.push(op)
            }
        } else {
            // filter define and runtime ops
            switch(op.t) {
                case DEF:
                    st = DMOD
                    word = []
                    word.name = op.v
                    def[op.v] = word
                    break
                case END:
                    rerr(`Unexpected end of a definition`)
                    break
                default:
                    rops.push(op)
            }
        }
    }
    return rops
}
*/

const PUSHS = 39,
      PUSHV = 42

function exec(opcodes) {
    const len = opcodes.length
    let op, i = 0, n, buf
    try {
        while (i < len) {
            op = opcodes[i++]

            switch(op) {
                case PUSHS:
                    buf = []
                    n = opcodes[i++]
                    for (let j = 0; j < n; j++) buf.push(opcodes.raw[i++])
                    s.push(buf.join(''))
                    break

                //case PUSHV:
                //    s.push(unscrewNumber(opcodes[i++]))
                //    break
                default:
                    if (op >= PUSHV) {
                        let o = op - PUSHV,
                            x = floor(o / 4) + 1,
                            t = o % 4,
                            c = 92 ** x

                        let n = opcodes[i++]
                        for (let i = 1; i < x; i++) {
                            n = n * 92 + opcodes[i++]
                        }
                        if (n >= floor(c/2)) n -= c
                        s.push(n / (10**t))
                        //if (n > 41) n -= 92
                        //return n/10
                            
                    } else {
                        if (debug) {
                            const fn = ops[op]
                            if (!fn) throw `no function for op [${op}] - [${opsRef[op]}]`
                        }
                        ops[op]()
                    }
            }
        }
    } catch(e) {
        log(`@${i-1}: #${op}`)
        log(opcodes.raw.join(''))
        console.dir(opcodes)
        log(opcodes.map(op => opsRef[op]).join('\n'))
        throw e
    }
    return brews
}

function resetEmuState() {
    defs = {}
    brews = []
}

function screw(enops) {
    resetEmuState()
    return exec( unscrewOpcodes( enops.split('') ) )
}

function screwOne(enops) {
    return screw(enops).pop()
}

if (debug) {
    return {
        screw,
        screwOne,
        cg: () => g,
        cM: () => M,
        cs: () => s,
    }
} else {
    return {
        screw,
        screwOne
    }
}

})()
