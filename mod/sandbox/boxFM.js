let fmPatch = 0,
    fmOscillator = 0,
    _fmOsc,
    fmOctave = 2,
    fmTranspose = 0

const UNIT_PROP_FADER  = 1,
      UNIT_INDEX_FADER = 2

class Fader {

    constructor(id, target, index, type) {
        this.id = id
        this.target = target
        this.index = index
        this.type = type || 0
        log(`#${id}: binding fader`)
    }

    fade(val) {
        log(`#${this.id}: !${val}`)

        switch(this.type) {
            case UNIT_PROP_FADER:
                this.target[this.index] = val/127
                break
            case UNIT_INDEX_FADER:
                this.target[this.index] = val/127
                break
        }
    }
}

class PatchSelectionFader {

    constructor(id, patches) {
        this.id = id
        this.patches = patches
    }

    fade(val) {
        log(`#${this.id}: !${val}`)
        console.dir(this.patches)

        let shift = 1
        if (val < this.lastVal) shift = -1
        fmPatch += shift
        if (fmPatch >= this.patches.length) fmPatch = 0
        else if (fmPatch < 0) fmPatch = this.patches.length - 1

        this.lastVal = val
        log('Selected Patch #' + fmPatch)
    }
}

class OscillatorSelectionFader {

    constructor(id, patches) {
        this.id = id
        this.patches = patches
    }

    fade(val) {
        log(`#${this.id}: !${val}`)
        console.dir(this.patches)

        const patch = this.patches[fmPatch]

        let shift = 1
        if (val < this.lastVal) shift = -1
        fmOscillator += shift
        if (fmOscillator >= patch.length) fmOscillator = 0
        else if (fmOscillator < 0) fmOscillator = patch.length - 1

        this.lastVal = val
        log('Selected Oscillator #' + fmOscillator)
        _fmOsc = patch[fmOscillator]
        console.dir(_fmOsc)
    }
}

