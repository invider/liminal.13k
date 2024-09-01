
let corkscrew = (function(window) {

    const env = {
        id:     'screw',
        enabled: true,
    }

    function hide() {
        const screw = document.getElementById(env.id)
        if (!screw) return

        screw.style.display = 'none'
        env.enabled = false
    }

    function show() {
        const screw = document.getElementById(env.id)
        if (!screw) return

        screw.textContent = lab.control.activeScript()
        screw.style.display = 'block'
        adjust()
        env.enabled = true
    }

    function adjust() {
        let c = document.getElementById(env.id)
        if (!c) return

        let newLeft = window.innerWidth * .75
        let newWidth = window.innerWidth * .25
        let newHeight = window.innerHeight
        c.style.left = newLeft + 'px'
        c.style.width = newWidth + 'px'
        c.style.height = newHeight + 'px'
        c.style.padding = '10px'
        //c.setAttribute("contenteditable", true)
        c.setAttribute("contenteditable", "plaintext-only")
        c.focus()
    }

    return {
        env,
        adjust,
        hide,
        show,
    }

})(this)

function zapCorkscrew() {
    corkscrew.hide()
    corkscrew.adjust()
}
