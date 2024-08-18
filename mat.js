const DEG_TO_RAD = Math.PI/180
const RAD_TO_DEG = 180/Math.PI

const mat4 = {

    identity: function() {
        const m = new Float32Array(16)
        m[0]  = 1
        m[5]  = 1
        m[10] = 1
        m[15] = 1
        return m
    },

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

    rotX: function(theta) {
        // return the rotation matrix
        const m = this.identity()
        m[0]  = Math.cos(theta)
        m[2]  = -Math.sin(theta)
        m[8]  = Math.sin(theta)
        m[10] = Math.cos(theta)
        return m
    },

    rotY: function(theta) {
        // return the rotation matrix
        const m = this.identity()
        m[5] = Math.cos(theta)
        m[6] = Math.sin(theta)
        m[9] = -Math.sin(theta)
        m[10] = Math.cos(theta)
        return m
    },

    rotZ: function(theta) {
        // return the rotation matrix
        const m = this.identity()
        m[0] = Math.cos(theta)
        m[1] = Math.sin(theta)
        m[4] = -Math.sin(theta)
        m[5] = Math.cos(theta)
        return m
    },

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
}

