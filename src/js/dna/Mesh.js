class Mesh {

    constructor(st) {
        extend(this, st)

        // create buffers
        const geo = this.geo
        const buf = {}
        this.buf = buf

        this.buf.vertices = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buf.vertices)
        gl.bufferData(gl.ARRAY_BUFFER, geo.vertices, gl.STATIC_DRAW) // TODO support dynamic geometries?
    }

    draw() {
        // TODO move out of mesh - mesh just defines geometry, materials etc... and buffers
        //      the idea is to use a single mesh for multiple objects
        const mMatrix = mat4.identity()
        mat4
            .translate(mMatrix, this.pos)
            .rot(mMatrix, this.rot)
            //.rotZ(mMatrix, this.rot[2])
            //.rotY(mMatrix, this.rot[1])
            //.rotX(mMatrix, this.rot[0]) // TODO refactor one we have a universal xyz-rotate fun
            .scale(mMatrix, this.scale)

        gl.uniformMatrix4fv(_mMatrix, false, mMatrix)
        // -------------------------------------

        // bind our geometry and materials
        const _aVertexPosition = gl.getAttribLocation(glProg, 'aVertexPosition')
        gl.enableVertexAttribArray(_aVertexPosition)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buf.vertices)
        gl.vertexAttribPointer(_aVertexPosition, 3, gl.FLOAT, false, 0, 0)

        gl.drawArrays(gl.TRIANGLES, 0, this.geo.vertCount)



        // lets try to draw triangles

    }
}
