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

/*********** Textures ***********/
uniform sampler2D uSampler;
varying vec2 vUV;
/********************************/

void main(void) {
    gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(aVertexPosition, 1.0);
    
    vPosWorld=(modelMatrix*vec4(aVertexPosition,1.0)).xyz;    // La posicion en coordenadas de mundo
    vNormal=(normalMatrix*vec4(aVertexNormal,1.0)).xyz;       // La normal en coordenadas de mundo
    vColor = aVertexColor;

    /*********** Textures ***********/
    vUV = aVertexUV;
    vec4 textureColor = texture2D(uSampler, vec2(vUV.s, vUV.t));         
    /********************************/
    
    /*********** Lighting ************/
    highp vec3 ambientLight = vec3(0.4, 0.4, 0.4);
    highp vec3 directionalLightColor = vec3(1, 1, 1);
    highp vec3 directionalVector = normalize(vec3(0.0, 0.0, 1.0));
    highp vec4 transformedNormal = normalMatrix * vec4(aVertexNormal, 1.0);
    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = ambientLight + (directionalLightColor * directional);
    /********************************/
}