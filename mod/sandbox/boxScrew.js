_.boxScrew = (() => {

    const _ = {}

    _.testInt = function() {
        const enops = screwUp('neogeo 0 1 1 0 1')
        geo(enops)

        expect(enops.split('')).prop('length').toBe(11)
        expect(geo.cs(), 'geo-stack')
            .prop('length').toBe(5).up()
            .elementsMatch([0, 1, 1, 0, 1])
    }

    _.testNegative = function() {
        const enops = screwUp('neogeo 1 -1 2 -2 3 -3')
        geo(enops)

        expect(enops.split('')).prop('length').toBe(13)
        expect(geo.cs(), 'geo-stack')
            .prop('length').toBe(6).up()
            .elementsMatch([1, -1, 2, -2, 3, -3])
    }

    _.testInt1 = function() {
        const enops = screwUp('neogeo 5 7 14 21 32 41')
        geo(enops)

        expect(enops.split('')).prop('length').toBe(13)
        expect(geo.cs(), 'geo-stack')
            .prop('length').toBe(6).up()
            .elementsMatch([5, 7, 14, 21, 32, 41])
    }

    _.testInt2 = function() {
        const enops = screwUp('neogeo 45 46 91 92 93 94    -46 -47 -48 -91 -92 -93 -94')
        geo(enops)

        console.dir(geo.cs())
        expect(enops.split('')).prop('length').toBe(39)
        expect(geo.cs(), 'geo-stack')
            .prop('length').toBe(13).up()
            .elementsMatch([
                     45, 46, 91, 92, 93, 94,
                    -46, -47, -48, -91, -92, -93, -94])
    }

    _.testInt3 = function() {
        const enops = screwUp('neogeo 2115 2116 2117   -2115 -2116 -2117   8648 9001 97335')
        geo(enops)

        console.dir(geo.cs())
        expect(enops.split('')).prop('length').toBe(35)
        expect(geo.cs(), 'geo-stack')
            .prop('length').toBe(9).up()
            .elementsMatch([
                2115, 2116, 2117,
                -2115, -2116, -2117,
                8648, 9001, 97335,
            ])
    }

    _.testInt4 = function() {
        const enops = screwUp('neogeo 97335 97336 97337    -97335 -97336 -97337 4477455')
        geo(enops)

        console.dir(geo.cs())
        expect(enops.split('')).prop('length').toBe(34)
        expect(geo.cs(), 'geo-stack')
            .prop('length').toBe(7).up()
            .elementsMatch([
                 97335,  97336,  97337,
                -97335, -97336, -97337,
                 4477455 ])
    }

    _.testInt4Overflow = function() {
        expect(() => screwUp('neogeo 4477455 4477456')).toFail()
    }

    _.testFloat = function() {
        const enops = screwUp('neogeo 0.1 -0.1 0.2 -0.2 0.9 -0.9 1.5 -1.5')
        geo(enops)

        expect(enops.split('')).prop('length').toBe(17)
        expect(geo.cs(), 'geo-stack')
            .prop('length').toBe(8).up()
            .elementsMatch([ 0.1, -0.1, 0.2, -0.2, 0.9, -0.9, 1.5, -1.5])
    }

    _.testDouble = function() {
        const enops = screwUp('neogeo 0.01 -0.01 0.02 -0.02 0.09 -0.09   1.123 2.901 -1.101 -3.765')
        geo(enops)

        expect(enops.split('')).prop('length').toBe(27)
        expect(geo.cs(), 'geo-stack')
            .prop('length').toBe(10).up()
            .elementsMatch([
                0.01, -0.01, 0.02, -0.02, 0.09, -0.09,
                1.123, 2.901,
                -1.101, -3.765,
            ])
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
