/*
 * m - model matrix
 * n - normal matrix (derived from the model one)
 * v - view matrix
 * p - perspective matrix
 *
 * vp - vertex position
 * vn - vertex normal
 * vc - vertex color
 * uv - vertex UV coordinates
 *
 * wp - world position
 * wn - world normal
 * wc - varying vertex color
 * uw - varying vertex UV coordinates
 * fd - fog depth
 */
const _vshader = `#version 300 es
    uniform mat4 m,n,v,p;
    in vec3 vp, vn, vc;
    in vec2 uv;

    out vec3 wp, wn, wc;
    out vec2 uw;
    out float fd;

    void main(void) {
        vec4 p4 = vec4(vp, 1.0);      // convert vertex position to homogenious vec4
        wp = (m * p4).xyz;            // calculate world space position
        wn = (n * vec4(vn, 1.0)).xyz; // calculate world space normal
        wc = vc;                      // interpolate the vertex color
        uw = uv;                      // interpolate UV coordinates
        fd = -(v * m * p4).z;         // calculate fog distance

        gl_Position = p*v*m*p4;
    }
`

const _fshader = `#version 300 es
    precision highp float;

    // environment
    // ucp - camera position
    uniform vec4 uO, udc, uF, upc[16],
        ua, ud, us;
    uniform vec3 ucp, udv, upl[16];

    uniform float un;
    uniform sampler2D uT;

    in vec3 wp, wn, wc;
    in vec2 uw;
    in float fd;

    out vec4 oc;

    void main(void) {
        vec3 WN = normalize(wn);

        // directional diffuse
        // TODO expand into a 3-component vector with dir light colors included
        float dd = max(
            dot(WN, udv),
            0.0
        ) * udc.w;

        // calculate directional diffuse color component
        vec3 dc = vec3(0.0, 0.0, 0.0);
        dc = dc + udc.xyz * dd;

        vec3 sc = vec3(0.0, 0.0, 0.0);  // specular color accumulator
        vec3 eye = normalize(ucp - wp);

        for (int i = 0; i < 16; i++) {
            // accumulate diffuse components of point lights
            vec3 dr = upl[i] - wp;
            float pd = length(dr); // point light distance
            dr /= pd;

            // attenuation (TODO include as a part of point light vec4 coords?)
            float a = 1.0 / (
                .2 // constant component for infinite dist
                + 0.001 * pd*pd // quadratic factor
            );

            // point light diffuse lambert
            float l = max(
                dot(WN, dr),
                0.0
            ) * upc[i].w * a;
            dc = dc + upc[i].xyz * l;

            // accumulate specular
            vec3 hv = normalize(dr + eye);  // point light half-vector

            float c = pow(
                max( dot(WN, hv), 0.0 ), un
            ) * upc[i].w * a;

            sc = sc + upc[i].xyz * c;
        }

        // directional specular
        vec3 hd = normalize(udv + eye); // directional half-vector
        float sd = pow(
            max( dot(WN, hd), 0.0 ), un
        ) * udc.w;
        sc += udc.xyz * sd;

        // fog
        float z = gl_FragCoord.z / gl_FragCoord.w;
        // hardcoded fog values
        float fA = smoothstep(30.0, 140.0, fd); // fog amount

        oc = mix(
                vec4(
                    // shaded component
                    ua.xyz * ua.w
                    + (texture(uT, uw).xyz * uO.z
                         + ud.xyz * (1.0-uO.z)) * dc * ud.w
                    + us.xyz * sc * us.w,
                    1.0) * uO.x,               // 1.0 - hardcoded opacity
                // + vec4(ud.xyz * uO.y, 1.0), // wireframe component
            uF, fA
        );
    }
`
