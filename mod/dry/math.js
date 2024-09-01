const PI = Math.PI
const PI2 = PI*2
const DEG_TO_RAD = PI/180
const RAD_TO_DEG = 180/PI
const EPSILON = 0.001

const abs = Math.abs
const cos = Math.cos
const sin = Math.sin
const floor = Math.floor

// LCG
function LNGSource(seed) {
    let M = 0xFFFFFFFF, a = 1664525, c = 1013904223

    function nextv() {
        seed = (a * seed + c) % M
        return seed
    }

    return () => nextv()/M
}
const rnd = LNGSource(1)

function clamp(v, m, x) {
    return Math.min(Math.max(v, m), x)
}

function lerp(start, end, amt) {
    return start + amt * (end - start)
}

// === 3D vector ops ===

const vec3z = function() {
    return new Float32Array(3)
}

const vec3 = function(x, y, z) {
    const v = new Float32Array(3)
    v[0] = x
    v[1] = y
    v[2] = z
    return v
}

vec3.set = function(v, x, y, z) {
    v[0] = x
    v[1] = y
    v[2] = z
    return this
}

vec3.clone = function(v) {
    const w = new Float32Array(3)
    w[0] = v[0]
    w[1] = v[1]
    w[2] = v[2]
    return w
}

vec3.copy = function(v, w) {
    v[0] = w[0]
    v[1] = w[1]
    v[2] = w[2]
}

vec3.fromArray = (buf, i) => {
    return vec3(
        buf[i],
        buf[i+1],
        buf[i+2],
    )
}

vec3.push = function(buf, v) {
    buf.push(v[0], v[1], v[2])
    return this
}

vec3.len = function(v) {
    return Math.hypot(v[0], v[1], v[2])
}

vec3.dist = function(v, w) {
    return Math.hypot(v[0]-w[0], v[1]-w[1], v[2]-w[2])
}

vec3.normalize = function(v) {
    const l = Math.hypot(v[0], v[1], v[2])
    if (l === 0) return v
    const il = 1/l
    v[0] = v[0] * il
    v[1] = v[1] * il
    v[2] = v[2] * il
    return v
}

function _iadd(v, w, f) {
    return vec3(
        v[0] + f*w[0],
        v[1] + f*w[1],
        v[2] + f*w[2]
    )
}

vec3.isub = (v, w) => {
    return _iadd(v, w, -1)
}

vec3.iadd = (v, w) => {
    return _iadd(v, w, 1)
}

vec3.add = function(v, w) {
    v[0] += w[0]
    v[1] += w[1]
    v[2] += w[2]
    return this
}

vec3.mul = function(v, w) {
    v[0] *= w[0]
    v[1] *= w[1]
    v[2] *= w[2]
    return this
}

vec3.scale = function(v, s) {
    v[0] *= s
    v[1] *= s
    v[2] *= s
    return this
}

vec3.scad = function(v, w, s) {
    v[0] += w[0] * s
    v[1] += w[1] * s
    v[2] += w[2] * s
    return this
}

vec3.dot = function(a, b) {
    return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]
}

vec3.icross = function(a, b) {
    return vec3(
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    )
}

vec3.fromSpherical = function(r, theta, phi) {
    const v = new Float32Array(3)
    v[0] = r * sin(theta) * cos(phi)
    v[1] = r * sin(theta) * sin(phi)
    v[2] = r * cos(theta)
    return v
}

vec3.toSpherical = function(v) {
    const w = new Float32Array(3), x = v[0], y = v[1], z = [2]
    w[0] = vec3.len(v)
    w[1] = Math.atan2(v[2], v[0])
    w[2] = Math.atan2(v[1], v[2])
    return w
}

// rotate 3D vector counterclockwise around x-axis
vec3.rotX = function(v, theta) {
    const x = v[0], y = v[1], z = v[2]
    v[1] = y * cos(theta) - z * sin(theta)
    v[2] = y * sin(theta) + z * cos(theta)
}

// rotate 3D vector counterclockwise around y-axis
vec3.rotY = function(v, theta) {
    const x = v[0], y = v[1], z = v[2]
    v[0] = z * sin(theta) + x * cos(theta)
    v[2] = z * cos(theta) - x * sin(theta)
}

