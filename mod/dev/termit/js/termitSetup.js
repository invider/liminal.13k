function hideTermit() {
    const termit = document.getElementById('termit')
    if (!termit) return
    termit.disabled = true
    termit.style.display = 'none'
}

function showTermit() {
    const termit = document.getElementById('termit')
    termit.disabled = false
    termit.style.display = 'block'
    term.adjust()
}

const termitHandler = {

    init: function() {
        hideTermit()
    },

    exec: function(cmd) {
        trap('termit', cmd)
    },
}

function zapTerm() {
    term.setHandler(termitHandler)
}

