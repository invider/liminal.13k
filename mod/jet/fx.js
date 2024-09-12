const fx = (() => {
let aux, aO, zx, R, vol


return extend(
    (n) => {
        if (!zx) return
        log(`#${n-2} vol: ${dd[1][n-2]}`)
        vol = env.vol * dd[1][n-2]
        zx(...dd[n])
    }, {
        touch: () => {
            if (!aux || aux.state === 'suspended') {
                aux = new AudioContext()
                aO = aux.destination
                R = aux.sampleRate
            }
            zx=(p=1,k=.05,b=220,e=0,r=0,t=.1,q=0,D=1,u=0,y=0,v=0,z=0,l=0,E=0,A=0,F=0,c=0,w=1,m=0,B=0
            ,N=0)=>{let M=Math,d=2*M.PI,R=44100,G=u*=500*d/R/R,C=b*=(1-k+2*k*M.random(k=[]))*d/R,
            g=0,H=0,a=0,n=1,I=0,J=0,f=0,h=N<0?-1:1,x=d*h*N*2/R,L=M.cos(x),Z=M.sin,K=Z(x)/4,O=1+K,
            X=-2*L/O,Y=(1-K)/O,P=(1+h*L)/2/O,Q=-(h+L)/O,S=P,T=0,U=0,V=0,W=0;e=R*e+9;m*=R;r*=R;t*=
            R;c*=R;y*=500*d/R**3;A*=d/R;v*=d/R;z*=R;l=R*l|0;p*=vol;for(h=e+m+r+t+c|0;a<h;k[a++]
            =f*p)++J%(100*F|0)||(f=q?1<q?2<q?3<q?Z(g**3):M.max(M.min(M.tan(g),1),-1):1-(2*g/d%2+2)
            %2:1-4*M.abs(M.round(g/d)-g/d):Z(g),f=(l?1-B+B*Z(d*a/l):1)*(f<0?-1:1)*M.abs(f)**D*(a<
            e?a/e:a<e+m?1-(a-e)/m*(1-w):a<e+m+r?w:a<h-c?(h-a-c)/t*w:0),f=c?f/2+(c>a?0:(a<h-c?1:(h
            -a)/c)*k[a-c|0]/2/p):f,N?f=W=S*T+Q*(T=U)+P*(U=f)-Y*V-X*(V=W):0),x=(b+=u+=y)*M.cos(A*
            H++),g+=x+x*E*Z(a**5),n&&++n>z&&(b+=v,C+=v,n=0),!l||++I%l||(b=C,u=G,n=n||1);p=aux.
            createBuffer(1,h,R);p.getChannelData(0).set(k);b=aux.createBufferSource();
            b.buffer=p;b.connect(aO);b.start()}

            // normalize sfx arrays
            for (let i = 1; i < dd.length; i++) {
                for (let j = 0; j < dd[i].length; j++) if (dd[i][j] === 0) dd[i][j] = undefined
            }
        },
        up: (T) => {
            if (!aux) return
            // create aux buffer and copy rendered data
            let L = T*R,
                b = aux.createBuffer(1, L, R),
                d = b.getChannelData(0),
                i = 0, t, j = 0, f1, f2

            function fq(t) {
                j--
                if (j < 0) {
                    j = 2000 + 4000 * rnd()
                    f1 = 200 + 400 * rnd()
                    f2 = 200 + 400 * rnd()
                }
                return (((t * 50) % 1) < .5)? f1 : f2
            }

            while (i < L) {
                t = i/R
                d[i++] = Math.sign(Math.sin(PI2 * fq(t) * t))
            }

            const bufs = aux.createBufferSource(),
                  gain = aux.createGain()
            bufs.buffer = b
            gain.gain.value = env.vol * 0.03
            bufs.connect(gain)

            gain.connect(aO)
            bufs.start(0)
        }
    }
)

})()

    /*
    smp = [],  // aamples
    // SFX source functions
    f = [
        // noise
        () => 2*rnd() - 1,
    ],
    */

    /*
    // patch route structure
    TARGET    = 0,    // target oscillator, -1 if a carrier oscillator
    TYPE      = 1,    // wave type
    FQM       = 2,    // frequency modifier
    ATTACK    = 3,    // attack time
    PEAK      = 4,    // attack peak value
    DECAY     = 5,    // decay time
    SUSTAIN   = 6,    // sustain value
    RELEASE   = 7,    // release time

    SIN      = 0,
    SQR      = 1,
    SAW      = 2,
    TRI      = 3,
    NSE      = 4,
    OSC      = [
        'sine',
        'square',
        'sawtooth',
        'triangle'
    ],
    // patches
    p = [
        // 0 - sine wave
        [
            // route target, wave, attack time, peak, decay time/value, release time
            // TAR-TYPE-FQM-ATK-PIK-DCY-SUS-REL
            [   -1, SIN,  1, .2,  1, .3, .5, 1 ],
        ],
        [
            // TAR-TYPE-FQM-ATK-PIK-DCY-SUS-REL
            [   -1, SAW,  1, .2,  1, .3, .5, .2 ],
        ],
        [
            // TAR-TYPE-FQM-ATK-PIK-DCY-SUS-REL
            [   -1, TRI,  1, .2,  1, .3, .5, .2 ],
        ],
        [
            // TAR-TYPE-FQM-ATK-PIK-DCY-SUS-REL
            [   -1, SQR,  1, .2,  1, .3, .5, .2 ],
        ],
        [
            // TAR-TYPE-FQM-ATK-  PIK   -DCY-SUS-REL
            [   -1, TRI,  1, .1,  1,    .8,  .5, .2 ],
            [    0, SIN,  1, .2,  3000,  1,  .2, .1 ],
        ],
    ],
    ch = []
*/

