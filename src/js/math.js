const PI = Math.PI
const DEG_TO_RAD = PI/180
const RAD_TO_DEG = 180/PI

const rnd = Math.random

const vec3 = function(x, y, z) {
    const m = new Float32Array(3)
    m[0] = x
    m[1] = y
    m[2] = z
    return m
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

vec3.isub = function(v, w) {
    return vec3(
        v[0] - w[0],
        v[1] - w[1],
        v[2] - w[2]
    )
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
      tzm4 = tempM4[4]  // for z-axis rotation

const mat4 = {

    identity: function() {
        const m = newMat4()
        setMat4Identity(m)
        return m
    },

    copy: function(a) {
        const o = newMat4()
        for (let i = 0; i < 16; i++) o[i] = a[i]
        return o
    },

    createV3: function(v1, v2, v3, v4) {
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

        return this.createV3(xAxis, yAxis, zAxis, cam)
    },

    // TODO combine rot matrices into a single 3-axis rotation

    // rotate a matrix around the x-axis
    //
    // @param {array/mat4} m - the 4x4 matrix to rotate
    // @param {number} theta - the rotation angle in radians
    // @return {object/lib} the mat4 library object
    rotX: function(m, theta) {
        txm4[0 ] =  Math.cos(theta)
        txm4[2 ] = -Math.sin(theta)
        txm4[8 ] =  Math.sin(theta)
        txm4[10] =  Math.cos(theta)
        this.mul(m, txm4)
        return this
    },

    // rotate a matrix around the y-axis
    //
    // @param {array/mat4} m - the 4x4 matrix to rotate
    // @param {number} theta - the rotation angle in radians
    // @return {object/lib} the mat4 library object
    rotY: function(m, theta) {
        tym4[5 ] =  Math.cos(theta)
        tym4[6 ] =  Math.sin(theta)
        tym4[9 ] = -Math.sin(theta)
        tym4[10] =  Math.cos(theta)
        this.mul(m, tym4)
        return this
    },

    // rotate a matrix around the z-axis
    //
    // @param {array/mat4} m - the 4x4 matrix to rotate
    // @param {number} theta - the rotation angle in radians
    // @return {object/lib} the mat4 library object
    rotZ: function(m, theta) {
        tzm4[0] =  Math.cos(theta)
        tzm4[1] =  Math.sin(theta)
        tzm4[4] = -Math.sin(theta)
        tzm4[5] =  Math.cos(theta)
        this.mul(m, tzm4)
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
    // @return {object/lib} the mat4 library object
    invert: function(t) {
        const m = this.copy(t)
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

        return this
    }
}
