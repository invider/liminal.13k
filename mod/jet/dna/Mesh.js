const dfMesh = {
    mat: {
        Ka: vec3(.5, .6, .7),
        Kd: vec3(.9, .2, .2),
        Ks: vec3(1, 1, 1),
        Ke: vec3(1, 1, 1),
        Lv: vec4(.2, 1, .5, 0),
        Ns: 12,
    }
}

class Mesh {

    constructor(st) {
        extend(this, dfMesh, st)

        // create buffers
        const geo = this.geo
        const buf = {}
        this.buf = buf

        buf.vertices = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buf.vertices)
        gl.bufferData(gl.ARRAY_BUFFER, geo.vertices, gl.STATIC_DRAW)

        if (geo.faces) {
            buf.faces = gl.createBuffer()
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf.faces)
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geo.faces, gl.STATIC_DRAW)
        }

        buf.normals = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buf.normals)
        gl.bufferData(gl.ARRAY_BUFFER, geo.normals, gl.STATIC_DRAW)
    }

    draw() {
        // adjust to the world coordinates
        // TODO move out of mesh - mesh just defines geometry, materials etc... and buffers
        //      the idea is to use a single mesh for multiple objects

        // TODO refactor out rotation into a container object?
        // TODO refactor orientation to be like in the Camera object - vector-based

        _.mpush() // save the current model matrix before applying transformations
        mat4
            .translate(mMatrix, this.pos)
            .rot(mMatrix,       this.rot)
            .scale(mMatrix,     this.scale)

        gl.uniformMatrix4fv(_mMatrix, false, mMatrix)

        mat4.copy(wMatrix, mMatrix)
        mat4.invert(wMatrix)

        mat4.transpose(nMatrix, wMatrix)
        gl.uniformMatrix4fv(_nMatrix, false, nMatrix)
        // TODO ^^^ all the matrix majik above should happen outside

        // -------------------------------------
        // bind our geometry and materials

        // set the material
        gl.uniform3fv(_uAmbientColor, this.mat.Ka)
        gl.uniform3fv(_uDiffuseColor, this.mat.Kd)
        gl.uniform3fv(_uSpecularColor, this.mat.Ks)
        gl.uniform3fv(_uEmissionColor, this.mat.Ke)
        gl.uniform4fv(_uLightIntensities, this.mat.Lv)
        gl.uniform1f(_uShininess, this.mat.Ns)

        const _aVertexPosition = gl.getAttribLocation(glProg, 'aVertexPosition')
        gl.enableVertexAttribArray(_aVertexPosition)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buf.vertices)
        gl.vertexAttribPointer(_aVertexPosition, 3, gl.FLOAT, false, 0, 0)

        const _aVertexNormal = gl.getAttribLocation(glProg, 'aVertexNormal')
        gl.enableVertexAttribArray(_aVertexNormal)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buf.normals)
        gl.vertexAttribPointer(_aVertexNormal, 3, gl.FLOAT, false, 0, 0)

        if (this.buf.faces) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buf.faces)
            gl.drawElements(gl.TRIANGLES, this.geo.facesCount, gl.UNSIGNED_SHORT, 0)

            if (debug) {
                env.dump.polygons += this.geo.facesCount / 3
            }
        } else {
            gl.drawArrays(gl.TRIANGLES, 0, this.geo.vertCount)

            if (debug) {
                env.dump.polygons += this.geo.vertCount / 3
            }
        }

        _.mpop()
    }
}
