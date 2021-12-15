precision highp float;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec3 aVertexColor;
attribute vec2 aVertexUV;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projMatrix;
uniform mat4 normalMatrix;


varying vec3 vNormal;
varying vec3 vPosWorld;
varying vec3 vColor;
varying highp vec3 vLighting;
varying vec3 vFromPointToCameraNormalized;

/*********** Textures ***********/
uniform sampler2D uPanelsSampler;
varying vec2 vUV;
/********************************/

void main(void) {
    vec4 viewProd = viewMatrix * modelMatrix * vec4(aVertexPosition, 1.0);
    gl_Position = projMatrix * viewProd;
    vFromPointToCameraNormalized = normalize(-vec3(viewProd) / viewProd.w);
    
    vPosWorld=(modelMatrix*vec4(aVertexPosition,1.0)).xyz;    // La posicion en coordenadas de mundo
    vNormal=normalize(normalMatrix*vec4(aVertexNormal,1.0)).xyz;       // La normal en coordenadas de mundo
    vColor = aVertexColor;
    vUV = aVertexUV;
}