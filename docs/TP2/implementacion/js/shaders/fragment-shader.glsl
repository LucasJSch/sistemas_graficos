// precision highp float;
// varying vec3 vNormal;
// varying vec3 vPosWorld;
// varying vec3 vColor;
// varying highp vec3 vLighting;

/*********** Textures ***********/
uniform sampler2D uPanelsSampler;
varying vec2 vUV;
/********************************/

/************ Lights ************/
// uniform vec3 uColor;
/********************************/


void main(void) {
    const int NUM_LIGHTS = 1;
    vec3 color_final = vec3(0.);


    vec3 kd = texture2D(uPanelsSampler, vec2(vUV.s, vUV.t)).xyz;
    vec3 ks = kd + vec3(.15);


    Light lights[NUM_LIGHTS];
    lights[0] = sun_light;

    for (int i = 0; i < NUM_LIGHTS; i++) {
        color_final += compute_intensity(lights[i], kd, ks, 100000000.);
    }

    gl_FragColor = vec4(color_final,1.0);


    // gl_FragColor = texture2D(uPanelsSampler, vec2(vUV.s, vUV.t)); 
}