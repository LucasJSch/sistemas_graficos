precision mediump float;

varying vec3 vNormal;
varying vec3 vPosWorld;
varying vec3 vFromPointToCameraNormalized;
uniform float uShininess;

// A.K.A. fuente de luz puntual
const int OMNIDIRECTIONAL_LIGHT = 1;
const int SPOTLIGHT_LIGHT = 2;
// A.K.A. fuente de luz directa, como el sol
const int DIRECTIONAL_LIGHT = 3;

struct Light {
    int type;
    vec3 color;
    vec3 position;
    vec3 direction;
};

vec3 ks = vec3(.75);
const vec3 NULL_VECTOR = vec3(0.0, 0.0, 0.0);

// const Light sun_light = Light(OMNIDIRECTIONAL_LIGHT, vec3(1.), vec3(180.0, 0.0, 30.0), vec3(0.));
const Light sun_light = Light(OMNIDIRECTIONAL_LIGHT, vec3(1.), NULL_VECTOR, NULL_VECTOR);

vec3 vector_to_light_source(Light light) {
    vec3 res;
    
    if (light.type == OMNIDIRECTIONAL_LIGHT) {
        res = light.position - vPosWorld;
    } else if (light.type == SPOTLIGHT_LIGHT) {
        res = light.position - vPosWorld;
    } else if (light.type == DIRECTIONAL_LIGHT) {
        res = -light.direction;
    }

    return normalize(res);
}

vec3 compute_diffuse_intensity(Light light, vec3 kd_material, float min_value) {
    vec3 points_to_light = vector_to_light_source(light);
    return kd_material * max(dot(points_to_light, vNormal), min_value);
}

vec3 compute_specular_intensity(Light light, vec3 ks_material, float shininness) {
    vec3 points_to_light = vector_to_light_source(light);
    vec3 reflection = reflect(-points_to_light, vNormal);
    return ks_material * pow(max(dot(reflection, vFromPointToCameraNormalized),0.), shininness);
}

vec3 compute_intensity(Light light, vec3 kd_material, vec3 ks_material, float shininness) {

    vec3 intensity = compute_diffuse_intensity(light, kd_material, 0.3) + compute_specular_intensity(light, ks_material, shininness);
    return intensity * light.color;
}
