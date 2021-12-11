// precision mediump float;

const float PI = 3.14159265358979;

vec3 samplear_varias_escalas(sampler2D sampler, float escala1, float escala2, float escala3, vec2 uvs) {

    vec3 color1 = texture2D(sampler, uvs * escala1).xyz;
    vec3 color2 = texture2D(sampler, uvs * escala2).xyz;
    vec3 color3 = texture2D(sampler, uvs * escala3).xyz;
			   
    return mix(mix(color1, color2, 0.5),color3,0.3);
}
