#version 450
#extension GL_ARB_separate_shader_objects : enable
#extension GL_GOOGLE_include_directive : require

#include "common.h"

layout (triangles) in;
layout (triangle_strip, max_vertices = 8) out;

layout(push_constant) uniform params_t
{
    mat4 mProjView;
    mat4 mModel;
} params;

layout (location = 0) in VS_IN {
    vec3 wPos;
    vec3 wNorm;
    vec3 wTangent;
    vec2 texCoord;
} vIn[];

void main(void) 
{
    gl_Position = params.mProjView * vec4(vIn[0].wPos, 1.0f);
    EmitVertex();
    gl_Position = params.mProjView * vec4(vIn[0].wPos + vIn[0].wNorm * 0.01, 1.0);
    EmitVertex();
    gl_Position = params.mProjView * vec4(vIn[1].wPos, 1.0f);
    EmitVertex();
    gl_Position = params.mProjView * vec4(vIn[1].wPos + vIn[1].wNorm * 0.01, 1.0);
    EmitVertex();
    gl_Position = params.mProjView * vec4(vIn[2].wPos, 1.0f);
    EmitVertex();
    gl_Position = params.mProjView * vec4(vIn[2].wPos + vIn[2].wNorm * 0.01, 1.0);
    EmitVertex();
    gl_Position = params.mProjView * vec4(vIn[0].wPos, 1.0f);
    EmitVertex();
    gl_Position = params.mProjView * vec4(vIn[0].wPos + vIn[0].wNorm * 0.01, 1.0);
    EmitVertex();

    EndPrimitive();
}
