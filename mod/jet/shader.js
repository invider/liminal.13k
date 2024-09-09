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
    uniform vec4 uOpt, uDirectionalLightColorI, uPointLightColorI, uFogColor, uLightIntensities, upc[16];
    uniform vec3 uCamPos, uDirectionalLightVector, uPointLightPosition, uAmbientColor, uDiffuseColor, uSpecularColor, upl[16];

    uniform float uShininess;
    uniform sampler2D uTexture;

    in vec3 wp, wn, wc;
    in vec2 uw;
    in float fd;

    out vec4 oc;

    void main(void) {
        vec3 WN = normalize(wn);

        // directional diffuse
        // TODO expand into a 3-component vector with dir light colors included
        float diffuseDirectionalLambert = max(
            dot(WN, uDirectionalLightVector),
            0.0
        ) * uDirectionalLightColorI.w;

        // calculate directional diffuse color component
        vec3 dc = vec3(0.0, 0.0, 0.0);
        dc = dc + uDirectionalLightColorI.xyz * diffuseDirectionalLambert;

        vec3 sc = vec3(0.0, 0.0, 0.0);  // specular color accumulator
        vec3 eye = normalize(uCamPos - wp);

        for (int i = 0; i < 16; i++) {
            // accumulate diffuse components of point lights
            vec3 dr = upl[i] - wp;
            float pd = length(dr); // point light distance
            dr /= pd;

            // attenuation (TODO include as a part of point light vec4 coords?)
            float attenuation = 1.0 / (
                .2 // constant component for infinite dist
                + 0.001 * pd*pd // quadratic factor
            );

            // point light diffuse lambert
            float l = max(
                dot(WN, dr),
                0.0
            ) * upc[i].w * attenuation;
            dc = dc + upc[i].xyz * l;

            // accumulate specular
            vec3 hv = normalize(dr + eye);  // point light half-vector

            float specular = pow(
                max( dot(WN, hv), 0.0 ), uShininess
            ) * upc[i].w * attenuation;

            sc = sc + upc[i].xyz * specular;
        }

        // directional specular
        vec3 hd = normalize(uDirectionalLightVector + eye); // directional half-vector
        float sd = pow(
            max( dot(WN, hd), 0.0 ), uShininess
        ) * uDirectionalLightColorI.w;
        sc += uDirectionalLightColorI.xyz * sd;

        // fog
        float z = gl_FragCoord.z / gl_FragCoord.w;
        // hardcoded fog values
        float fogAmount = smoothstep(25.0, 125.0, fd);

        float opacity = 1.0;

        oc = mix(
                vec4(
                    uAmbientColor * uLightIntensities.x
                    + (texture(uTexture, uw).xyz * uOpt.z
                         + uDiffuseColor * (1.0-uOpt.z)) * dc * uLightIntensities.y
                    + uSpecularColor * sc * uLightIntensities.z,
                    opacity) * uOpt.x                // shaded component
                + vec4(uDiffuseColor * uOpt.y, 1.0), // wireframe component
            uFogColor, fogAmount
        );
    }
`
