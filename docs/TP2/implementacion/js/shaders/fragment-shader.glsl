precision highp float;
varying vec3 vNormal;
varying vec3 vPosWorld;
varying vec3 vColor;
varying highp vec3 vLighting;

/*********** Textures ***********/
uniform sampler2D uSampler;
varying vec2 vUV;
/********************************/



void main(void) {
    vec4 textureColor = texture2D(uSampler, vec2(vUV.s, vUV.t));         
    gl_FragColor = vec4(vColor.rgb * vLighting, 1.0);
}