

void main(void) {
    const int NUM_LIGHTS = 2;
    vec3 kd = vec3(0.);
    vec3 ks = vec3(0.);
    vec3 color_final = vec3(0.05);

    kd = texture2D(uPanelsSampler, vec2(vUV.s, vUV.t)).xyz;
    ks = kd + vec3(.15);



    Light lights[NUM_LIGHTS];
    lights[0] = sun_light;
    lights[1] = capsule_spotlight;

    for (int i = 0; i < NUM_LIGHTS; i++) {
        color_final += compute_intensity(lights[i], kd, ks, 100000000.);
    }

    gl_FragColor = vec4(color_final,1.0);
}