/*
// === SFX ===
function createSample(s, f) {
    // create aux buffer and copy rendered data
    let b = aux.createBuffer(1, 9*R, R)
    let d = b.getChannelData(0)

    // render the sound
    for (let i = 0; i < 9*R; i++) d[i] = s(i, f)
    smp.push(b)
}
*/

/*
function play(note, fq, at, len, ipatch) {
    // create the patch routing table
    const routes = [], gains = []
    if (!fq) fq = 440 * (2 ** ((note - 45)/12))
    log('#' + note + ' @' + fq + ' !' + ipatch)

    const masterGain = aux.createGain()
    masterGain.gain.value = env.vol
    masterGain.connect(aout)

    p[ipatch].forEach((patch, i) => {
        const osc = aux.createOscillator()
        osc.type = OSC[ patch[TYPE] ]
        osc.frequency.setValueAtTime(fq * patch[FQM], at)

        const envelope = aux.createGain()
        envelope.gain.setValueAtTime(0, at)
        envelope.gain.linearRampToValueAtTime(patch[PEAK], at + patch[ATTACK])
        envelope.gain.linearRampToValueAtTime(patch[SUSTAIN], at + patch[ATTACK] + patch[DECAY])
        osc.connect(envelope)

        // route oscilator -> gain -> ...
        if (patch[TARGET] < 0) {
            envelope.connect(masterGain)
        } else {
            const carrier = routes[ patch[TARGET] ]
            envelope.connect( carrier.frequency )  // [!] important to connect directly to freq
        }

        // start oscilator at scheduled time
        osc.start(at)

        if (len) {
            // scheduling
            envelope.gain.setValueAtTime(patch[SUSTAIN], at + len)
            envelope.gain.linearRampToValueAtTime(0, at + len + patch[RELEASE])
            osc.stop(at + len + patch[RELEASE]) // TODO wait for the note-off if len is not specified
        }

        routes[i] = osc
        gains[i] = envelope
    })
    //routes.forEach(osc => osc.start(at))

    // live play
    if (!len) for (let i = 1; i < 64; i++) {
        if (!ch[i]) {
            ch[i] = {
                patch: p[ipatch],
                routes,
                gains,
            }
            return i
        }
    }

    //const carrier = aux.createOscillator()
    //carrier.type = "sine"
    //carrier.frequency.value = fq

    //const modulator = aux.createOscillator()
    //modulator.type = "triangle"
    //modulator.frequency.value = fq * .25

    // setup the FM
    //const mgain = aux.createGain()
    //mgain.gain.value = 3000

    // route the modulation for the signal
    //modulator.connect(mgain)
    //mgain.connect(carrier.frequency) // FM

    //const volumeGain = aux.createGain()
    //volumeGain.gain.value = env.vol
    //volumeGain.connect(aout)

    //carrier.connect(volumeGain)

    //modulaor.start(at)
    //carrier.start(at)

    //modulator.stop(at + len)
    //carrier.stop(at + len)
}

function playin(note, fq, delay, len, patch) {
    return play(note, fq, aux.currentTime + delay, len, patch)
}
*/

/*
function off(id) {
    const n = ch[id], at = aux.currentTime
    n.patch.forEach((patch, i) => {
        n.gains[i].gain.setValueAtTime(patch[SUSTAIN], at)
        n.gains[i].gain.linearRampToValueAtTime(0, at + patch[RELEASE])
        n.routes[i].stop(at + patch[RELEASE])
        n.kt = at + patch[RELEASE]
    })
    setTimeout(() => {
        ch[id] = null
    }, 5000)
}
*/

/*
function createChannel(n) {
    const channel = ch[n] = {}

    // create Oscillator node
    const carrier = aux.createOscillator()
    channel.carrier = carrier
    carrier.type = "sine"

    const modulator = aux.createOscillator()
    channel.modulator = modulator
    modulator.type = "triangle"
    modulator.frequency.value = 220

    // setup the FM
    const mgain = aux.createGain()
    channel.modulatorGain = mgain
    mgain.gain.value = 3000

    // route the modulation for the signal
    modulator.connect(mgain)
    mgain.connect(carrier.frequency)

    channel.volumeGain = aux.createGain()
    channel.volumeGain.gain.value = 0
    channel.volumeGain.connect(aout)

    carrier.connect(channel.volumeGain)

    channel.modulator.start()
    channel.carrier.start()
}
*/

/*
*/
    /*
    const bufs = aux.createBufferSource(),
          gain = aux.createGain()
    bufs.buffer = smp[n]
    gain.gain.value = env.vol
    bufs.connect(gain)

    gain.connect(aout)
    bufs.start(0)
    */


