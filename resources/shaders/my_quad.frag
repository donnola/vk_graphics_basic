#version 450
#extension GL_ARB_separate_shader_objects : enable

layout(location = 0) out vec4 color;

layout (binding = 0) uniform sampler2D colorTex;

layout (location = 0 ) in VS_OUT
{
  vec2 texCoord;
} surf;

float median(float color[49])
{
  for (int i = 0; i < 48; ++i) 
  {
    for (int j = 0; j < 48 - i; ++j) 
    {
      if (color[j] > color[j + 1]) 
      {
        float temp = color[j];
        color[j] = color[j + 1];
        color[j + 1] = temp;
      }
    }
  }
  return color[24];
}

void main()
{
  ivec2 textureSize2d = textureSize(colorTex,0);
  float color_r[49];
  float color_g[49];
  float color_b[49];
  int k = 0;
  for (float i = -3; i < 4; ++i)
  {
    for (float j = -3; j < 4; ++j)
    {
      float x = surf.texCoord.x + i/textureSize2d.x;
      float y = surf.texCoord.y + j/textureSize2d.y;

      if (x < 0 || x >= textureSize2d.x)
      {
        x = surf.texCoord.x;
      }
      if (y < 0 || y >= textureSize2d.y)
      {
        y = textureSize2d.y;
      }
      vec2 pixel_coord;
      pixel_coord.xy = vec2(x, y);
      vec4 pixel_color = textureLod(colorTex, pixel_coord, 0);
      color_r[k] = pixel_color.x;
      color_g[k] = pixel_color.y;
      color_b[k] = pixel_color.z;
      ++k;
    }
  }

  float r = median(color_r);
  float g = median(color_g);
  float b = median(color_b);

  color = vec4(r, g, b, 1);
}
