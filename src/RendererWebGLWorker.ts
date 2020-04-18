import * as Dungeon from "./dungeon";
import { clear, createBuffer, createProgram, createShader, getAttributeLocation } from "./gl";
import * as Grid from "./grid";

const glsl = String.raw;

const initialize = (gl: WebGL2RenderingContext) => {
  const vertexShaderSource = glsl`
    attribute vec2 a_position;
    uniform vec2 u_resolution;
    uniform vec2 u_delta;
    uniform float u_scale;

    void main() {
      vec2 tiled_position = a_position * u_scale * 16.0;
      vec2 viewport = tiled_position + u_delta;
      vec2 clip_space = ((viewport * 2.0 / u_resolution) - 1.0);

      gl_Position = vec4(clip_space * vec2(1, -1), 0, 1);
    }
  `;
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);

  const fragmentShaderSource = glsl`
    precision mediump float;

    void main() {
      gl_FragColor = vec4(0.16862745098039217, 0.16862745098039217, 0.27058823529411763, 1);
    }
  `;
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  return createProgram(gl, vertexShader, fragmentShader);
};

export const render = (
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  dungeon: Dungeon.Dungeon,
  dx: number,
  dy: number,
  zoom: number
) => {
  const positionAttributeLocation = getAttributeLocation(gl, program, "a_position");
  const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  const deltaUniformLocation = gl.getUniformLocation(program, "u_delta");
  const scaleUniformLocation = gl.getUniformLocation(program, "u_scale");

  // Push position data in the buffer
  const positionBuffer = createBuffer(gl);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions: number[] = [];
  Grid.forEachWithCoordinates((wall, x, y) => {
    if (wall === false) {
      return;
    }
    positions.push(x, y, x + 1, y, x, y + 1, x + 1, y, x + 1, y + 1, x, y + 1);
  }, dungeon.walls);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // Render
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  clear(gl);
  gl.useProgram(program);

  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
  gl.uniform2f(deltaUniformLocation, dx, dy);
  gl.uniform1f(scaleUniformLocation, zoom);

  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLES, 0, positions.length / 3);
};

let canvas: OffscreenCanvas | null = null;
let gl: WebGL2RenderingContext | null = null;

let dx = 0;
let dy = 0;
let zoom = 0;
let dungeon: Dungeon.Dungeon | null = null;
let animationFrame: number | null = null;

const startAnimate = (gl: WebGL2RenderingContext, dungeon: Dungeon.Dungeon) => {
  const program = initialize(gl);

  const animate = () => {
    animationFrame = requestAnimationFrame(animate);
    render(gl, program, dungeon, dx, dy, zoom);
  };
  animate();
};

globalThis.addEventListener("message", (e) => {
  const action = e.data;
  switch (action.type) {
    case "SETUP": {
      canvas = action.payload as OffscreenCanvas;
      gl = canvas.getContext("webgl2");
      if (dungeon === null || gl === null) {
        return;
      }
      startAnimate(gl, dungeon);
      break;
    }
    case "TEARDOWN": {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
      break;
    }
    case "SET_DUNGEON": {
      dungeon = action.payload as Dungeon.Dungeon;
      break;
    }
    case "SET_ZOOM": {
      zoom = action.payload;
      break;
    }
    case "SET_DX": {
      dx = action.payload;
      break;
    }
    case "SET_DY": {
      dy = action.payload;
      break;
    }
    case "SET_SIZE": {
      const { width, height } = action.payload;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
    }
  }
});
