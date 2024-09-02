screwUp = (() => {

    // op types
    const END  = 0,
          DEF  = 1,
          NUM  = 2,
          STR  = 3,
          ID   = 4

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

    return (src) => {
        const rawLines = src.split('\n').map(l => l.trim())

        const tokens = []
        rawLines.forEach((l, N) => {
            if (!isEmptyLine(l)) {
                parseLine(l, N, tokens)
            }
        })

        return tokens
    }
})()
