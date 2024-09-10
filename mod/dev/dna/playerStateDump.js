function zapPlayerStateDump() {
    if (!debug) return

    lab.attach({
        name: 'playerStateDump',

        evo(dt) {
            if (!debug || !lab.hero) return

            const __ = lab.hero

            const p = __.pos

            const P = 10
            let hx = Math.round(p[0]*P)/P,
                hy = Math.round(p[1]*P)/P,
                hz = Math.round(p[2]*P)/P
            const sPos = `@${hx}:${hy}:${hz}`

            const pdir = vec3.toSpherical(__.dir)

            let heading = normalAngle(pdir[1] - PI*.5)

            let wheading = normalAngle(heading + PI2/16)
            const q = Math.floor(wheading/PI2 * 8)

            let w
            switch(q) {
                case 0: w = 'N';  break;
                case 1: w = 'NE'; break;
                case 2: w = 'E';  break;
                case 3: w = 'SE'; break;
                case 4: w = 'S';  break;
                case 5: w = 'SW'; break;
                case 6: w = 'W';  break;
                case 7: w = 'NW'; break;
            }
            const sDir = ' ^' + rpad(w, 2) + ' '
                + lpad('' + Math.round(heading * RAD_TO_DEG), 3) + '* '

            env.status = 'hero: ' + sDir + sPos + ' speed: ' + floor(vec3.len(__.mt))
        }
    })
}
