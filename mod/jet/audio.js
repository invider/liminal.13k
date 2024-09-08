let aux
const fx = (() => {

let aout, dt, R

const
    smp = [],  // samples
    // SFX source functions
    f = [
        // noise
        () => 2*rnd() - 1,
    ],

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
    ],
    ch = []

// === SFX ===
function createSample(s, f) {
    // create aux buffer and copy rendered data
    let b = aux.createBuffer(1, 9*R, R)
    let d = b.getChannelData(0)

    // render the sound
    for (i = 0; i < 9*R; i++) d[i] = s(i, f)
    smp.push(b)
}

function touch() {
    if (!aux || aux.state === 'suspended') {
        aux = new AudioContext()
        aout = aux.destination
        R    = aux.sampleRate
        dt   = 1/R

        // generate samples - one for each sample function
        f.map(x => createSample(x))
    }
}

function play(note, fq, at, len, ipatch) {
    // create the patch routing table
    const routes = [], gains = []
    if (!fq) fq = 440 * (2 ** ((note - 45)/12))
    // log('#' + note + ' @' + fq)

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
        patch[TARGET] < 0? envelope.connect(masterGain) : gain.connect(routes[ patch[TARGET] ])

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

    //modulator.start(at)
    //carrier.start(at)

    //modulator.stop(at + len)
    //carrier.stop(at + len)
}

function playin(note, fq, delay, len, patch) {
    return play(note, fq, aux.currentTime + delay, len, patch)
}

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

const sfx = (n) => {
    const bufs = aux.createBufferSource(),
          gain = aux.createGain()
    bufs.buffer = smp[n]
    gain.gain.value = env.vol
    bufs.connect(gain)

    gain.connect(aout)
    bufs.start(0)
}

extend(sfx, {
    p,
    touch,
    play,
    playin,
    off,
})
return sfx

})()

function zapAudioController() {
    // TODO move to trap
    trap.register('mdn', (e) => {
        fx.touch()
    })
    trap.register('keyDown', (e) => {
        fx.touch()
    })
}