// rotate 3D vector counterclockwise around z-axis
vec3.rotZ = function(v, theta) {
    const x = v[0], y = v[1], z = v[2]
    v[1] = x * cos(theta) - y * sin(theta)
    v[2] = x * sin(theta) + y * cos(theta)
}

vec3.equals = function(a, b) {
    return (a[0] === b[0] && a[1] === b[1] && a[2] === b[2])
}


// === 4D vector ===
const vec4 = function(x, y, z, w) {
    const v = new Float32Array(4)
    v[0] = x
    v[1] = y
    v[2] = z
    v[3] = w
    return v
}

vec4.clone = function(v) {
    const w = new Float32Array(4)
    w[0] = v[0]
    w[1] = v[1]
    w[2] = v[2]
    w[3] = v[3]
    return w
}

// === 4x4 matrix ops ===

// turn a zero 4D matrix into an identity one
// @param {array/mat4} - a zero 4D matrix to set identity to
function setMat4Identity(m) {
    m[0]  = 1
    m[5]  = 1
    m[10] = 1
    m[15] = 1
    return m
}

function newMat4() {
    return new Float32Array(16)
}

// generate buffer matrices used to speed up calculations
const tempM4 = []
for (let i = 0; i < 8; i++) tempM4[i] = setMat4Identity(newMat4())
const tsm4 = tempM4[0], // for scaling
      ttm4 = tempM4[1], // for translation
      txm4 = tempM4[2], // for x-axis rotation
      tym4 = tempM4[3], // for y-axis rotation
      tzm4 = tempM4[4], // for z-axis rotation
      trm4 = tempM4[5]  // for zyx rotation

