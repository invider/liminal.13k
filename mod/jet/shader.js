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

    #define FOG_NEAR  25.0
    #define FOG_FAR   65.0

    // environment
    uniform vec4 uOpt, uDirectionalLightColorI, uPointLightColorI, uFogColor, uLightIntensities;
    uniform vec3 uCamPos, uDirectionalLightVector, uPointLightPosition, uAmbientColor, uDiffuseColor, uSpecularColor, uEmissionColor;

    uniform float uShininess;
    uniform sampler2D uTexture;

    in vec3 wp, wn, wc;
    in highp vec2 uw;
    in float fd;

    out vec4 oc;

    void main(void) {
        highp vec3 WN = normalize(wn);

        // TODO expand into a 3-component vector with dir light colors included
        highp float diffuseDirectionalLambert = max(
            dot(WN, uDirectionalLightVector),
            0.0
        ) * uDirectionalLightColorI.w;

        // do one point light
        vec3 pointLightDirection = uPointLightPosition - wp;
        float pointLightDistance = length(pointLightDirection);
        pointLightDirection /= pointLightDistance;

        // attenuation (TODO make a property of the point(spot?) light
        float attenuation = 1.0 / (
            .2 // constant component for infinite dist
            + 0.001 * pointLightDistance * pointLightDistance // quadratic factor
        );

        highp float diffusePointLambert = max(
            dot(WN, pointLightDirection),
            0.0
        ) * uPointLightColorI.w * attenuation;

        // mix directional and point lights factors
        highp float diffuseLambert = diffuseDirectionalLambert + diffusePointLambert;

        // point specular
        // TODO make specular spot of the light source color!
        vec3 eyeDirection = normalize(uCamPos - wp);
        highp vec3 halfVector = normalize(pointLightDirection + eyeDirection);

        highp float specular = pow(
            max( dot(WN, halfVector), 0.0 ), uShininess
        ) * uPointLightColorI.w * attenuation;

        // directional specular
        highp vec3 halfVectorD = normalize(uDirectionalLightVector + eyeDirection);
        highp float specularD = pow(
            max( dot(WN, halfVectorD), 0.0 ), uShininess
        ) * uDirectionalLightColorI.w;

        // fog
        float z = gl_FragCoord.z / gl_FragCoord.w;
        float fogAmount = smoothstep(FOG_NEAR, FOG_FAR, fd);

        float opacity = 1.0;

        oc = mix(
                vec4(
                    uAmbientColor * uLightIntensities.x
                    + (texture(uTexture, uw).xyz * uOpt.z
                         + uDiffuseColor * (1.0-uOpt.z)) * diffuseLambert * uLightIntensities.y
                    + uSpecularColor * (specular + specularD) * uLightIntensities.z,
                    opacity) * uOpt.x                // shaded component
                + vec4(uDiffuseColor * uOpt.y, 1.0), // wireframe component
            uFogColor, fogAmount
        );
    }
`
