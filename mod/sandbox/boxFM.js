let fmPatch = 1, fmOctave = 2, fmTranspose = 0

_.boxFM = (() => {

    function playSequence() {
        const pattern = 'ABD.ABDD....BDEF...TGDDG...WWW...ETYT....aabie'
        const notes = pattern.split('').map(c => {
            if (c === '.') return 0
            return (c.charCodeAt(0) - 65 + 12)
        })

        const step = .25
        const start = aux.currentTime
        notes.forEach(((n, i) => {
            if (n) fx.play(n, 0, start + i*step, step, 1)
        }))
    }

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
            }
        })

        trap.register('keyUp', (e) => {
            const i = keyMap.indexOf(e.code)
            if (i >= 0) off(i)
        })
    }

    // === MIDI ===
    const MIDI_NOTE_SHIFT = 24
          MIDI_NOTE_ON  = 144,
          MIDI_NOTE_OFF = 128
          MIDI_KNOB     = 176

    const midiKeys = []

    function midiON(key, speed) {
        midiOFF(key)

        n = key - MIDI_NOTE_SHIFT
        const channel = fx.play(n, 0, aux.currentTime, 0, fmPatch)
        midiKeys[key] = channel
    }

    function midiOFF(key, speed) {
        const channel = midiKeys[key]
        if (channel) {
            fx.off(channel)
            midiKeys[key] = 0
        }
    }

    function onMIDI(e) {
        log(`#${e.data[0]}: ${e.data[1]} (${e.data[2]})`)
        console.dir(e)
        switch (e.data[0]) {
            case MIDI_NOTE_ON:
                midiON(e.data[1], e.data[2])
                break
            case MIDI_NOTE_OFF:
                midiOFF(e.data[1], e.data[2])
                break
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
        geo.screw(enops)

        lab.attach( new Body({
            pos: vec3(0, 0, -1),
            rot: vec3(0, 0, 0),
            rotSpeed: vec3(0, 0, 0),
            scale: vec3(1, 1, 1),

            _pods: [
                new Surface({
                    geo: glib.sphere,
                    mat: {
                        Ka: vec3(.5, .6, .7),
                        Kd: vec3(.1, .8, .9),
                        Ks: vec3(1, 1, 1),
                        Ke: vec3(1, 1, 1),
                        Lv: vec4(.2, .5, .8, 0),
                        Ns: 50,
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