const mat4 = {

    identity: function() {
        const m = newMat4()
        setMat4Identity(m)
        return m
    },

    clone: function(a) {
        const o = newMat4()
        for (let i = 0; i < 16; i++) o[i] = a[i]
        return o
    },

    copy: function(o, s) {
        for (let i = 0; i < 16; i++) o[i] = s[i]
    },

    from4V3: function(v1, v2, v3, v4) {
        const m = newMat4()
        m[0] = v1[0]
        m[1] = v1[1]
        m[2] = v1[2]
        m[4] = v2[0]
        m[5] = v2[1]
        m[6] = v2[2]
        m[8] = v3[0]
        m[9] = v3[1]
        m[10] = v3[2]
        m[12] = v4[0]
        m[13] = v4[1]
        m[14] = v4[2]
        m[15] = 1
        return m
    },

    // generates a perspective projection 4x4 matrix
    //
    // @param {number/degrees} fovy - the vertical field of view
    // @param {number} aspectRate - the viewport width-to-height aspect ratio
    // @param {number} zNear - the z coordinate of the near clipping plane
    // @param {number} zFar - the z coordinate of the far clipping plane
    projection: function(fovy, aspectRate, zNear, zFar) {
        const m = newMat4()
        const tan = Math.tan(fovy * DEG_TO_RAD * .5)
        m[0]  = .5/tan
        m[5]  = .5 * aspectRate/tan
        m[10] = -(zFar + zNear) / (zFar - zNear)
        m[11] = (-2 * zFar * zNear)/(zFar - zNear)
        m[14] = -1

        return m
    },

    // generates camera look at matrix
    //
    // @param {array/vec3} car - the camera coordinates 3D vector
    // @param {array/vec3} tar - the target coordinates 3D vector
    // @param {array/vec3} up - the up camera orientation 3D vector (tilt)
    // @return {array/mat4} the look-at 4x4 matrix
    lookAt: function(cam, tar, up) {
        const zAxis = vec3.normalize( vec3.isub(cam, tar) )
        const xAxis = vec3.normalize( vec3.icross(up, zAxis) )
        const yAxis = vec3.normalize( vec3.icross(zAxis, xAxis) )

        return this.from4V3(xAxis, yAxis, zAxis, cam)
    },

    // TODO combine rot matrices into a single 3-axis rotation

    // rotate a matrix around the x-axis
    //
    // @param {array/mat4} m - the 4x4 matrix to rotate
    // @param {number} theta - the rotation angle in radians
    // @return {object/lib} the mat4 library object
    rotX: function(m, theta) {
        txm4[0 ] =  cos(theta)
        txm4[2 ] = -sin(theta)
        txm4[8 ] =  sin(theta)
        txm4[10] =  cos(theta)
        this.mul(m, txm4)
        return this
    },

    // rotate a matrix around the y-axis
    //
    // @param {array/mat4} m - the 4x4 matrix to rotate
    // @param {number} theta - the rotation angle in radians
    // @return {object/lib} the mat4 library object
    rotY: function(m, theta) {
        tym4[5 ] =  cos(theta)
        tym4[6 ] =  sin(theta)
        tym4[9 ] = -sin(theta)
        tym4[10] =  cos(theta)
        this.mul(m, tym4)
        return this
    },

    // rotate a matrix around the z-axis
    //
    // @param {array/mat4} m - the 4x4 matrix to rotate
    // @param {number} theta - the rotation angle in radians
    // @return {object/lib} the mat4 library object
    rotZ: function(m, theta) {
        tzm4[0] =  cos(theta)
        tzm4[1] =  sin(theta)
        tzm4[4] = -sin(theta)
        tzm4[5] =  cos(theta)
        this.mul(m, tzm4)
        return this
    },

    rot: function(m, v) {
        const 
            cx = cos(v[0]), sx = sin(v[0]),
            cy = cos(v[1]), sy = sin(v[1]),
            cz = cos(v[2]), sz = sin(v[2])
        trm4[0] = cy * cz
        trm4[1] = sx * sy * cz + cx * sz
        trm4[2] = -cx * sy * cz + sx * sz

        trm4[4] = -cy * sz
        trm4[5] = -sx * sy * sz + cx * cz
        trm4[6] = cx * sy * sz + sx * cz

        trm4[8] =  sy
        trm4[9] =  -sx * cy
        trm4[10] =  cx * cy

        this.mul(m, trm4)
        return this
    },

    // translate a 4x4 matrix to the specified coordinates
    //
    // @param {array/mat4} m - the 4x4 matrix to translate
    // @param {number} x
    // @param {number} y
    // @param {number} z
    // @return {object/lib} the mat4 library object
    translate: function(m, v) {
        ttm4[12] = v[0]
        ttm4[13] = v[1]
        ttm4[14] = v[2]
        this.mul(m, ttm4)
        return this
    },

    // scale a 4x4 matrix by the specified values across each axis
    //
    // @param {array/mat4} m - the 4x4 matrix to scale
    // @param {number} x - the scale factor along the x-axis
    // @param {number} y - the scale factor along the y-axis
    // @param {number} z - the scale factor along the z-axis
    // @return {object/lib} the mat4 library object
    scale: function(m, v) {
        tsm4[0 ] = v[0]
        tsm4[5 ] = v[1]
        tsm4[10] = v[2]
        this.mul(m, tsm4)
        return this
    }, 

    // multiply 2 4D matrices
    // @param {array/mat4} a - the first operand the result receiver
    // @param {array/mat4} b - the second operand (immutable)
    // @return {object/lib} the mat4 library object
    mul: function(a, b) {
        const a1x = a[0],  a1y = a[1],  a1z = a[2],  a1w = a[3],
              a2x = a[4],  a2y = a[5],  a2z = a[6],  a2w = a[7],
              a3x = a[8],  a3y = a[9],  a3z = a[10], a3w = a[11],
              a4x = a[12], a4y = a[13], a4z = a[14], a4w = a[15]

        for (let i = 0; i < 4; i++) {
            const n = i * 4
            const bx = b[n], by = b[n+1], bz = b[n+2], bw = b[n+3]
            a[n  ] = bx * a1x + by * a2x + bz * a3x + bw * a4x
            a[n+1] = bx * a1y + by * a2y + bz * a3y + bw * a4y
            a[n+2] = bx * a1z + by * a2z + bz * a3z + bw * a4z
            a[n+3] = bx * a1w + by * a2w + bz * a3w + bw * a4w
        }

        return this
    },

    // invert a 4x4 matrix
    // @param {array/mat4} t - the source and receiving 4D matrix 
    invert: function(t) {
        const m = this.clone(t)
        const
            A2323 = m[2*4 + 2] * m[3*4 + 3] - m[2*4 + 3] * m[3*4 + 2],
            A1323 = m[2*4 + 1] * m[3*4 + 3] - m[2*4 + 3] * m[3*4 + 1],
            A1223 = m[2*4 + 1] * m[3*4 + 2] - m[2*4 + 2] * m[3*4 + 1],
            A0323 = m[2*4 + 0] * m[3*4 + 3] - m[2*4 + 3] * m[3*4 + 0],
            A0223 = m[2*4 + 0] * m[3*4 + 2] - m[2*4 + 2] * m[3*4 + 0],
            A0123 = m[2*4 + 0] * m[3*4 + 1] - m[2*4 + 1] * m[3*4 + 0],
            A2313 = m[1*4 + 2] * m[3*4 + 3] - m[1*4 + 3] * m[3*4 + 2],
            A1313 = m[1*4 + 1] * m[3*4 + 3] - m[1*4 + 3] * m[3*4 + 1],
            A1213 = m[1*4 + 1] * m[3*4 + 2] - m[1*4 + 2] * m[3*4 + 1],
            A2312 = m[1*4 + 2] * m[2*4 + 3] - m[1*4 + 3] * m[2*4 + 2],
            A1312 = m[1*4 + 1] * m[2*4 + 3] - m[1*4 + 3] * m[2*4 + 1],
            A1212 = m[1*4 + 1] * m[2*4 + 2] - m[1*4 + 2] * m[2*4 + 1],
            A0313 = m[1*4 + 0] * m[3*4 + 3] - m[1*4 + 3] * m[3*4 + 0],
            A0213 = m[1*4 + 0] * m[3*4 + 2] - m[1*4 + 2] * m[3*4 + 0],
            A0312 = m[1*4 + 0] * m[2*4 + 3] - m[1*4 + 3] * m[2*4 + 0],
            A0212 = m[1*4 + 0] * m[2*4 + 2] - m[1*4 + 2] * m[2*4 + 0],
            A0113 = m[1*4 + 0] * m[3*4 + 1] - m[1*4 + 1] * m[3*4 + 0],
            A0112 = m[1*4 + 0] * m[2*4 + 1] - m[1*4 + 1] * m[2*4 + 0]

        const idet = 1 / (
              m[0*4 + 0] * ( m[1*4 + 1] * A2323 - m[1*4 + 2] * A1323 + m[1*4 + 3] * A1223 )
            - m[0*4 + 1] * ( m[1*4 + 0] * A2323 - m[1*4 + 2] * A0323 + m[1*4 + 3] * A0223 )
            + m[0*4 + 2] * ( m[1*4 + 0] * A1323 - m[1*4 + 1] * A0323 + m[1*4 + 3] * A0123 )
            - m[0*4 + 3] * ( m[1*4 + 0] * A1223 - m[1*4 + 1] * A0223 + m[1*4 + 2] * A0123 )
        )

        t[0*4 + 0] = idet *   ( m[1*4 + 1] * A2323 - m[1*4 + 2] * A1323 + m[1*4 + 3] * A1223 )
        t[0*4 + 1] = idet * - ( m[0*4 + 1] * A2323 - m[0*4 + 2] * A1323 + m[0*4 + 3] * A1223 )
        t[0*4 + 2] = idet *   ( m[0*4 + 1] * A2313 - m[0*4 + 2] * A1313 + m[0*4 + 3] * A1213 )
        t[0*4 + 3] = idet * - ( m[0*4 + 1] * A2312 - m[0*4 + 2] * A1312 + m[0*4 + 3] * A1212 )
        t[1*4 + 0] = idet * - ( m[1*4 + 0] * A2323 - m[1*4 + 2] * A0323 + m[1*4 + 3] * A0223 )
        t[1*4 + 1] = idet *   ( m[0*4 + 0] * A2323 - m[0*4 + 2] * A0323 + m[0*4 + 3] * A0223 )
        t[1*4 + 2] = idet * - ( m[0*4 + 0] * A2313 - m[0*4 + 2] * A0313 + m[0*4 + 3] * A0213 )
        t[1*4 + 3] = idet *   ( m[0*4 + 0] * A2312 - m[0*4 + 2] * A0312 + m[0*4 + 3] * A0212 )
        t[2*4 + 0] = idet *   ( m[1*4 + 0] * A1323 - m[1*4 + 1] * A0323 + m[1*4 + 3] * A0123 )
        t[2*4 + 1] = idet * - ( m[0*4 + 0] * A1323 - m[0*4 + 1] * A0323 + m[0*4 + 3] * A0123 )
        t[2*4 + 2] = idet *   ( m[0*4 + 0] * A1313 - m[0*4 + 1] * A0313 + m[0*4 + 3] * A0113 )
        t[2*4 + 3] = idet * - ( m[0*4 + 0] * A1312 - m[0*4 + 1] * A0312 + m[0*4 + 3] * A0112 )
        t[3*4 + 0] = idet * - ( m[1*4 + 0] * A1223 - m[1*4 + 1] * A0223 + m[1*4 + 2] * A0123 )
        t[3*4 + 1] = idet *   ( m[0*4 + 0] * A1223 - m[0*4 + 1] * A0223 + m[0*4 + 2] * A0123 )
        t[3*4 + 2] = idet * - ( m[0*4 + 0] * A1213 - m[0*4 + 1] * A0213 + m[0*4 + 2] * A0113 )
        t[3*4 + 3] = idet *   ( m[0*4 + 0] * A1212 - m[0*4 + 1] * A0212 + m[0*4 + 2] * A0112 )
    },

    transpose(t, m) {
        for (let v = 0; v < 4; v++) {
            for (let c = 0; c < 4; c++) {
                t[v*4 + c] = m[c*4 + v]
            }
        }
    },

    equals(m1, m2) {
        for (let i = 0; i < 16; i++) {
            if (abs(m1[i] - m2[i]) > EPSILON) return false
        }
        return true
    },

    extractV3: (m, i) => {
        i *= 4
        return vec3(
            m[i],
            m[i+1],
            m[i+2],
        )
    }
}

