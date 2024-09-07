screwUp = (() => {

    // op types
    const END  = 0,
          DEF  = 1,
          NUM  = 2,
          STR  = 3,
          ID   = 4

    let lines   // the latest screw srouce splited in lines

    function screwBase(N) {
        let n = N + 32
        if (n > 91) n++
        if (n > 95) n++
        if (n > 126) throw `Screw encoding value overflow: [${N}]`
        return String.fromCharCode(n)
    }

    function screwBaseNumber(N) {
        let n = N * 10
        if (n < 0) {
            if (Math.abs(n) > 42) throw `Screw number value overflow: [${N}]`
            n = 92 + n
        } else {
            if (n > 41) throw `Screw number value overflow: [${N}]`
        }
        if (n % 1 > 0) throw `Lost precision: [${N}]`
        return screwBase(n)
    }

    //
    // === parser ===
    //
    function parse(src, tk) {
        let i = 0,
            line = 0, ptr = 0,
            l = 0, p = 0,
            b = 0

        function getc() {
            if (b) {
                // return buffered
                b = 0
                return buf
            }
            if (i >= src.length) return
            ptr++
            return src.charAt(i++)
        }

        function retc(c) {
            buf = c
            b = 1
        }

        function xerr(msg) {
            throw `${msg} @${line+1}.${ptr+1}:\n${lines[line]}\n${lpad('', ptr)}^`
        }

        function eolf(c) {
            return !c || c === '\n'
        }

        function nextc() {
            if (i >= src.length) return ' '
            return src.charAt(i)
        }

        function next(c) {
            return src.charAt(i) === c
        }

        function inext(c) {
            let j = 0
            while (src.charAt(i+j) === c) j++
            return j
        }

        function lnext() {
            let j = 0
            while (!eolf(src.charAt(i+j))) j++
            return j
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

        function skipLine() {
            c = getc()
            while(c && c !== '\n') {
                c = getc()
            }
            if (c === '\n') {
                line++
                ptr = 0
            }
        }

        let sign = 1
        while (c) {
            l = line, p = ptr - 1
            switch(c) {
                case ' ': case '\t': break;
                case '\n':
                    line++
                    ptr = 0
                    break
                case ':':
                    const last = tk.pop()
                    if (!last && last.t !== ID) xerr(`An identifier is expected before [:]`)
                    last.t = DEF;
                    tk.push(last)
                    break
                case ';': tk.push({
                              t: END,
                              l, p
                          }); break;
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
                            v: str.join(''),
                            w: str,
                            l, p
                        })
                        expectDelim(nextc())
                    }
                    break
                case '#':
                    if (ptr === 1) skipLine() // works only at the beginning of a line
                    break
                case '-':
                    const n = inext('-'), nl = lnext()
                    if (n > 1 && ptr === 1 && nl === n) {
                        // multi-line comment
                        skipLine()
                        let nn = 0
                        do {
                            nn = inext('-') - 1
                            skipLine()
                        } while(c && nn !== n)
                    } else if (n > 0) {
                        skipLine()
                    } else {
                        // just a sing
                        sign = -1
                        let nc = nextc()
                        if (!(nc >= '0' && nc <= '9')) xerr('Number is expected!')
                    }
                    break
                case '=':
                    const m = inext('='), ml = lnext()
                    if (m > 1 && ptr === 1 && ml === m) {
                        // multi-line comment
                        skipLine()
                        let mm = 0
                        do {
                            mm = inext('=') - 1
                            skipLine()
                        } while(c && mm !== m)
                    } else if (m > 0) {
                        skipLine()
                    }
                    break

                default:
                    if (c >= '0' && c <= '9') {
                        let x = 0
                        x = char2Digit(c)

                        c = getc()
                        while(c && c >= '0' && c <= '9') {
                            x = x * 10 + char2Digit(c)
                            c = getc()
                        }

                        if (c === '.') {
                            c = getc()
                            let j = 10
                            while(c && c >= '0' && c <= '9') {
                                x += char2Digit(c)/j
                                c = getc()
                                j *= 10
                            }
                        }
                        expectDelim(c)
                        retc(c)
                        tk.push({
                            t: NUM,
                            v: sign * x,
                            l, p
                        })
                        sign = 1 // + is a default
                    } else {
                        const id = [ c ]

                        c = getc()
                        while(c && !isDelim(c)) {
                            id.push(c)
                            c = getc()
                        }
                        expectDelim(c)
                        retc(c)
                        tk.push({
                            t: ID,
                            v: id.join(''),
                            l, p
                        })
                    }
            }
            c = getc()
        }
        return tk
    }

    /*
    function isEmptyLine(line) {
        return (!line || line.startsWith('#') || line.startsWith('--') || line.startsWith('=='))
    }
    */


    function compile(tk) {
        const opcodes = []

        tk.forEach(t => {

            function cerr(msg, at) {
                at = at || t
                throw `${msg} @${at.l+1}.${at.p+1}:\n${lines[at.l]}\n${lpad('', at.p)}^`
            }

            let opcode
            switch(t.t) {
                case END:
                    // TODO 
                    break
                case DEF:
                    // TODO
                    break
                case NUM:
                    // either short number shortcut
                    // or multi-number loader
                    // or a simple value
                    opcodes.push( screwBase(opsRef.indexOf('pushv')) )
                    opcodes.push( screwBaseNumber(t.v) )
                    break
                case STR:
                    opcode = opsRef.indexOf('pushs')
                    const slen = t.v.length
                    if (slen > 64) cerr(`Max string length (64) is exceeded: ${slen}`)

                    opcodes.push( screwBase(opcode) )
                    opcodes.push( screwBase(slen) )
                    t.w.forEach((c, i) => {
                        const d = c.charCodeAt(0)
                        if (d < 32 || d > 126 || d === 96 || d === 92) {
                            cerr(`Unsupported character: #${d}[${c}]`, { l: t.l, p: t.p + i + 1 })
                        }
                        opcodes.push(c)
                    })

                    break
                case ID:
                    // it is either an opcode or a predefined word
                    opcode = mnemonics.indexOf(t.v)
                    if (opcode < 0) cerr(`Unknown word: [${t.v}]!`)
                    opcodes.push( screwBase(opcode) )

                    break
            }
        })
        return opcodes.join('')
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

    return (src) => {
        lines = src.split('\n')

        const tokens = []
        parse(src, tokens)

        const enops = compile(tokens)
        // console.log('#[' + enops + ']')
        return enops
    }
})()