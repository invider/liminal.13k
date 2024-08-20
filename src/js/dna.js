class Camera {

    constructor(st) {
        extend(this, st)
    }

    viewMatrix() {
        const m = mat4.lookAt(
            this.pos,
            this.lookAt,
            this.up,
        )
        mat4.invert(m)
        return m
    }
}

class Cube {

    constructor(st) {
        extend(this, st)

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
            .rotX(mMatrix, this.rot[0]) // TODO refactor one we have a universal xyz-rotate fun
            .rotY(mMatrix, this.rot[1])
            .rotZ(mMatrix, this.rot[2])
            .scale(mMatrix, this.scale)

        gl.uniformMatrix4fv(_mMatrix, false, mMatrix)

        // bind our geometry and material properties
        gl.bindBuffer(gl.ARRAY_BUFFER, buf.cubeV)
        gl.vertexAttribPointer(_position, 3, gl.FLOAT, false, 0, 0)

        gl.bindBuffer(gl.ARRAY_BUFFER, buf.cubeC)
        gl.vertexAttribPointer(_color,    3, gl.FLOAT, false, 0, 0)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf.cubeF)
        gl.drawElements(gl.TRIANGLES, cubeFaces.length, gl.UNSIGNED_SHORT, 0)
    }
}
