// Surface combines the geometry mesh data and materials to create
// a renderable surface
class Surface {

    constructor(st) {
        extend(this, {
            name: 'surface',
            rO: vec4(1, 0, 0, 0), // render options
            buf: {},
        }, st)

        if (!st.m && st.geo.m) {
            this.m = st.geo.m
        }

        // create buffers
        let cb = (d) => {
            if (d) {
                const b = gl.createBuffer()
                gl.bindBuffer(gl.ARRAY_BUFFER, b)
                gl.bufferData(gl.ARRAY_BUFFER, d, gl.STATIC_DRAW)
                return b
            }
        }
        for (let b of this.geo.B) {
            this.buf[b] = cb(this.geo[b])
        }
        //this.buf.v = this.createBuffer(this.geo.v)
        //this.buf.n = this.createBuffer(this.geo.n)
        //this.buf.w = this.createBuffer(this.geo.w)
        //this.buf.c = this.createBuffer(this.geo.c)
        //this.buf.u = this.createBuffer(this.geo.u)
        //this.buf.f = this.createBuffer(this.geo.f, gl.ELEMENT_ARRAY_BUFFER)
    }

    bindAttribute(buf, name, n) {
        if (!buf) return
        const _attr = gl.getAttribLocation(glP, name)
        gl.enableVertexAttribArray(_attr)
        gl.bindBuffer(gl.ARRAY_BUFFER, buf)
        gl.vertexAttribPointer(_attr, n || 3, gl.FLOAT, false, 0, 0)
    }

    draw() {
        // adjust to the world coordinates

        // set current model matrix
        gl.uniformMatrix4fv(_a.m, false, mMatrix)

        // calculate the normal matrix out of the model one (=> invert => transpose)
        mat4.copy(wMatrix, mMatrix)
        mat4.invert(wMatrix)
        mat4.transpose(nMatrix, wMatrix)
        gl.uniformMatrix4fv(_a.n, false, nMatrix)

        // rendering options
        if (this.tex) this.rO[2] = 1
        gl.uniform4fv(_a.uO, this.rO)

        // -------------------------------------
        // bind our geometry and materials

        // set the material
        gl.uniform4fv(_a.ua, this.m.a)
        gl.uniform4fv(_a.ud, this.m.d)
        gl.uniform4fv(_a.us, this.m.s)
        gl.uniform1f(_a.un, this.m.n)

        if (this.tex) {
            // bind texture
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.tex);
            gl.uniform1i(_a.uT, 0);
        }

        // set the shader attributes 
        this.bindAttribute(this.buf.v, 'vp')
        this.bindAttribute(this.buf.n, 'vn')
        this.bindAttribute(this.buf.c, 'vc')
        this.bindAttribute(this.buf.u, 'uv', 2)

        //if (this.rO[1]) {
            // render wireframes
            //gl.lineWidth(2)
            //this.bindAttribute(this.buf.w, 'vp')
            //gl.drawArrays(gl.LINES, 0, this.geo.w.length / 3) 
        //} else if (this.buf.faces) {
            // TODO can't support multiple indexes at once,
            //      so obj models MUST be repacked to be index by a sinlge index array
            //      and multiple data buffers
        //    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buf.faces)
        //    gl.drawElements(gl.TRIANGLES, this.geo.fc, gl.UNSIGNED_SHORT, 0)

            //if (debug) env.stat.polygons += this.geo.fc / 3
        //} else {
            gl.drawArrays(gl.TRIANGLES, 0, this.geo.vc)
            //if (debug) env.stat.polygons += this.geo.vc / 3
        //}
    }
}
