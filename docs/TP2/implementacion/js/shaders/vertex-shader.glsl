precision highp float;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aVertexUV;

uniform vec3 uColor;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projMatrix;
uniform mat4 normalMatrix;

uniform sampler2D uPanelsSampler;

varying vec3 vNormal;
varying vec3 vPosWorld;
varying vec3 vFromPointToCameraNormalized;
varying vec2 vUV;


void main(void) {
    vec4 viewProd = viewMatrix * modelMatrix * vec4(aVertexPosition, 1.0);
    gl_Position = projMatrix * viewProd;
    vFromPointToCameraNormalized = normalize(-vec3(viewProd) / viewProd.w);
    
    vPosWorld=(modelMatrix*vec4(aVertexPosition,1.0)).xyz;    // La posicion en coordenadas de mundo
    vNormal=normalize(normalMatrix*vec4(aVertexNormal,1.0)).xyz;       // La normal en coordenadas de mundo
    vUV = aVertexUV;
}