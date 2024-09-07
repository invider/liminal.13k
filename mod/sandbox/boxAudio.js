_.boxAudio = () => {

    function discoBall() {
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

        // move camera back a little
        lab.cam.pos[1] = 4
        lab.cam.pos[2] = 10
        lab.cam.pitch(-.4)
        lab.broker = null  // disable cam controls
    }

    function synthControls() {
        trap.register('keyDown', (e) => {
            switch(e.code) {
                case 'KeyQ': fx.on(0); break;
                case 'KeyW': fx.on(1); break;
                case 'KeyE': fx.on(2); break;
                case 'KeyR': fx.on(3); break;
                case 'KeyT': fx.on(4); break;
                case 'KeyY': fx.on(5); break;
                case 'KeyU': fx.on(6); break;
                case 'KeyI': fx.on(7); break;
                case 'KeyO': fx.on(8); break;
                case 'KeyP': fx.on(9); break;
                case 'KeyA': fx.on(10); break;
                case 'KeyB': fx.on(11); break;
            }
        })

        trap.register('keyUp', (e) => {
            switch(e.code) {
                case 'KeyQ': case 'KeyW': case 'KeyE': case 'KeyR':
                case 'KeyT': case 'KeyY': case 'KeyU': case 'KeyI':
                case 'KeyO': case 'KeyP': case 'KeyA': case 'KeyB':
                    fx.off(); break;
            }
        })
    }

    log('=== Audio Engine Test ===')
    discoBall()

    synthControls()
}
