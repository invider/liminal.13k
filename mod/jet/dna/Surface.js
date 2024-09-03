// Surface combines the geometry mesh data and materials to create
// a renderable surface
class Surface {

    constructor(st) {
        extend(this, {
            name: 'surface',
            renderOptions: vec4(1, 0, 0, 0),
            mat: {
                Ka: vec3(.5, .6, .7),
                Kd: vec3(.9, .2, .2),
                Ks: vec3(1, 1, 1),
                Ke: vec3(1, 1, 1),
                Lv: vec4(.2, 1, .5, 0),
                Ns: 12,
            },
            buf: {},
        }, st)

        // create buffers
        this.buf.vertices = this.createBuffer(this.geo.vertices)
        this.buf.normals = this.createBuffer(this.geo.normals)
        this.buf.wires = this.createBuffer(this.geo.wires)
        this.buf.colors = this.createBuffer(this.geo.colors)
        this.buf.uvs = this.createBuffer(this.geo.uvs)
        this.buf.faces = this.createBuffer(this.geo.faces, gl.ELEMENT_ARRAY_BUFFER)
    }

    createBuffer(data, type) {
        if (!data) return
        const buf = gl.createBuffer()
        gl.bindBuffer(type || gl.ARRAY_BUFFER, buf)
        gl.bufferData(type || gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
        return buf
    }

    bindAttribute(buf, name, n) {
        if (!buf) return
        const _attr = gl.getAttribLocation(glProg, name)
        gl.enableVertexAttribArray(_attr)
        gl.bindBuffer(gl.ARRAY_BUFFER, buf)
        gl.vertexAttribPointer(_attr, n || 3, gl.FLOAT, false, 0, 0)
    }

    draw() {
        // adjust to the world coordinates

        // set current model matrix
        gl.uniformMatrix4fv(_mMatrix, false, mMatrix)

        // calculate the normal matrix out of the model one (=> invert => transpose)
        mat4.copy(wMatrix, mMatrix)
        mat4.invert(wMatrix)
        mat4.transpose(nMatrix, wMatrix)
        gl.uniformMatrix4fv(_nMatrix, false, nMatrix)

        // rendering options
        if (this.tex) this.renderOptions[2] = 1
        gl.uniform4fv(_uOpt, this.renderOptions)

        // -------------------------------------
        // bind our geometry and materials

        // set the material
        gl.uniform3fv(_uAmbientColor, this.mat.Ka)
        gl.uniform3fv(_uDiffuseColor, this.mat.Kd)
        gl.uniform3fv(_uSpecularColor, this.mat.Ks)
        gl.uniform3fv(_uEmissionColor, this.mat.Ke)
        gl.uniform4fv(_uLightIntensities, this.mat.Lv)
        gl.uniform1f(_uShininess, this.mat.Ns)

        if (this.tex) {
            // bind texture
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.tex);
            gl.uniform1i(_uTexture, 0);
        }

        // set the shader attributes 
        this.bindAttribute(this.buf.vertices, 'aVertexPosition')
        this.bindAttribute(this.buf.normals, 'aVertexNormal')
        this.bindAttribute(this.buf.colors, 'aVertexColor')
        this.bindAttribute(this.buf.uvs, 'aVertexUV', 2)

        if (this.renderOptions[1]) {
            // render wireframes
            gl.lineWidth(2)
            this.bindAttribute(this.buf.wires, 'aVertexPosition')
            gl.drawArrays(gl.LINES, 0, this.geo.wires.length / 3) 
        } else if (this.buf.faces) {
            // TODO can't support multiple indexes at once,
            //      so obj models MUST be repacked to be index by a sinlge index array
            //      and multiple data buffers
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buf.faces)
            gl.drawElements(gl.TRIANGLES, this.geo.facesCount, gl.UNSIGNED_SHORT, 0)

            if (debug) env.stat.polygons += this.geo.facesCount / 3
        } else {
            gl.drawArrays(gl.TRIANGLES, 0, this.geo.vertCount)
            if (debug) env.stat.polygons += this.geo.vertCount / 3
        }
    }
}
