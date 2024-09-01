// generate some sample geometry to fill the library
function zapGeoLib() {
    geo.gen().cube().scale(1).name('cubeOne').brew()
        .gen().cube().scale(2).name('cubeTwo').brew()
        .gen().precision(15).sphere().name('sphereOne').brew()
        .gen().precision(25).sphere().name('sphereTwo').brew()
        .gen().precision(25).smooth().sphere().name('sphereTwo').brew()
        .gen().precision(30).sharp().cylinder().scale(2).name('cilinder').brew()
        .gen().cone().scale(2).name('cone').brew()
}

const screwScript = `
# some script tag

== major part
-- generate a simple shape
gen cube "SuperCubeOne" name brew
gen sphere "SuperSphereOne" name brew
gen cylinder "SuperCylinderOne" name brew

-- and that is the end of it
`

const screw = (() => {

    // op types
    const END  = 0,
          DEF  = 1,
          NUM  = 2,
          STR  = 3,
          ID   = 4,
    // emu modes
          EMOD = 0,
          DMOD = 1

    //
    // === parser ===
    //
    function parseLine(line, N, tk) {

        let i = 0
        function getc() {
            if (i >= line.length) return
            return line.charAt(i++)
        }

        function retc(c) {
            if (line.charAt(i)) i--
        }

        function xerr(msg) {
            throw `${msg} @${N+1}.${i+1}:\n${line}\n${lpad('', i)}^`
        }

        function nextc() {
            if (i >= line.length) return ' '
            return line.charAt(i)
        }

        function isSpace(c) {
            return (c === ' ' || c === '\t' || c === '\n' || c === '\r')
        }

        function isSpecial(c) {
            return (c === ':' || c === ';')
        }

        function isDelim(c) {
            return (!c || isSpace(c) || isSpecial(c))
        }

        function expectDelim(c) {
            if (!isDelim(c)) xerr('Delimiter expected')
        }

        function match(c, v) {
            if (c !== v) xerr(`Expected [${v}]`)
        }

        function char2Digit(c) {
            return c.charCodeAt(0) - 48
        }

        let c = getc()
        while (c) {
            switch(c) {
                case ' ': case '\t': case '\n': break;
                case ':':
                    const last = tk.pop()
                    if (!last && last.t !== ID) xerr(`An identifier is expected before [:]`)
                    last.t = DEF;
                    tk.push(last)
                    break
                case ';': tk.push({t: END}); break;
                case '"':
                    let str = []
                    c = getc()
                    while(c && c !== '"') {
                        str.push(c)
                        c = getc()
                    }
                    match(c, '"')
                    if (c === '"') {
                        tk.push({
                            t: STR,
                            v: str.join('')
                        })
                        expectDelim(nextc())
                    }
                    break

                default:
                    if (c >= '0' && c <= '9' || c === '-') {
                        let x = 0, s = 1
                        if (c === '-') s = -1
                        else x = char2Digit(c)

                        c = getc()
                        while(c && c >= '0' && c <= '9') {
                            x = x * 10 + char2Digit(c)
                            c = getc()
                        }
                        expectDelim(c)
                        retc()
                        tk.push({
                            t: NUM,
                            v: s * x,
                        })
                    } else {
                        const id = [ c ]

                        c = getc()
                        while(c && !isDelim(c)) {
                            id.push(c)
                            c = getc()
                        }
                        expectDelim(c)
                        retc()
                        tk.push({
                            t: ID,
                            v: id.join(''),
                        })
                    }
            }
            c = getc()
        }
        return tk
    }

    function isEmptyLine(line) {
        return (!line || line.startsWith('#') || line.startsWith('--') || line.startsWith('=='))
    }

    // DEBUG
    function dumpToken(t) {
        switch(t.t) {
            case 0: return ';';
            case 1: return `![${t.v}]:`;
            case 2: return `#[${t.v}]`
            case 3: return `"${t.v}"`
            case 4: return `@${t.v}`
        }
    }

    // === EMU ===
    const def = {}, brews = []

    function rerr(msg) {
        throw new Error(`Screw Runtime Error: ${msg}`)
    }

    function defineWords(ops) {
        let st = EMOD, word
        const rops = []

        for (let i = 0; i < ops.length; i++) {
            const op = ops[i]
            if (st) {
                // do definition
                if (op.t === END) {
                    st = EMOD
                } else if (op.t === DEF) {
                    rerr(`Can't define a word [${op.v}] inside another word!`)
                } else {
                    word.push(op)
                }
            } else {
                // filter define and runtime ops
                switch(op.t) {
                    case DEF:
                        st = DMOD
                        word = []
                        word.name = op.v
                        def[op.v] = word
                        break
                    case END:
                        rerr(`Unexpected end of a definition`)
                        break
                    default:
                        rops.push(op)
                }
            }
        }
        return rops
    }

    function screwUp(ops) {
        for (let i = 0; i < ops.length; i++) {
            const op = ops[i]
            switch(op.t) {
                case NUM:
                case STR:
                    geo.push(op.v);
                    break;
                case ID:
                    const word = def[op.v]
                    if (word) screwUp(word)
                    else {
                        const a = op.v
                        if (!geo[a]) rerr(`Unknown action [${a}]`)
                        geo[a]()
                        if (a === 'brew') {
                            brews.push(geo.last())
                        }
                    }
                    break
                default:
                    rerr('Unexpected operation: ' + dumpToken(op))
            }
        }
        return brews
    }

    return (src) => {
        const rawLines = src.split('\n').map(l => l.trim())

        const tokens = []
        rawLines.forEach((l, N) => {
            if (!isEmptyLine(l)) {
                parseLine(l, N, tokens)
            }
        })
        //log( tokens.map(t => dumpToken(t)).join(' ') )
        return screwUp( defineWords(tokens) )
    }
})();

