
let corkscrew = (function(window) {

    let lastScript

    const env = {
        id:     'screw',
        enabled: true,
    }

    function hide() {
        const screw = document.getElementById(env.id)
        if (!screw) return

        screw.style.display = 'none'
        env.enabled = false

        if (!lastScript || !lab.control) return
        const updatedScript = screw.textContent
        if (updatedScript !== lastScript) {
            lab.control.screwUp( updatedScript )
        }
    }

    function show() {
        const screw = document.getElementById(env.id)
        if (!screw) return

        lastScript = lab.control.activeScript()
        screw.textContent = lastScript
        screw.style.display = 'block'
        adjust()
        env.enabled = true
    }

    function adjust() {
        let c = document.getElementById(env.id)
        if (!c) return

        let newLeft = window.innerWidth * .55
        let newWidth = window.innerWidth * .45
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
