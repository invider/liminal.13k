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
    function parse(src, lines, tk) {
        let i = 0, l = 0, p = 0, b = 0, buf

        function getc() {
            if (b) {
                // return buffered
                b = 0
                return buf
            }
            if (i >= src.length) return
            p++
            return src.charAt(i++)
        }

        function retc(c) {
            buf = c
            b = 1
        }

        function xerr(msg) {
            throw `${msg} @${l+1}.${p+1}:\n${lines[l]}\n${lpad('', p)}^`
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
                l++
                p = 0
            }
        }

        let sign = 1
        while (c) {
            switch(c) {
                case ' ': case '\t': break;
                case '\n':
                    l++
                    p = 0
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
                            l, p
                        })
                        expectDelim(nextc())
                    }
                    break
                case '#':
                    if (p === 0) skipLine() // works only at the beginning of a line
                    break
                case '-':
                    const n = inext('-'), nl = lnext()
                    if (n > 1 && p === 1 && nl === n) {
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
                    if (m > 1 && p === 1 && ml === m) {
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

    return (src, lines) => {
        const tokens = []
        parse(src, lines, tokens)
        /*
        rawLines.forEach((l, N) => {
            if (!isEmptyLine(l)) {
                parseLine(l, N, tokens)
            }
        })
        */
        return tokens
    }
})()
