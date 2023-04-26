#version 450
#extension GL_ARB_separate_shader_objects : enable
#extension GL_GOOGLE_include_directive : require

#include "common.h"

layout (location = 0) out vec3 position;
layout (location = 1) out vec3 normal;
layout (location = 2) out vec3 albedo;

layout (location = 0) in VS_OUT
{
  vec3 wPos;
  vec3 wNorm;
  vec2 texCoord;
} vsOut;

layout (push_constant) uniform params_t
{
    mat4 mProjView;
    mat4 mModel;
    uint albedoId;
} PushConstant;

layout (binding = 0, set = 0) uniform AppData
{
  UniformParams Params;
};

void main()
{
  position = (Params.view * vec4(vsOut.wPos, 1.0)).xyz;
  normal = (Params.view * vec4(vsOut.wNorm, 0.0)).xyz;
  switch(PushConstant.albedoId)
  {
    case 0:
      albedo = vec3(0.124f, 0.3214f, 0.124f); break;            
    case 1:
      albedo = vec3(0.4234f, 0.123f, 0.524f); break;            
    case 2:
      albedo = vec3(0.654f, 0.6233f, 0.4523f); break;            
    case 3: 
      albedo = vec3(0.5321f, 0.6433f, 0.953f); break;            
    case 4:
      albedo = vec3(0.642f, 0.635f, 0.344f); break;            
    case 5:
      albedo = vec3(0.4332f, 0.534f, 0.756f); break;       
  }
}