_.boxFM = (() => {

    // ====== SEQUENCER ======
    function playSequence() {
        const pattern = 'BBAA....CCAA....ABCD....ABCD'
        const notes = pattern.split('').map(c => {
            if (c === '.') return 0
            return (c.charCodeAt(0) - 65 + 12)
        })

        const step = .25
        const start = aux.currentTime
        notes.forEach(((n, i) => {
            if (n) fx.play(n, 0, start + i*step, step, 1, fmPatch)
        }))
    }

    class Pattern {

        constructor(pattern, startTime) {
            this.loop = true
            this.transpose = 10
            this.startTime = startTime
            this.notes = pattern.split('').map(c => {
                if (c === '.') return 0
                return (c.charCodeAt(0) - 65 + 12)
            })
        }

        tick(beat) {
            // assume looping
            const lbeat = beat % this.notes.length
            const note = this.notes[lbeat]
            if (note) return {
                n: note + this.transpose,
                l: 1,
            }
        }

    }

    lab.attach({
        name: 'sequencer',
        playing: false,
        bpm: 120,
        lastBeat: -1,
        gap: 1,

        pattern: new Pattern('ACDFGDFACFDFDCSDCX', 0),

        play: function() {
            this.playing = true
            this.lastBeat = -1
            this.startTime = aux.currentTime
            log('[sequencer] playing')
        },

        stop: function() {
            this.playing = false
            log('[sequencer] stopped')
        },

        evoBeat(beat, beatTime, rt) {
            const note = this.pattern.tick(beat)
            if (note) {
                fx.play(note.n, 0, rt, note.l * beatTime, fmPatch)
            }
        },

        evo: function(dt) {
            if (!this.playing) return

            const ct = aux.currentTime
            const playTime = ct - this.startTime
            const curBeat = Math.ceil((playTime / 60) * this.bpm)
            const beatRelTime = this.startTime + curBeat * (60/this.bpm)

            if (curBeat > this.lastBeat) {
                this.evoBeat(curBeat, 60/this.bpm, beatRelTime)
                this.lastBeat = curBeat
            }
        },
    })



    function on(N) {
        off(N)
        n = N + (fmOctave * 12) + fmTranspose
        const channel = fx.play(n, 0, aux.currentTime, 0, fmPatch)
        keyActive[N] = channel
    }

    function off(N) {
        const channel = keyActive[N]
        if (channel) {
            fx.off(channel)
            keyActive[N] = 0
        }
    }

    // === Kontrol ===
    const keyMap = [
        'KeyZ', 'KeyS', 'KeyX', 'KeyD', 'KeyC',
        'KeyV', 'KeyG', 'KeyB', 'KeyH', 'KeyN', 'KeyJ', 'KeyM',
        'KeyQ', 'Digit2', 'KeyW', 'Digit3', 'KeyE',
        'KeyR', 'Digit5', 'KeyT', 'Digit6', 'KeyY', 'Digit7', 'KeyU',
    ]

    const keyActive = []

    function registerSynthControls() {
        trap.register('keyDown', (e) => {
            const i = keyMap.indexOf(e.code)
            if (i >= 0) on(i)

            switch(e.code) {
                case 'Home': playSequence(); break;
                case 'PageDown': lab.sequencer.play(); break;
                case 'End': lab.sequencer.stop(); break;
            }
        })

        trap.register('keyUp', (e) => {
            const i = keyMap.indexOf(e.code)
            if (i >= 0) off(i)
        })
    }

    // === MIDI ===
    const MIDI_NOTE_SHIFT = 24
          MIDI_CHANNELS = 16,
          MIDI_NOTE_ON  = 144,
          MIDI_NOTE_OFF = 128,
          MIDI_FADER    = 176

    const midiKeys = [], faders = []

    let ifaders = 0
    function addFader(fader) {
        ifaders++
        faders[fader.id] = fader
        return fader
    }
    addFader( new Fader(1, env, 'vol', UNIT_PROP_FADER) )

    function midiON(midiChannel, key, speed) {
        midiOFF(key)

        n = key - MIDI_NOTE_SHIFT
        const channel = fx.play(n, 0, aux.currentTime, 0, fmPatch)
        midiKeys[key] = channel
    }

    function midiOFF(midiChannel, key, speed) {
        const channel = midiKeys[key]
        if (channel) {
            fx.off(channel)
            midiKeys[key] = 0
        }
    }

    function onMIDI(e) {
        const type = e.data[0]
        log(`#${type}: ${e.data[1]} (${e.data[2]})`)
        // console.dir(e)
        if (type >= MIDI_NOTE_ON && type < MIDI_NOTE_ON + MIDI_CHANNELS) {
            const midiChannel = type - MIDI_NOTE_ON
            midiON(midiChannel, e.data[1], e.data[2])
        } else if (type >= MIDI_NOTE_OFF && type < MIDI_NOTE_OFF + MIDI_CHANNELS) {
            const midiChannel = type - MIDI_NOTE_OFF
            midiOFF(midiChannel, e.data[1], e.data[2])
        } else if (type === MIDI_FADER) {
            const fid = e.data[1]
            let fader = faders[fid]
            if (!fader) {
                if (ifaders === 1) {
                    fader = faders[fid] = addFader( new PatchSelectionFader(fid, fx.p) )
                } else if (ifaders === 2) {
                    fader = faders[fid] = addFader( new OscillatorSelectionFader(fid, fx.p) )
                } else {
                    fader = faders[fid] = addFader( new Fader(fid, _fmOsc, ifaders, UNIT_INDEX_FADER) )
                    //fader = faders[fid] = addFader( new Fader() )
                }
            }
            fader.fade(e.data[2])
        }
    }

    function bindMIDI() {
        navigator.requestMIDIAccess().then((midiAccess) => {
            // Get lists of available MIDI controllers
            const inputs = midiAccess.inputs.values()
            const outputs = midiAccess.outputs.values()
            inputs.forEach(input => { 
                log('<= ' + input.name)
                input.onmidimessage = onMIDI
            })
            outputs.forEach(output => log('=> ' + output.name))

            midiAccess.onstatechange = (event) => {
               // Print information about the (dis)connected MIDI controller
               log(event.port.name, event.port.manufacturer, event.port.state);
            }
        }, (failure) => {
            log('Failed to get MIDI')
        })
    }

    return () => {
        log('=== Audio Engine Test ===')
        createDiscoBall()
        fixCamera()
        registerSynthControls()
        bindMIDI()
    }

    // some visuals
    function createDiscoBall() {
        log('add a disco ball :)')
        let enops = screwUp('neogeo sphere 4 scale "sphere" name brew')
        geo(enops)

        lab.attach( new Form({
            pos: vec3(0, 0, -1),
            rot: vec3(0, 0, 0),
            rotSpeed: vec3(0, 0, 0),
            scale: vec3(1, 1, 1),

            _pods: [
                new Surface({
                    geo: glib.sphere,
                    m: {
                        a: vec4(.5, .6, .7, .2),
                        d: vec4(.1, .8, .9, .5),
                        s: vec4(1, 1, 1, .8),
                        n: 50,
                    },
                }),
            ],

            init() {
                this.rotSpeed[0] = .5
                this.rotSpeed[1] = .3 
            },

            evo: function(dt) {
                this.rot[0] += this.rotSpeed[0] * dt
                this.rot[1] += this.rotSpeed[1] * dt 
                this.rot[2] += this.rotSpeed[2] * dt 
            },
        }))

    }

    function fixCamera() {
        // move camera back a little
        lab.cam.pos[1] = 4
        lab.cam.pos[2] = 10
        lab.cam.pitch(-.4)
        lab.broker = null  // disable cam controls
    }
})()

// ref tables
const
      // 1 octave
      C1  = 0,
      C$1 = 1,
      D1  = 2,
      D$1 = 3,
      E1  = 4,
      F1  = 5,
      F$1 = 6,
      G1  = 7,
      G$1 = 8,
      A1  = 9,
      A$1 = 10,
      B1  = 11,
      // 2 octave
      C2  = 12,
      C$2 = 13,
      D2  = 14,
      D$2 = 15,
      E2  = 16,
      F2  = 17,
      F$2 = 18,
      G2  = 19,
      G$2 = 20,
      A2  = 21,
      A$2 = 22,
      B2  = 23,
      // 3 octave
      C3  = 24,
      C$3 = 25,
      D3  = 26,
      D$3 = 27,
      E3  = 28,
      F3  = 29,
      F$3 = 30,
      G3  = 31,
      G$3 = 32,
      A3  = 33,
      A$3 = 34,
      B3  = 35,
      // 4 octave
      C4  = 36,
      C$4 = 37,
      D4  = 38,
      D$4 = 39,
      E4  = 40,
      F4  = 41,
      F$4 = 42,
      G4  = 43,
      G$4 = 44,
      A4  = 45,
      A$4 = 46,
      B4  = 47,
      // 5 octave
      C5  = 48,
      C$5 = 49,
      D5  = 50,
      D$5 = 51,
      E5  = 52,
      F5  = 53,
      F$5 = 54,
      G5  = 55,
      G$5 = 56,
      A5  = 57,
      A$5 = 58,
      B5  = 59
