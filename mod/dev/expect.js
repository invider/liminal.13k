function testArray(tar) {
    return Array.isArray(tar)
}

function testTypedArray(tar) {
    const TypedArray = Object.getPrototypeOf(Uint8Array)
    return (tar instanceof TypedArray)
}

function testAnyArray(tar) {
    return (testArray(tar) || testTypedArray(tar))
}

function expect(tar, title, up, upTitle) {
    const tag = title? `[${title} == ${tar}]` : `${tar}`
    const stag = title? `[${title}] ` : ``

    return {
        EPSILON: 0.001,
        toFail: function() {
            this.isFunction(tar)
            try {
                tar()
                throw new Error(`${tag} is expected to fail!`)
            } catch (e) {}
            return this
        },
        toSucceed() {
            this.isFunction(tar)
            try {
                tar()
            } catch (e) {
                throw new Error(`${tag} is expected to succeed, but encountered an error: ${e}`)
            }
            return this
        },
        toBe: function(val) {
            if (tar !== val) throw new Error(`${tag} is expected to be [${val}], but [${tar}] found!`)
            return this
        },
        toBeNear: function(val, epsilon) {
            epsilon = epsilon || this.EPSILON
            if (Math.abs(tar - val) > epsilon)  throw new Error(`${tag} is expected to be near [${val}] (precision: ${epsilon})`)
            return this
        },
        isNull: function() {
            if (tar != null) throw new Error(`${tag} is expected to be null`)
            return this
        },
        isUndefined: function() {
            if (typeof tar !== 'undefined') throw new Error(`${tag} is expected to be undefined`)
            return this
        },
        isBoolean: function() {
            if (typeof tar !== 'boolean') throw new Error(`${tag} is expected to be a boolean`)
            return this
        },
        isNumber: function() {
            if (typeof tar !== 'number' || isNaN(tar)) throw new Error(`${tag} is expected to be a number`)
            return this
        },
        isString: function() {
            if (typeof tar !== 'string') throw new Error(`${tag} is expected to be a string`)
            return this
        },
        isFunction: function() {
            if (typeof tar !== 'function') throw new Error(`${tag} is expected to be a function`)
            return this
        },
        isObject: function() {
            if (typeof tar !== 'object' || testArray(tar) || tar === null) {
                throw new Error(`${tag} is expected to be an object`)
            }
            return this
        },
        isAnyObject: function() {
            if (typeof tar !== 'object' || tar === null) {
                throw new Error(`${tag} is expected to be any object or array`)
            }
            return this
        },
        isArray: function() {
            if (!testArray(tar)) throw new Error(`${tag} is expected to be an array`)
            return this
        },
        isTypedArray: function() {
            const TypedArray = Object.getPrototypeOf(Uint8Array)
            if (!(tar instanceof TypedArray)) throw new Error(`${tag} is expected to be a typed array`)
            return this
        },
        isAnyArray: function() {
            if (!testAnyArray(tar)) throw new Error(`${tag} is expected to be any array`)
            return this
        },

        notNull: function() {
            if (tar == null) throw new Error(`value is expected, but ${tag} found`)
            return this
        },
        eachNotNull: function() {
            if (tar == null) throw new Error(`value is expected, but ${tag} found`)
            if (!isAnyArray(tar)) throw new Error(`an array or typed array value is expected`)

            for (let i = 0; i < tar.length; i++) {
                const e = tar[i]
                if (e == null) throw new Error(`value is expected, but [${e}] found at #${i}`)
            }
            return this
        },

        prop: function(name) {
            if (!tar || typeof tar !== 'object') {
                throw new Error(`${tag} is expected to be an object for prop access`)
            }
            return expect(tar[name], `${title}[${name}]`, tar, title)
        },

        element: function(index) {
            if (!tar || (!testAnyArray(tar))) {
                throw new Error(`${tag} is expected to be an array or a typed array to access elements by index`)
            }
            return expect(tar[index], `${title}[#${index + 1}]`, tar, title)
        },

        up: function() {
            if (!up) throw new Error(`can't move up from here!`)
            return expect(up, upTitle)
        },

        elementsMatch: function(v) {
            if (!testAnyArray(tar)) throw new Error(`${tag} is expected to be an array`)

            let vals
            if (Array.isArray(v)) {
                vals = v
            } else {
                vals = arguments
            }

            if (vals.length !== tar.length) throw new Error(`${tag}.length is expected to be [${vals.length}]`)

            for (let i = 0; i < tar.length; i++) {
                const e = tar[i]
                const v = vals[i]
                if (e !== v) throw new Error(`${tag}[#${i + 1}] is expected to be [${v}], but [${e}] found!`)
            }

            return this
        },

        elementsNearlyMatch: function(vals, epsilon) {
            if (!testAnyArray(tar)) throw new Error(`${tag} is expected to be an array`)
            if (vals.length !== tar.length) throw new Error(`${tag}.length is expected to be [${vals.length}]`)

            epsilon = epsilon || this.EPSILON
            for (let i = 0; i < tar.length; i++) {
                const e = tar[i]
                const v = vals[i]
                if (Math.abs(e - v) > epsilon) throw new Error(`${tag}[#${i + 1}] is expected to be near [${v}] (precision: ${epsilon}), but [${e}] found!`)
            }

            return this
        },

        forEach: function(fn) {
            if (tar == null) throw new Error(`value is expected, but ${tag} found`)
            if (!testArray(tar)) throw new Error(`${stag}array value is expected`)
            if (typeof fn !== 'function') throw new Error(`${stag}apply function is expected in forEach(fn)`)

            for (let i = 0; i < tar.length; i++) {
                const e = tar[i]
                fn(expect(e, title))
            }
            return this
        },
        value: function() {
            return tar
        },
    }
}

if (typeof module === 'object') module.exports = expect
