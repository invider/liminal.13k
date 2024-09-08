let aux
const fx = (() => {

let aout, dt, R,
    currentChannel = 0
const
    ch  = [],
    smp = [],  // samples
    // SFX source functions
    f = [
        // noise
        () => 2*rnd() - 1,
    ]

// === SFX ===
function createSample(s, f) {
    // create aux buffer and copy rendered data
    let b = aux.createBuffer(1, 9*R, R)
    let d = b.getChannelData(0)

    // render the sound
    for (i = 0; i < 9*R; i++) d[i] = s(i, f)
    smp.push(b)
}

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

function touch() {
    if (!aux) {
        aux = new AudioContext()
        aout = aux.destination
        R    = aux.sampleRate
        dt   = 1/R
        createChannel(0)

        // generate samples - one for each sample function
        f.map(x => createSample(x))
    }
    /*
    const modOsc1Gain = ctx.createGain()
    modOsc1Gain.gain.value = 3000
    modOsc1.connect(modOsc1Gain)

    modOsc1Gain.connect(carOsc.frequency)
    */
}

function on(note) {
    const channel = ch[currentChannel]
    channel.carrier.frequency.value = 440 + (440/12) * note
    channel.modulator.frequency.value = channel.carrier.frequency.value * .25
    channel.volumeGain.gain.value = env.vol 
}

function off() {
    const channel = ch[currentChannel]
    channel.volumeGain.gain.value = 0
}

function play(fq, at, len, patch) {
    const carrier = aux.createOscillator()
    carrier.type = "sine"
    carrier.frequency.value = fq

    const modulator = aux.createOscillator()
    modulator.type = "triangle"
    modulator.frequency.value = fq * .25

    // setup the FM
    const mgain = aux.createGain()
    mgain.gain.value = 3000

    // route the modulation for the signal
    modulator.connect(mgain)
    mgain.connect(carrier.frequency) // FM

    const volumeGain = aux.createGain()
    volumeGain.gain.value = env.vol
    volumeGain.connect(aout)

    carrier.connect(volumeGain)

    modulator.start(at)
    carrier.start(at)

    modulator.stop(at + len)
    carrier.stop(at + len)
}

function playin(note, delay, len, patch) {
    play(note, aux.currentTime + delay, len, patch)
}

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
    touch,
    on,
    off,
    play,
    playin,
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
