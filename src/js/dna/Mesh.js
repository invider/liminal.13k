class Mesh {

    constructor(st) {
        extend(this, st)

        // create buffers
        const geo = this.geo
        const buf = {}
        this.buf = buf

        buf.vertices = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buf.vertices)
        gl.bufferData(gl.ARRAY_BUFFER, geo.vertices, gl.STATIC_DRAW)

        buf.normals = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buf.normals)
        gl.bufferData(gl.ARRAY_BUFFER, geo.normals, gl.STATIC_DRAW)
    }

    draw() {
        // TODO move out of mesh - mesh just defines geometry, materials etc... and buffers
        //      the idea is to use a single mesh for multiple objects
        const mMatrix = mat4.identity()
        // TODO refactor orientation to be like in the Camera object - vector-based
        mat4
            .translate(mMatrix, this.pos)
            .rot(mMatrix, this.rot)
            .scale(mMatrix, this.scale)

        gl.uniformMatrix4fv(_mMatrix, false, mMatrix)

        mMatrix[12] = 0
        mMatrix[13] = 0
        mMatrix[14] = 0
        mat4.invert(mMatrix)
        gl.uniformMatrix4fv(_nMatrix, false, mMatrix)
        // -------------------------------------

        // bind our geometry and materials
        const _aVertexPosition = gl.getAttribLocation(glProg, 'aVertexPosition')
        gl.enableVertexAttribArray(_aVertexPosition)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buf.vertices)
        gl.vertexAttribPointer(_aVertexPosition, 3, gl.FLOAT, false, 0, 0)

        const _aVertexNormal = gl.getAttribLocation(glProg, 'aVertexNormal')
        gl.enableVertexAttribArray(_aVertexNormal)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buf.normals)
        gl.vertexAttribPointer(_aVertexNormal, 3, gl.FLOAT, false, 0, 0)

        gl.drawArrays(gl.TRIANGLES, 0, this.geo.vertCount)

        // lets try to draw triangles

    }
}
