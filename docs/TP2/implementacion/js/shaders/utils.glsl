precision mediump float;

const float PI = 3.14159265358979;

varying vec3 vNormal;
varying vec3 vPosWorld;
varying vec3 vFromPointToCameraNormalized;
varying vec2 vUV;

uniform vec3 uCapsuleSpotlightPos;
uniform vec3 uCapsuleSpotlightDirection;
uniform vec3 uCapsuleGreenLightPos;
uniform vec3 uCapsuleRedLightPos;
uniform float uShininess;
uniform vec3 uColor;
uniform float uDontUseLight;
uniform float uReflectionFactor;

uniform sampler2D uTextureSampler;
uniform sampler2D uSamplerReflectionMap;

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
    float distance_decay;
    float spotlight_angle_threshold;
};

vec3 ks = vec3(.75);
const vec3 NULL_VECTOR = vec3(0.0, 0.0, 0.0);

const Light sun_light = Light(OMNIDIRECTIONAL_LIGHT, vec3(1.0, 1.0, 1.0), vec3(1000.0, 0.0, 0.0), vec3(0.), 50.0, 0.0);

Light capsule_spotlight = Light(SPOTLIGHT_LIGHT, vec3(1.), uCapsuleSpotlightPos, uCapsuleSpotlightDirection, 0.5, 0.2);
Light capsule_green_light = Light(OMNIDIRECTIONAL_LIGHT, vec3(0.0, 1.0, 0.0), uCapsuleGreenLightPos, vec3(0.), 0.1, 0.0);
Light capsule_red_light = Light(OMNIDIRECTIONAL_LIGHT, vec3(1.0, 0.0, 0.0), uCapsuleRedLightPos, vec3(0.), 0.1, 0.0);

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
    float dist = 0.1 * distance(light.position, vPosWorld);
    return kd_material * max(dot(points_to_light, vNormal), min_value) * (light.distance_decay / dist);
}

vec3 compute_specular_intensity(Light light, vec3 ks_material, float shininness) {
    vec3 points_to_light = vector_to_light_source(light);
    vec3 reflection = reflect(-points_to_light, vNormal);
    return ks_material * pow(max(dot(reflection, vFromPointToCameraNormalized),0.), shininness);
}

vec3 compute_intensity_for_spotlight(Light light, vec3 kd_material, float shininness) {
    float intensity = 0.0;
    vec3 points_to_light = vector_to_light_source(light);
    float dotFromDirection = dot(points_to_light, -light.direction);
    if (dotFromDirection >= light.spotlight_angle_threshold) {
        intensity = dot(vNormal, points_to_light);
        float dist = 0.1 * distance(light.position, vPosWorld);
        return kd_material.xyz * (light.distance_decay * (intensity / dist));
    } else {
        return NULL_VECTOR;
    }
}

vec3 compute_intensity(Light light, vec3 kd_material, vec3 ks_material, float shininness) {
    if (light.type == SPOTLIGHT_LIGHT) {
        return compute_intensity_for_spotlight(light, kd_material, shininness);
    }

    vec3 intensity = compute_diffuse_intensity(light, kd_material, 0.0) + compute_specular_intensity(light, ks_material, shininness);
    return intensity * light.color;
}

float map(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}
