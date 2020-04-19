import { invariant } from "./invariant";

export const createShader = (gl: WebGL2RenderingContext, type: GLenum, source: string): WebGLShader => {
  const shader = gl.createShader(type);
  if (shader === null) {
    gl.deleteShader(shader);
    invariant(false, "Failed to create the following shader: \n%s", source);
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success: boolean = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success !== true) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    invariant(false, "Failed to create the following shader: \n%s\nSee the above error for more information.", source);
  }
  return shader;
};

export const createProgram = (
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram => {
  const program = gl.createProgram();
  if (program === null) {
    gl.deleteProgram(program);
    invariant(false, "Failed to create program");
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success !== true) {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    invariant(false, "Failed to create program. See the above error for more information.");
  }
  return program;
};
