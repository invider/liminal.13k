
let corkscrew = (function(window) {

    let lastScript

    const st = {
        id:        'screw',
        enabled:   true,
        loadURL:   'screw',
        uploadURL: 'up',
    }

    function syncIn() {
        const screw = document.getElementById(st.id)
        if (!screw) return

        lastScript = lab.control.activeScript()
        screw.textContent = lastScript
    }

    function hide() {
        const screw = document.getElementById(st.id)
        if (!screw) return

        screw.style.display = 'none'
        st.enabled = false

        if (!lastScript || !lab.control) return
        const updatedScript = screw.textContent
        if (updatedScript !== lastScript) {
            lab.control.screwUp( updatedScript )

            // TODO store log in local store
        }
    }

    function show() {
        const screw = document.getElementById(st.id)
        if (!screw) return

        syncIn()
        screw.style.display = 'block'
        adjust()
        st.enabled = true
    }

    function load(script) {
        const screwUpPath = st.loadURL + '/' + script
        loadRes(screwUpPath, (raw) => {
            lab.control.screwUp(raw)

        })
    }

    function save() {
        const screw = document.getElementById(st.id)
        if (!screw) return

        const args = location.hash.split('/')
        const box = args[0]
        if (box !== '#boxCorkscrew') throw 'Malformed corkscrew url!'

        const upName = args[1]
        const upPath = this.st.uploadURL + '/' + upName
        if (!upName)throw 'No screw script name provided in the URL!'

        const nextScript = screw.textContent

        console.log(`saving [${upPath}]...`)
        console.log(nextScript)

        uploadRes(upPath, nextScript, (res) => {
            console.log('got feedback response')
            console.dir(res)
        })
    }

    function adjust() {
        let c = document.getElementById(st.id)
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
        st,
        adjust,
        hide,
        show,
        load,
        save,
    }

})(this)

function zapCorkscrew() {
    corkscrew.hide()
    corkscrew.adjust()
}
