_commands = {

    hitboxes: function() {
        env.showHitboxes = !env.showHitboxes
    },
    _hitboxes: 'turn hitboxes on and off',

    help: function(cmd) {
        const dir = {}
        for (c in _commands) {
            const v = _commands[c]
            if (typeof v === 'function') {
                dir[c] = dir[c] || {}
                dir[c].fn = v
            } else if (c.startsWith('_') && typeof v === 'string') {
                // got a help message
                const name = c.substring(1)
                dir[name] = dir[name] || {}
                dir[name]._usage = v
            }
        }

        for (cmd in dir) {
            const usage = dir[cmd]._usage || ''
            term.println(cmd + (usage? ' - ' + usage : ''))
        }
    },

    exit: function(cmd) {
        env.termit = false
        env.disabled = false
        hideTermit()
    },
}

