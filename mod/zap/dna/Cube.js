// TODO to be refactored out
class Cube {

    constructor(st) {
        extend(this, st)

        this.bufVertices = buf.cubeV
        this.bufFaces = buf.cubeF
        this.bufElements = cubeFaces.length
        this.bufColors = buf.cubeC

        this.rspeed = vec3(
            (rnd() < .5? -1 : 1) * (2 * Math.random() * 30) * DEG_TO_RAD,
            (rnd() < .5? -1 : 1) * (2 * Math.random() * 30) * DEG_TO_RAD,
            (rnd() < .5? -1 : 1) * (2 * Math.random() * 30) * DEG_TO_RAD,
        )
    }

    evo(dt) {
        this.rot[0] += this.rspeed[0] * dt
        this.rot[1] += this.rspeed[1] * dt
        this.rot[2] += this.rspeed[2] * dt
    }

    draw() {
        // TODO work on the current context model matrix, just like in OpenGL (emulate)
        const mMatrix = mat4.identity()
        mat4
            .translate(mMatrix, this.pos)
            .rot(mMatrix, this.rot)
            //.rotZ(mMatrix, this.rot[2])
            //.rotY(mMatrix, this.rot[1])
            //.rotX(mMatrix, this.rot[0]) // TODO refactor one we have a universal xyz-rotate fun
            .scale(mMatrix, this.scale)

        gl.uniformMatrix4fv(_mMatrix, false, mMatrix)

        // bind our geometry and material properties
        const _position = gl.getAttribLocation(glProg, 'aVertexPosition')
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufVertices)
        gl.vertexAttribPointer(_position, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(_position)

        const _color = gl.getAttribLocation(glProg, 'aVertexColor')
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufColors)
        gl.vertexAttribPointer(_color,    3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(_color)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufFaces)
        gl.drawElements(gl.TRIANGLES, this.bufElements, gl.UNSIGNED_SHORT, 0)
    }
}
