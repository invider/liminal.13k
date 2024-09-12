// Perlin Noise
//
// Adapted from Renderman Shadding Language implementation from
// Texturing and Modeling: A Procedural Approach 3rd ed. book.
//

const TABSIZE = 256
const TABMASK = TABSIZE - 1

const p = []
for (let i = 0; i < 512; i++) p[i] = floor(rnd() * 256)

function vlattice(x, y, z) {
    x = x * 617 + y * 769
    x += z * 997 * x
    return (p[x & TABMASK]/TABMASK)
}

function fade(t) {
    return 6 * t*t*t*t*t - 15 * t*t*t*t + 10 * t*t*t
}

function lerp2(v, s, e) {
    return s + (e - s) * v
}

function gr(hash, dx, dy, dz) {
    const h = hash & 15
    const u = h < 8? dx : dy
    const v = h < 4? dy : ( h === 12 || h === 14? dx : dz )
    return (((h&1) === 0? dy : -u) + ((h&2) === 0? v : -v))
}

function pnoise(x, y, z) {
    const X = floor(x) & TABMASK
    const Y = floor(y) & TABMASK
    const Z = floor(z) & TABMASK

    // compute delta within cube unit
    const dx = x % 1, dy = y % 1, dz = z % 1
    // compute easing curves
    const fx = fade(dx), fy = fade(dy), fz = fade(dz)

    // hash coordinates of the 8 cube corners
    const A = p[X  ]+Y, AA = p[A]+Z, AB = p[A+1]+Z
    const B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z

    // blend results from 8 corners of cube
    return lerp2(fz,
            lerp2(fy,
                lerp2(fx, gr(p[AA  ], dx  , dy  , dz  ),
                          gr(p[BA  ], dx-1, dy  , dz  )),
                lerp2(fx, gr(p[AB  ], dx  , dy-1, dz  ),
                          gr(p[BB  ], dx-1, dy-1, dz  ))
            ),
            lerp2(fy,
                lerp2(fx, gr(p[AA+1], dx  , dy  , dz-1),
                          gr(p[BA+1], dx-1, dy  , dz-1)),
                lerp2(fx, gr(p[AB+1], dx  , dy-1, dz-1),
                          gr(p[BB+1], dx-1, dy-1, dz-1))
            )
    )
}

function snoise(x, y, z) {
    return (pnoise(abs(x), abs(y), abs(z)) + 1) / 2
}
