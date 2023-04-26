import os
import subprocess
import pathlib

if __name__ == '__main__':
    glslang_cmd = "glslangValidator"

    shader_list = ["simple.vert", "quad3_vert.vert", "quad.vert", "quad.frag", "simple_shadow.frag", "blur.comp", "prepare_gbuffer.frag", "gbuffer.frag", "ssao.frag"]

    for shader in shader_list:
        subprocess.run([glslang_cmd, "-V", shader, "-o", "{}.spv".format(shader)])

