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
                break
        }
    })

}

