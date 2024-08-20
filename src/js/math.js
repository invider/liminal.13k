const PI = Math.PI
const DEG_TO_RAD = PI/180
const RAD_TO_DEG = 180/PI
const EPSILON = 0.001

const vec3 = {

    create: function(x, y, z) {
        const m = new Float32Array(3)
        m[0] = x
        m[1] = y
        m[2] = z
        return m
    },

    normalize: function(v) {
        const l = Math.hypot(v[0], v[1], v[2])
        if (l === 0) return v
        const il = 1/l
        v[0] = v[0] * il
        v[1] = v[1] * il
        v[2] = v[2] * il
        return v
    },

    isub: function(v, w) {
        return this.create(
            v[0] - w[0],
            v[1] - w[1],
            v[2] - w[2]
        )
    },

    dot: function(a, b) {
        return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]
    },

    icross: function(a, b) {
        return this.create(
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]
        )
    },
}

const mat4 = {

    identity: function() {
        const m = new Float32Array(16)
        m[0]  = 1
        m[5]  = 1
        m[10] = 1
        m[15] = 1
        return m
    },

    copy: function(a) {
        const o = new Float32Array(16)
        for (let i = 0; i < 16; i++) o[i] = a[i]
        return o
    },

    createV3: function(v1, v2, v3, v4) {
        const m = new Float32Array(16)
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

    // generates a perspective projection 4D matrix
    // @param {number/degrees} fovy - the vertical field of view
    // @param {number} aspectRate - the viewport width-to-height aspect ratio
    // @param {number} zNear - the z coordinate of the near clipping plane
    // @param {number} zFar - the z coordinate of the far clipping plane
    projection: function(fovy, aspectRate, zNear, zFar) {
        const tan = Math.tan(fovy * DEG_TO_RAD * .5)
        const e11 = .5/tan
        const e22 = .5 * aspectRate/tan
        const e33 = -(zFar + zNear) / (zFar - zNear)
        const e34 = (-2 * zFar * zNear)/(zFar - zNear)

        return new Float32Array([
            e11,    0,    0,      0,
            0,      e22,  0,      0,
            0,      0,    e33,   -1,
            0,      0,    e34,    0,
        ])
    },

    lookAt: function(cam, tar, up) {
        const zAxis = vec3.normalize( vec3.isub(cam, tar) )

        const ixAxis = vec3.icross(up, zAxis)
        const xAxis = vec3.normalize( vec3.icross(up, zAxis) )
        const yAxis = vec3.normalize( vec3.icross(zAxis, xAxis) )

        return this.createV3(xAxis, yAxis, zAxis, cam)
    },

    // TODO combine rot matrices into a single 3-axis rotation
    // TODO turn into -> mat4 * rotMat4
    rotX: function(theta) {
        // return the rotation matrix
        const m = this.identity()
        m[0]  = Math.cos(theta)
        m[2]  = -Math.sin(theta)
        m[8]  = Math.sin(theta)
        m[10] = Math.cos(theta)
        return m
    },

    // TODO turn into -> mat4 * rotMat4
    rotY: function(theta) {
        // return the rotation matrix
        const m = this.identity()
        m[5] = Math.cos(theta)
        m[6] = Math.sin(theta)
        m[9] = -Math.sin(theta)
        m[10] = Math.cos(theta)
        return m
    },

    // TODO turn into -> mat4 * rotMat4
    rotZ: function(theta) {
        // return the rotation matrix
        const m = this.identity()
        m[0] = Math.cos(theta)
        m[1] = Math.sin(theta)
        m[4] = -Math.sin(theta)
        m[5] = Math.cos(theta)
        return m
    },

    // multiply 2 4D matrices
    // @param {array/mat4} a - the first operand the result receiver
    // @param {array/mat4} b - the second operand (immutable)
    // @returns {object} - the math utilities object
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

    // invert a 4D matrix
    // @param {array/mat4} t - the source and receiving 4D matrix 
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

