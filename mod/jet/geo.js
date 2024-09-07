// === geo library ===
const glib = {}, gix = []

const geo = (() => {

// === geo state ===
let g,                      // current geo form
    x,y,z,w,                // working registers

    gSpherePrecision = 25,
    gSmooth,
    gMatrix = mat4.identity()
    gUV = 0 // enable UV mapping experiment?

const stack = [], mstack = [] // value and matrix stacks

function pop() {
    if (debug) if (stack.length === 0) throw 'Empty stack'
    return stack.pop()
}

function vxApply(fn) {
    for (let i = 0; i < g.vertices.length; i++) {
        g.vertices[i] = fn(g.vertices[i], i)
    }
}

function v3Clone(fn) {
    swap = true
    let bv
    const ln = g.vertices.length
    for (let i = 0; i < ln; i += 3) {
        const x = g.vertices[i], y = g.vertices[i+1], z = g.vertices[i+2]
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
    vec3.mulM4(v, _gMatrix)
    g.vertices.push(v[0])
    g.vertices.push(v[1])
    g.vertices.push(v[2])
}

// merge x/y/z into a vec3, apply the geo matrix and push the results to vertices
function vx(x, y, z) {
    const v = vec3(x, y, z)
    vec3.mulM4(v, _gMatrix)
    g.vertices.push(v[0])
    g.vertices.push(v[1])
    g.vertices.push(v[2])
}

// apply geo transformations to nx before pushing in
function nx(x, y, z) {
    const v = vec3(x, y, z)
    vec3.mulM4(v, _gMatrix)
    g.normals.push(v[0])
    g.normals.push(v[1])
    g.normals.push(v[2])
}

function popV3() {
    z = pop(), y = pop(), x = pop()
    return vec3(x, y, z)
}

const ops = [
    // neogeo
    () => {
        g = {
            vertices: [],
            normals:  [],
            faces:    [],
            colors:   [],
            uvs:      [],
        }
    },
    // drop
    () => { pop() },
    // swap
    () => {
        x = pop(), y = pop()
        stack.push(x)
        stack.push(y)
    },
    // mpush
    () => { mstack.push( mat4.clone(gMatrix) ) },
    // mpop
    () => { gMatrix = mstack.pop() },
    // add
    () => { stack.push( pop() + pop() ) },
    // sub
    () => {
        x = pop()
        stack.push( pop() - x )
    },
    // mul
    () => {
        stack.push( pop() * pop() )
    },
    // div
    () => {
        const x = pop()
        stack.push( pop() / v )
    },
    // precision
    () => { gSpherePrecision = pop() },
    // smooth
    () => { gSmooth = 1 },
    // sharp
    () => { gSmooth = 0 },

    // === modifiers ===
    // mid - set identity matrix
    () => { _gMatrix = mat4.identity() },
    // mscale
    () => { mat4.scale(_gMatrix, popV3()) },
    // translate
    () => { mat4.translate(_gMatrix, popV3()) },
    // mrotX
    () => { mat4.rotX(_gMatrix, pop()) },
    // mrotY
    () => { mat4.rotY(_gMatrix, pop()) },
    // mrotZ
    () => { mat.rotZ(_gMatrix, pop()) },
    // reflectX
    () => { v3Clone((x, y, z) => vec3(-x, y, z)) },
    // reflectY
    () => { v3Clone((x, y, z) => vec3(x, -y, z)) },
    // reflectZ
    () => { v3Clone((x, y, z) => vec3(x, y, -z)) },
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
        g.vertices = g.vertices.concat([
            -1, 0,-1,  1, 0, 1,  1, 0,-1,    
            -1, 0,-1, -1, 0, 1,  1, 0, 1
        ])
    },

    // === complex geometries ===
    // cube
    () => {
        g.vertices = g.vertices.concat([
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

        if (gUV) {
            g.uvs = g.uvs.concat([
                1, 0,   1, 1,   0, 1,
                1, 0,   0, 1,   0, 0,
            ])
            // apply uvs for each face
            for (let j = 0; j < 12; j++) {
                for (let i = 0; i < 12; i++) {
                    g.uvs.push(g.uvs[i])
                }
            }
        }
        return this
    },
    // tetrahedron
    () => {
        g.vertices = g.vertices.concat([
            -1, 1,-1,   -1,-1, 1,   1, 1, 1,
             1, 1, 1,    1,-1,-1,  -1, 1,-1, 
            -1,-1, 1,    1,-1,-1,   1, 1, 1,
            -1, 1,-1,    1,-1,-1,  -1,-1, 1,
        ])
    },
    // sphere
    () => {
        const v = [], w = []

        for (let lat = 0; lat <= gSpherePrecision; lat++) {
            let theta = (lat * PI) / gSpherePrecision,
                cost = cos(theta),
                sint = sin(theta)

            for (let lon = 0; lon < gSpherePrecision; lon++) {
                let phi = (lon * PI2) / gSpherePrecision,
                    cosp = cos(phi),
                    sinp = sin(phi)
                    v.push(
                        cosp * sint,  // x
                        cost,         // y
                        sinp * sint   // z
                    )
            }
        }

        for (let lat = 0; lat < gSpherePrecision; lat++) {
            for (let lon = 0; lon < gSpherePrecision; lon++) {
                
                let base = lat * gSpherePrecision
                    base2 = ((lat + 1)) * gSpherePrecision
                    nextLon = (lon + 1) % gSpherePrecision
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
        g.vertices = g.vertices.concat(w)
    },
    // cylinder
    () => {
        const v = [], w = []

        for (let lon = 0; lon < gSpherePrecision; lon++) {
            let phi = (lon * PI2) / gSpherePrecision,
                c = cos(phi),
                s = sin(phi)
            v.push(c, 1, s)
        }

        for (let lon = 0; lon < gSpherePrecision; lon++) {

                let at = lon * 3,
                    at2 = ((lon + 1) % gSpherePrecision) * 3

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
        g.vertices = g.vertices.concat(w)
    },
    // cone
    () => {
        const v = [], w = []

        for (let lon = 0; lon < gSpherePrecision; lon++) {
            let phi = (lon * PI2) / gSpherePrecision,
                c = cos(phi),
                s = sin(phi)
            v.push(c, 1, s)
        }

        for (let lon = 0; lon < gSpherePrecision; lon++) {

                let at = lon * 3,
                    at2 = ((lon + 1) % gSpherePrecision) * 3

                w.push(
                    0,  1,  0,
                    v[at2], -1,  v[at2+2],
                    v[at],  -1,  v[at+2],

                    v[at2], -1,  v[at2+2],
                    0,      -1,  0,
                    v[at],  -1,  v[at+2]
                )
        }
        g.vertices = g.vertices.concat(w)
    },
    // circle
    () => {
        const v = [], w = []

        for (let lon = 0; lon < gSpherePrecision; lon++) {
            let phi = (lon * PI2) / gSpherePrecision,
                c = cos(phi),
                s = sin(phi)
            v.push(c, 1, s)
        }

        for (let lon = 0; lon < gSpherePrecision; lon++) {
                let at = lon * 3,
                    at2 = ((lon + 1) % gSpherePrecision) * 3

                w.push(
                    v[at2], 0,  v[at2+2],
                    0,      0,  0,
                    v[at],  0,  v[at+2]
                )
        }
        g.vertices = g.vertices.concat(w)
        return this
    },
    // ring
    () => {
        const ir = pop(), v = [], w = []

        for (let lon = 0; lon < gSpherePrecision; lon++) {
            let phi = (lon * PI2) / gSpherePrecision,
                c = cos(phi),
                s = sin(phi)
            v.push(c, 1, s)
        }

        for (let lon = 0; lon < gSpherePrecision; lon++) {

                let at = lon * 3,
                    at2 = ((lon + 1) % gSpherePrecision) * 3

                w.push(
                    v[at2],    0,  v[at2+2],
                    v[at],     0,  v[at+2], 
                    v[at2]*ir, 0,  v[at2+2]*ir,

                    v[at],     0,  v[at+2],
                    v[at]*ir,  0,  v[at+2]*ir,
                    v[at2]*ir, 0,  v[at2+2]*ir

                    /*
                    v[at]*ir,  0,  v[at]*ir,
                    v[at],     0,  v[at],
                    v[at2]*ir, 0,  v[at2]*ir,

                    v[at2]*ir, 0,  v[at2]*ir,
                    v[at],     0,  v[at],
                    v[at2],    0,  v[at2]
                    */
                )
        }
        g.vertices = g.vertices.concat(w)
    },

    // === finalizer ===
    // name
    () => { g.name = pop() },
    // brew
    () => {
        // normalize
        g.vertices = new Float32Array(g.vertices)
        g.vertCount = g.vertices.length / 3

        // wireframe points
        g.wires = []
        for (let i = 0; i < g.vertices.length; i += 9) {
            let v1 = vec3.fromArray(g.vertices, i),
                v2 = vec3.fromArray(g.vertices, i+3),
                v3 = vec3.fromArray(g.vertices, i+6)
            vec3.push(g.wires, v1).push(g.wires, v2)
                .push(g.wires, v2).push(g.wires, v3)
                .push(g.wires, v3).push(g.wires, v1)
        }
        g.wires = new Float32Array(g.wires)

        if (g.uvs.length > 0) {
            g.uvs = new Float32Array(g.uvs)
        } else {
            g.uvs = null
        }

        if (g.colors.length > 0) {
            g.colors = new Float32Array(g.colors)
        } else {
            g.colors = null
        }

        if (g.faces.length === 0) {
            g.faces = null
        } else {
            g.faces = new Uint16Array(g.faces)
            g.facesCount = g.faces.length
        }

        if (g.normals.length === 0) {
            g.autocalcNormals = true
            g.normals = new Float32Array( calcNormals(g.vertices, gSmooth) ) 
        } else {
            g.normals = new Float32Array(g.normals) 
        }

        // DEBUG vertex stat
        if (debug) {
            if (!this.vertexCount) this.vertexCount = 0
            this.vertexCount += g.vertCount

            if (!this.polygonCount) this.polygonCount = 0
            this.polygonCount += g.vertCount / 3

            if (!this.geoCount) this.geoCount = 0
            this.geoCount ++

            env.dump['Geometry Library'] = `${this.geoCount} (${this.polygonCount} polygons)`
        }

        gix.push(g)
        if (g.name) glib[g.name] = g
    },
    // brewWires
    () => {
        g.wires = new Float32Array(g.vertices)
        g.wires.vertCount = g.vertices.length / 3
        delete g.vertices
    },

]

if (debug) {
    // dump

    ops.push(() => {
        const b = []

        b.push('=== matrix ===\n')
        _gMatrix.forEach((v, i) => {
            b.push(v)
            b.push('  ')
            if (i % 4 === 3) b.push('\n')
        })

        b.push('\n=== stack ===\n')
        stack.forEach((v, i) => {
            b.push(v)
            b.push('  ')
            if (i % 3 === 2) b.push('\n')
        })

        console.dir(stack)
        console.dir(_gMatrix)
        const d = b.join('')
        console.log(d)
        term.println('\n' + d)
    })

    // dumpv
    ops.push(() => {
        const b = []

        b.push('\n=== verteces ===\n')
        _g.vertices.forEach((v, i) => {
            b.push(v)
            b.push('  ')
            if (i % 9 === 8) b.push('\n')
            else if (i % 3 === 2) b.push('    ')
        })

        const d = b.join('')
        console.dir(_g.vertices)
        console.log(d)
        term.println('\n' + d)
    })
}


/*
// op types
const END  = 0,
      DEF  = 1,
      NUM  = 2,
      STR  = 3,
      ID   = 4,
*/

// emu modes
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
    const res = n / 10
    log(res)
    return res
}

function unscrewOpcodes(rawcodes) {
    const opcodes = rawcodes.map(r => unscrewRune(r))
    opcodes.raw = rawcodes
    return opcodes
}

/*
function screwBaseNumber(N) {
    let n = N * 10
    if (n < 0) {
        if (Math.abs(n) > 42) throw `Screw number value overflow: [${N}]`
        n = 92 + n
    } else {
        if (N > 41) throw `Screw number value overflow: [${N}]`
    }
    return screwBase(n)
}
*/

// === SCREW VM ===
let def = {}, brews = [], lines

function rerr(msg) {
    throw new Error(`Screw Runtime Error: ${msg}`)
}

    /*
    // TODO
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
                    for (let j = 0; j < n; j++) {
                        buf.push(opcodes.raw[i++])
                    }
                    console.log('decoded string: ' + buf.join(''))
                    stack.push(buf.join(''))
                    break
                case PUSHV:
                    stack.push(unscrewNumber(opcodes[i++]))
                    break
                default:
                    ops[op]()
            }

            /*
            switch(op.t) {
                case NUM:
                case STR:
                    geo.push(op.v)
                    break;
                case ID:
                    const word = def[op.v]
                    if (word) exec(word)
                    else {
                        const a = op.v
                        if (!geo[a]) rerr(`Unknown action [${a}]`)
                        geo[a]()
                        if (a === 'brew') {
                            brews.push(geo.last())
                        }
                    }
                    break
                default:
                    rerr('Unexpected operation: ' + dumpToken(op))
            }
            */
        }
    } catch(e) {
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

return {
    screw,
    screwOne,
    cg: () => g,
}

})()
