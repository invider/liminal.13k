function zapTermitTrap() {

    trap.register('termit', (cmd) => {
        const args = cmd.split(/\s+/)
        const command = args[0]

        const fn = _commands[command]
        if (fn && (typeof fn === "function")) {
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
                    _commands.exit()
                } else {
                    env.termit = true
                    env.disabled = true
                    showTermit()
                }
                e.preventDefault()
                break

            case 'F7':
                if (corkscrew.st.disabled) {
                    corkscrew.show()
                } else {
                    corkscrew.hide()
                    corkscrew.backup()
                }
                e.preventDefault()
                break

            case 'F2':
                if (e.ctrlKey || e.metaKey) {
                    corkscrew.saveLocal()
                } else {
                    corkscrew.save()
                }

                e.preventDefault()
                break
        }
    })

}

