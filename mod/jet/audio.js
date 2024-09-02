const fmx = (() => {

let actx, aout
const ch = []

let masterVolume = .3
let currentChannel = 0


function createChannel(n) {
    const channel = ch[n] = {}

    // create Oscillator node
    const carrier = actx.createOscillator()
    channel.carrier = carrier
    carrier.type = "sine"

    const modulator = actx.createOscillator()
    channel.modulator = modulator
    modulator.type = "sine"
    modulator.frequency.value = 220

    // setup the FM
    const mgain = actx.createGain()
    channel.modulatorGain = mgain
    mgain.gain.value = 3000

    // route the modulation for the signal
    modulator.connect(mgain)
    mgain.connect(carrier.frequency)

    channel.volumeGain = actx.createGain()
    channel.volumeGain.gain.value = 0
    channel.volumeGain.connect(aout)

    carrier.connect(channel.volumeGain)

    channel.modulator.start()
    channel.carrier.start()
}

function init() {
    actx = new AudioContext()
    aout  = actx.destination
    createChannel(0)
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
    channel.modulator.frequency.value = channel.carrier.frequency.value * 1.1
    channel.volumeGain.gain.value = masterVolume
}

function off() {
    const channel = ch[currentChannel]
    channel.volumeGain.gain.value = 0
}


return {
    init,
    on,
    off,
}

})()

function zapAudioController() {

    trap.register('keyDown', (e) => {
        switch(e.code) {
            case 'KeyQ': fmx.on(0); break;
            case 'KeyW': fmx.on(1); break;
            case 'KeyE': fmx.on(2); break;
            case 'KeyR': fmx.on(3); break;
            case 'KeyT': fmx.on(4); break;
            case 'KeyY': fmx.on(5); break;
            case 'KeyU': fmx.on(6); break;
            case 'KeyI': fmx.on(7); break;
            case 'KeyO': fmx.on(8); break;
            case 'KeyP': fmx.on(9); break;
            case 'KeyA': fmx.on(10); break;
            case 'KeyB': fmx.on(11); break;
        }
    })

    trap.register('keyUp', (e) => {
        switch(e.code) {
            case 'KeyQ': case 'KeyW': case 'KeyR': case 'KeyT':
            case 'KeyY': case 'KeyU': case 'KeyI': case 'KeyO':
            case 'KeyP': case 'KeyA': case 'KeyB':
                fmx.off(); break;
        }
    })

    trap.register('mdn', (e) => {
        // the user interaction has started!
        fmx.init()
    })

}
