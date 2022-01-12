

void main(void) {
    const int NUM_LIGHTS = 4;
    vec3 kd = vec3(0.);
    vec3 ks = vec3(0.);
    vec3 color_final = vec3(0.05);

    if (uDontUseLight != 0.0) {
        gl_FragColor = vec4(texture2D(uTextureSampler, vec2(vUV.s, vUV.t)).xyz, 1.0);
        return;
    }

    if (uColor ==  NULL_VECTOR) {
        kd = texture2D(uTextureSampler, vec2(vUV.s, vUV.t)).xyz;
        ks = kd + vec3(.15);
    } else {
        kd = uColor;
        ks = uColor + vec3(.4);
    }

    vec3 reflection = reflect(-vFromPointToCameraNormalized, vNormal);
    float m = length(reflection);
    float alfa = map(atan(reflection.y, reflection.x), -PI, PI, 0.0, 1.0);
    float beta = map(acos(reflection.z / m), 0., PI, 0., 1.);
    float reflection_coef = 0.15;
    if (vNormal.z >= 0.0) {
        // Since we're using only the earth's reflection, we can
        // make this hack.
        reflection_coef = 0.0;
    }

    Light lights[NUM_LIGHTS];
    lights[0] = sun_light;
    lights[1] = capsule_spotlight;
    lights[2] = capsule_green_light;
    lights[3] = capsule_red_light;

    for (int i = 0; i < NUM_LIGHTS; i++) {
        color_final += compute_intensity(lights[i], kd, ks, 100000000.);
        color_final += texture2D(uSamplerReflectionMap, vec2(alfa,beta)).xyz * uReflectionFactor * reflection_coef;
    }

    gl_FragColor = vec4(color_final, 1.0);
}