precision highp float;
varying vec3 vNormal;
varying vec3 vPosWorld;
varying vec3 vColor;
varying highp vec3 vLighting;

/*********** Textures ***********/
uniform sampler2D uPanelsSampler;
varying vec2 vUV;
/********************************/



void main(void) {
    // gl_FragColor = vec4(vColor.rgb * vLighting, 1.0);

    vec4 textureColor = texture2D(uPanelsSampler, vec2(vUV.s, vUV.t)); 
    gl_FragColor = textureColor;
}