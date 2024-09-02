_cmd = {

    help: function(cmd) {
        term.println("Can't help you")
    },

    exit: function(cmd) {
        env.termit = false
        env.disabled = false
        hideTermit()
    },
}

function zapTermitTrap() {

    trap.register('termit', (cmd) => {
        const args = cmd.split(/\s+/)
        const command = args[0]

        const fn = _cmd[command]
        if (fn) {
            fn(args, cmd)
        } else {
            const msg = `Unknown console command: [${command}]`
            term.println(msg)
            console.error(msg)
        }
    })

    // move out to dev tools setup or something?
    trap.register('keyDown', (e) => {
        switch(e.code) {
            case 'F4':
                if (env.termit) {
                    _cmd.exit()
                } else {
                    env.termit = true
                    env.disabled = true
                    showTermit()
                }
                e.preventDefault()
                break

            case 'F7':
                if (corkscrew.st.enabled) {
                    corkscrew.hide()
                } else {
                    corkscrew.show()
                }
                e.preventDefault()
                break

            case 'F2':
                corkscrew.save()

                e.preventDefault()
                break
        }
    })

}

