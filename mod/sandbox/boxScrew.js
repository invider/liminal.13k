_.boxScrew = (() => {

    const _ = {}

    _.testInt = function() {
        const enops = screwUp('neogeo 0 1 1 0 1')
        geo.screw(enops)

        expect(enops.split('')).prop('length').toBe(11)
        expect(geo.cs(), 'geo-stack')
            .prop('length').toBe(5).up()
            .elementsMatch([0, 1, 1, 0, 1])
    }

    _.testNegative = function() {
        const enops = screwUp('neogeo 1 -1 2 -2 3 -3')
        geo.screw(enops)

        expect(enops.split('')).prop('length').toBe(13)
        expect(geo.cs(), 'geo-stack')
            .prop('length').toBe(6).up()
            .elementsMatch([1, -1, 2, -2, 3, -3])
    }

    _.testInt1 = function() {
        const enops = screwUp('neogeo 5 7 14 21 32 41')
        geo.screw(enops)

        expect(enops.split('')).prop('length').toBe(13)
        expect(geo.cs(), 'geo-stack')
            .prop('length').toBe(6).up()
            .elementsMatch([5, 7, 14, 21, 32, 41])
    }

    _.testInt2 = function() {
        const enops = screwUp('neogeo 45 46 91 92 93 94    -46 -47 -48 -91 -92 -93 -94 dump')
        geo.screw(enops)

        console.dir(geo.cs())
        //expect(enops.split('')).prop('length').toBe(4)
        expect(geo.cs(), 'geo-stack')
            .prop('length').toBe(13).up()
            .elementsMatch([
                     45, 46, 91, 92, 93, 94,
                    -46, -47, -48, -91, -92, -93, -94])
    }

    _.testFloat = function() {
        const enops = screwUp('neogeo 0.1 -0.1 0.2 -0.2 0.9 -0.9 1.5 -1.5')
        geo.screw(enops)

        expect(enops.split('')).prop('length').toBe(17)
        expect(geo.cs(), 'geo-stack')
            .prop('length').toBe(8).up()
            .elementsMatch([ 0.1, -0.1, 0.2, -0.2, 0.9, -0.9, 1.5, -1.5])
    }

    return () => {
        log('=== crunching numbers ===')

        for (name in _) {
            const fn = _[name]
            if (!name.startsWith('test') || !(typeof fn === 'function')) continue
            log(`--- ${name} ---`)
            try {
                geo.reset()
                fn()
            } catch (e) {
                log(`[${name}] Failed: ${e}`)
                throw e
            }
        }
    }

})()
