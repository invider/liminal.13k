function onOff(v) {
    return v? 'on' : 'off'
}

_commands = {

    hitboxes: function() {
        env.showHitBoxes = !env.showHitBoxes
        term.println('hitboxes: ' + onOff(env.showHitBoxes))
    },
    _hitboxes: 'turn hitboxes on and off',

    backfaces: function() {
        env.backfaces = !env.backfaces
        term.println('backfaces: ' + onOff(env.backfaces))
    },
    _backfaces: 'turn backfaces on and off',

    tween: function() {
        const platform = lab.hero.lastPlatform

        lab.tw.inc({
            tar: platform.pos,
            p: 2,
            v1: platform.pos[2],
            v2: platform.pos[2] + 5,
            t: 5,
            f: _tw.inOut,
        })
    },
    _tween: 'test tweening',

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

