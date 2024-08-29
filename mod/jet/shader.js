const _vshader = `
    uniform mat4 mMatrix;
    uniform mat4 nMatrix;
    uniform mat4 vMatrix;
    uniform mat4 pMatrix;

    attribute vec3 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec3 aVertexColor;

    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying vec3 vWorldNormal;
    varying vec3 vColor;

    void main(void) {
        vWorldPosition = (mMatrix * vec4(aVertexPosition, 1.0)).xyz;
        vNormal = aVertexNormal;
        vWorldNormal = (nMatrix * vec4(aVertexNormal, 1.0)).xyz;
        vColor = aVertexColor;

        gl_Position = pMatrix * vMatrix * mMatrix * vec4(aVertexPosition, 1.0);
    }
`

const _fshader = `
    precision highp float;

    // matrices
    uniform highp mat4 mMatrix;
    uniform highp mat4 nMatrix;
    uniform highp mat4 vMatrix;
    uniform highp mat4 pMatrix;

    // environment
    uniform vec4 uOpt;
    uniform vec3 uCamPos;
    uniform highp vec3 uDirectionalLightVector;
    uniform highp vec4 uDirectionalLightColorI;
    uniform highp vec3 uPointLightPosition;
    uniform highp vec4 uPointLightColorI;

    // material
    uniform highp vec3 uAmbientColor;
    uniform highp vec3 uDiffuseColor;
    uniform highp vec3 uSpecularColor;
    uniform highp vec3 uEmissionColor;

    uniform highp vec4 uLightIntensities;
    uniform highp float uShininess;

    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    varying vec3 vWorldNormal;
    varying vec3 vColor;

    void main(void) {
        // DEBUG material props
        highp float opacity = 1.0;
        highp float roughness = 1.0;
        // <<<--- must be set by uniforms
        
        highp vec3 worldNormal = normalize(vWorldNormal);

        // TODO expand into a 3-component vector with dir light colors included
        highp float diffuseDirectionalLambert = max(
            dot(worldNormal, uDirectionalLightVector),
            0.0
        ) * uDirectionalLightColorI.w;

        // do one point light
        vec3 pointLightDirection = uPointLightPosition - vWorldPosition;
        float pointLightDistance = length(pointLightDirection);
        pointLightDirection /= pointLightDistance;

        // attenuation (TODO make a property of the point(spot?) light
        float attenuation = 1.0 / (
            .2 // constant component for infinite dist
            + 0.001 * pointLightDistance * pointLightDistance // quadratic factor
        );

        highp float diffusePointLambert = max(
            dot(worldNormal, pointLightDirection),
            0.0
        ) * uPointLightColorI.w * attenuation;

        // mix directional and point lights factors
        highp float diffuseLambert = diffuseDirectionalLambert + diffusePointLambert;

        // point specular
        // TODO make specular spot of the light source color!
        vec3 eyeDirection = normalize(uCamPos - vWorldPosition);
        highp vec3 halfVector = normalize(pointLightDirection + eyeDirection);

        highp float specular = pow(
            max( dot(worldNormal, halfVector), 0.0 ), uShininess
        ) * uPointLightColorI.w * attenuation;

        // directional specular
        highp vec3 halfVectorD = normalize(uDirectionalLightVector + eyeDirection);
        highp float specularD = pow(
            max( dot(worldNormal, halfVectorD), 0.0 ), uShininess
        ) * uDirectionalLightColorI.w;

        gl_FragColor = vec4(
                uAmbientColor * uLightIntensities.x
                + uDiffuseColor * diffuseLambert * uLightIntensities.y
                + uSpecularColor * (specular + specularD) * uLightIntensities.z,
                opacity) * uOpt.x                // shaded component
            + vec4(uDiffuseColor * uOpt.y, 1.0); // wireframe component
    }
`
