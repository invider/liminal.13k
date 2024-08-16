let gl

function setup() {
    const canvas = document.getElementById('canvas')
    gl = canvas.getContext('webgl')

    if (!gl) alert('No WebGL!')

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
}

window.onload = setup
