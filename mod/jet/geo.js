// === geo library ===
const glib = {}, gix = []

let _gUV                    // enable UV generation

const geo = (() => {

// === geo state ===
let g,                      // current geo form
    x,y,z,w,                // working registers

    M = mat4.identity(),    // current geo model matrix
    P = 13,                 // current precision qualifier
    S                       // smooth flag, sharp if not set

let s = [], m = [], b = [] // value and matrix stacks

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

// apply function to x/y/z vertex tripplets
function v3c(fn) {
    let swap = true, bv, ln = g.v.length
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

// apply current model matrix to provided array and push values
function wM(w) {
    for (let i = 0; i < w.length; i += 3) {
        v3x(vec3(w[i], w[i+1], w[i+2]))
    }
}

// apply the geo matrix to vec3 and push the results to vertices
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

// pop vec3 from the stack
function pv3() {
    z = pop(), y = pop(), x = pop()
    return vec3(x, y, z)
}

const ops = [
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
    // buf - current geometry
    () => {
        b = g.v
        g.v = []
    },
    // unbuf
    () => { wM(b) },
    // HPI
    () => { s.push( PI/2 ) },
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
        s.push( pop() / x )
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
    () => { mat4.scale(M, pv3()) },
    // translate
    () => { mat4.translate(M, pv3()) },
    // mrotX
    () => { mat4.rotX(M, pop()) },
    // mrotY
    () => { mat4.rotY(M, pop()) },
    // mrotZ
    () => { mat4.rotZ(M, pop()) },
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
    // stretch
    () => {
        z = pop()
        y = pop()
        x = pop()
        vxApply((n, i) => i % 3 == 2? n * z : n)
        vxApply((n, i) => i % 3 == 1? n * y : n)
        vxApply((n, i) => (i % 3) == 0? n * x : n)
    },

    // geometry assemblers
    // tri - define a triangle vertex set
    () => {
        for (let i = 0; i < 9; i += 3) {
            z = pop(), y = pop(), x = pop()
            vx(x, y, z)
        }
    },
    // tuv - define a uv coordinates set for the triangle
    () => {
        for (let i = 0; i < 6; i += 2) {
            y = pop()
            g.u.push( pop() )
            g.u.push(y)
        }
    },

    // === basic geometries ===
    // plane
    () => {
        g.v = g.v.concat([
            -1, 0,-1,  1, 0, 1,  1, 0,-1,    
            -1, 0,-1, -1, 0, 1,  1, 0, 1
        ])
    },

    // === complex geometries ===
    /*
    // cube
    () => {
        w = [
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
        ]
        wM(w)

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
    */
    /*
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
                
                let base = lat * P,
                    base2 = ((lat + 1)) * P,
                    nextLon = (lon + 1) % P,
                    at = (base + lon) * 3,
                    at2 = (base + nextLon) * 3,
                    at3 = (base2 + lon) * 3,
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
    */
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
        wM(w)
        //g.v = g.v.concat(w)
        return this
    },

    // === finalizer ===
    // bounds
    () => { g.bounds = pv3() },
    // name
    () => { g.name = pop() },
    // brew
    () => {
        // normalize
        g.v = new Float32Array(g.v)
        g.vc = g.v.length / 3

        /*
        // DEBUG - generate wireframe points
        // wireframe points
        g.w = []
        for (let i = 0; i < g.v.length; i += 9) {
            let v1 = vec3.fromArray(g.v, i),
                v2 = vec3.fromArray(g.v, i+3),
                v3 = vec3.fromArray(g.v, i+6)
            //vec3.push(g.w, v1).push(g.w, v2)
            //    .push(g.w, v2).push(g.w, v3)
            //    .push(g.w, v3).push(g.w, v1)
            vec3.push(g.w, v1)
            vec3.push(g.w, v2)
            vec3.push(g.w, v2)
            vec3.push(g.w, v3)
            vec3.push(g.w, v3)
            vec3.push(g.w, v1)
        }
        g.w = new Float32Array(g.w)
        */

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
let def = {}, cdef, brews = []

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

// HOWTO introduce a new op
//       * include the operator function into the ops array in geo
//       * insert the op name in the opsRef manifest at the matching position (== ops array index)
//       * bump ghost opcodes limit to match PUSHS opcode index
//       * don't forget to recompile existing snapshots with ./compile-s!
const PUSHS = 39,
      DEF   = PUSHS + 1,
      END   = PUSHS + 2,
      CALL  = PUSHS + 3,
      PUSHV = PUSHS + 4

function exec(opcodes) {
    const len = opcodes.length
    let op, i = 0, n, buf
    // DEBUG vm
    try {
        while (i < len) {
            op = opcodes[i++]

            if (cdef) {
                // in definition mode
                if (op === END) {
                    // definition is done
                    cdef = null
                } else {
                    cdef.push(op)
                    cdef.raw.push(opcodes.raw[i-1])
                }
            } else {
                switch(op) {
                    case PUSHS:
                        buf = []
                        n = opcodes[i++]
                        for (let j = 0; j < n; j++) buf.push(opcodes.raw[i++])
                        s.push(buf.join(''))
                        break

                    case DEF:
                        log(`new definition #` + def.length)
                        cdef = []
                        cdef.raw = []
                        def.push(cdef)
                        break

                    case CALL:
                        x = pop()
                        log(`calling #${x}, opcodes: ${def[x].raw.join('')}`)
                        console.dir( def[x] )
                        exec( def[x] )
                        break

                    //case PUSHV:
                    //    s.push(unscrewNumber(opcodes[i++]))
                    //    break
                    default:
                        if (op >= PUSHV) {
                            let o = op - PUSHV,
                                x = floor(o / 4) + 1,
                                t = o % 4,
                                c = 93 ** x

                            let n = opcodes[i++]
                            for (let j = 1; j < x; j++) {
                                n = n + (93 ** j) * opcodes[i++]
                            }
                            if (n >= floor(c/2)) n -= c
                            s.push(n / (10**t))
                            //if (n > 41) n -= 92
                            //return n/10
                                
                        } else {
                            // DEBUG vm
                            if (debug) {
                                const fn = ops[op]
                                if (!fn) throw `no function for op [${op}] - [${opsRef[op]}]`
                            }
                            ops[op]()
                        }
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
    def = []
    brews = []
}

function unscrew(enops) {
    // if (debug) log(`unscrewing:[${enops}](${enops.length})`)
    resetEmuState()
    return exec( unscrewOpcodes( enops.split('') ) )
}

if (debug) {

    function unscrewOne(enops) {
        return unscrew(enops).pop()
    }

    extend(unscrew, {
        unscrewOne,
        ops,
        cg: () => g,
        cM: () => M,
        cs: () => s,
        reset: () => {
            M = mat4.identity(),    // current geo model matrix
            // clean stacks
            s = []
            m = []
        },
    })
    return unscrew

} else {
    return unscrew
}

})()