function calcNormals(v, smooth) {
    const n = [], w = [], gn = [], gN = []

    function indexVertex(vx, j, nv) {
        let o = -1, i = 0
        while(o < 0 && i < j) {
            vw = vec3.fromArray(v, i)
            if (vec3.equals(vx, vw)) {
                // found the leading vertex!
                o = i/3
            }
            i += 3
        }

        let wj = j/3
        w[wj] = o
        if (o < 0) o = wj

        if (gn[o]) {
            gn[o].push(nv)
        } else gn[o] = [nv]
    }

    function avgNormal(nlist) {
        const v = vec3(0, 0, 0)
        nlist.forEach(w => vec3.add(v, w))
        vec3.scale(v, 1/nlist.length)
        vec3.normalize(v)
        return v
    }

    for (let i = 0; i < v.length; i+=9) {
        let
            v1 = vec3.fromArray(v, i),
            v2 = vec3.fromArray(v, i + 3),
            v3 = vec3.fromArray(v, i + 6),
            v12 = vec3.isub(v1, v2),
            v13 = vec3.isub(v1, v3),
            nv = vec3.normalize( vec3.icross(v12, v13) )

        if (smooth) {
            indexVertex(v1, i,     nv)
            indexVertex(v2, i + 3, nv)
            indexVertex(v3, i + 6, nv)
        }

        // push the same normal for all 3 vertices
        n.push(nv[0], nv[1], nv[2])
        n.push(nv[0], nv[1], nv[2])
        n.push(nv[0], nv[1], nv[2])
    }

    if (smooth) {
        for (let i = 0; i < w.length; i++) {
            const leadIndex = w[i]

            let an
            if (leadIndex < 0) {
                an = avgNormal(gn[i]) 
                gN[i] = an
            } else {
                an = gN[leadIndex]
            }

            n[i*3]   = an[0]
            n[i*3+1] = an[1]
            n[i*3+2] = an[2]
        }
    }

    return n
}
