let corkscrew = (function(window) {

    let lastScript

    const st = {
        id:        'screw',
        disabled:  false,
        loadURL:   'screw',
        uploadURL: 'up',
        backupURL: 'backup',
        scriptExt: '.up',
    }

    function syncIn() {
        const screw = document.getElementById(st.id)
        if (!screw || env.screwEditorUpdates) return

        lastScript = lab.control.activeScript()
        screw.textContent = lastScript
    }

    function hide() {
        const screw = document.getElementById(st.id)
        if (!screw) return

        screw.style.display = 'none'
        st.disabled = true
        env.screwing = false
        if (lab.broker) lab.broker.disabled = false

        if (!lastScript || !lab.control) return
        const updatedScript = screw.textContent
        if (updatedScript !== lastScript) {
            env.screwEditorUpdates = true
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
        st.disabled = false
        env.screwing = true
        lab.broker.disabled = true
    }

    function load(script) {
        const screwUpPath = st.loadURL + '/' + script
        loadRes(screwUpPath, (raw) => {
            lab.control.screwUp(raw)
        })
    }

    function saveTarget(backup) {
        const screw = document.getElementById(st.id)
        if (!screw) return

        const args = location.hash.split('/')
        const box = args[0]
        if (box !== '#boxCorkscrew') throw 'Malformed corkscrew url!'

        const upName = args[1]
        const upPath = (backup? st.backupURL : st.uploadURL) + '/' + upName
        if (!upName) throw 'No screw script name provided in the URL!'

        const plainText = screw.textContent

        return {
            name: upName,
            path: upPath,
            data: plainText,
        }
    }

    function save(backup) {
        const tar = saveTarget(backup)
        if (!tar) return

        uploadRes(tar.path, tar.data, (res) => {
            log(`[${tar.path}] upload is successful: ${res.status} ${res.statusText}`)
        })
    }

    function backup() {
        save(true)
    }

    function saveLocal() {
        const tar = saveTarget()
        if (!tar) return
        saveLocalFile(tar.name + st.scriptExt, tar.data)
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
        backup,
        saveLocal,
    }

})(this)

function zapCorkscrew() {
    corkscrew.hide()
    corkscrew.adjust()
}
