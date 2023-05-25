#version 450
#extension GL_ARB_separate_shader_objects : enable
#extension GL_GOOGLE_include_directive : require

#include "common.h"

layout(location = 0) out vec4 out_fragColor;

layout(push_constant) uniform params_t
{
    mat4 mProjView;
    mat4 mModel;
    uint albedoId;
} pushConst;

layout (location = 0 ) in VS_OUT
{
  vec3 wPos;
  vec3 wNorm;
  vec3 wTangent;
  vec2 texCoord;
} surf;

layout(binding = 0, set = 0) uniform AppData
{
  UniformParams Params;
};

layout (binding = 1) uniform sampler2D shadowMap;

vec3 T(float s)
{
    return vec3(0.233f, 0.455f, 0.649f) * exp(-s*s/0.0064f) +
           vec3(0.1f,   0.336f, 0.344f) * exp(-s*s/0.0484f) +
           vec3(0.118f, 0.198f, 0.0f)   * exp(-s*s/0.187f)  +
           vec3(0.113f, 0.007f, 0.007f) * exp(-s*s/0.567f)  +
           vec3(0.358f, 0.004f, 0.0f)   * exp(-s*s/1.99f)   +
           vec3(0.078f, 0.0f,   0.0f)   * exp(-s*s/7.41f);
}

float depth(vec2 p, float depth)
{
  vec4 shrinkedpos = vec4(p, depth, 1.0f);
  vec3 shwpos = (Params.lightMatrix * shrinkedpos).xyz / (Params.lightMatrix * shrinkedpos).w;
  float d1 = texture(shadowMap, shwpos.xy * 0.5f).x;
  float d2 = shwpos.z;
  return abs(d1 - d2);
}

vec4 getAlbedo(uint albedoId)
{
  switch(albedoId)
  {
    case 0: 
      return vec4(0.733f, 1.f, 0.596f, 1);       
    case 1: 
      return vec4(1.f, 0.596f, 0.651f, 1);         
    case 2: 
      return vec4(1.f, 0.424f, 0.424f, 1);     
    case 3: 
      return vec4(0.596f, 0.957f, 1.f, 1);
    case 4: 
      return vec4(0.749f, 0.725f, 1.f, 1);    
    case 5: 
      return vec4(1.f, 0.788f, 0.424f, 1);
  }
}

void main()
{
  const vec4 posLightClipSpace = Params.lightMatrix*vec4(surf.wPos, 1.0f); // 
  const vec3 posLightSpaceNDC  = posLightClipSpace.xyz/posLightClipSpace.w;    // for orto matrix, we don't need perspective division, you can remove it if you want; this is general case;
  const vec2 shadowTexCoord    = posLightSpaceNDC.xy*0.5f + vec2(0.5f, 0.5f);  // just shift coords from [-1,1] to [0,1]               
    
  const bool  outOfView = (shadowTexCoord.x < 0.0001f || shadowTexCoord.x > 0.9999f || shadowTexCoord.y < 0.0091f || shadowTexCoord.y > 0.9999f);
  const float shadowDepth = texture(shadowMap, shadowTexCoord).x;
  const float shadow    = ((posLightSpaceNDC.z < shadowDepth + 0.001f) || outOfView) ? 1.0f : 0.0f;

  const vec4 dark_violet = vec4(0.59f, 0.0f, 0.82f, 1.0f);
  const vec4 chartreuse  = vec4(0.5f, 1.0f, 0.0f, 1.0f);

  vec4 lightColor1 = mix(dark_violet, chartreuse, abs(sin(Params.time)));
  vec4 lightColor2 = vec4(1.0f, 1.0f, 1.0f, 1.0f);
   
  vec3 lightDir   = normalize(Params.lightPos - surf.wPos);
  vec4 lightColor = max(dot(surf.wNorm, lightDir), 0.0f) * lightColor2;
  const vec4 albedo = getAlbedo(pushConst.albedoId);
  out_fragColor = albedo*lightColor*shadow;
  if (Params.useSSS)
  {
    const float linearShadowMapDepth = depth(shadowTexCoord, shadowDepth);
    const float s = linearShadowMapDepth * 2;
    const float E = max(0.3 + dot(-surf.wNorm, lightDir), 0.0);
    const vec4 transmittance = vec4(T(s), 1.0f) * lightColor2 * albedo * E;
    out_fragColor += transmittance;
  }
}
