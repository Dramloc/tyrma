import tilesetImage from "./assets/dungeon-tileset.png";
import { getDrawImageOperations } from "./cell";
import * as Dungeon from "./dungeon";
import { createProgram, createShader } from "./gl";
import * as Grid from "./grid";
import { getBounds, loadTexture } from "./texture";

const glsl = String.raw;

let canvas: OffscreenCanvas | null = null;
let gl: WebGL2RenderingContext | null = null;

let dx = 0;
let dy = 0;
let zoom = 0;
let dungeon: Dungeon.Dungeon | null = null;
let animationFrame: number | null = null;

const startAnimate = async (gl: WebGL2RenderingContext, dungeon: Dungeon.Dungeon) => {
  console.time('renderInit');
  const vertexShaderSource = glsl`#version 300 es
    in vec2 a_position;
    in vec2 a_tex_coord;
    uniform vec2 u_resolution;
    uniform vec2 u_tex_resolution;
    uniform vec2 u_delta;
    uniform float u_scale;

    out vec2 v_tex_coord;

    void main() {
      vec2 viewport = a_position * u_scale + u_delta;
      vec2 clip_space = ((viewport * 2.0 / u_resolution) - 1.0) * vec2(1, -1);

      gl_Position = vec4(clip_space, 0, 1);
      v_tex_coord = a_tex_coord / u_tex_resolution;
    }
  `;
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);

  const fragmentShaderSource = glsl`#version 300 es
    precision mediump float;

    uniform sampler2D u_texture;
    in vec2 v_tex_coord;
    out vec4 out_color;

    void main() {
      out_color = texture(u_texture, v_tex_coord);
    }
  `;
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  const program = createProgram(gl, vertexShader, fragmentShader);

  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.BLEND);

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const texCoordAttributeLocation = gl.getAttribLocation(program, "a_tex_coord");

  const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  const texResolutionUniformLocation = gl.getUniformLocation(program, "u_tex_resolution");
  const deltaUniformLocation = gl.getUniformLocation(program, "u_delta");
  const scaleUniformLocation = gl.getUniformLocation(program, "u_scale");
  const textureUniformLocation = gl.getUniformLocation(program, "u_texture");

  const positions: number[] = [];
  const texCoords: number[] = [];
  Grid.forEachWithCoordinates((_, x, y) => {
    getDrawImageOperations(x, y, dungeon.walls).forEach(([sliceName, dx, dy]) => {
      // Retrieve sprite coordinates
      const bounds = getBounds(sliceName, x * 16 + dx, y * 16 + dy);
      const x0 = x * 16 + dx;
      const y0 = y * 16 + dy;
      const x1 = x0 + bounds.w;
      const y1 = y0 + bounds.h;
      positions.push(x0, y0, x1, y0, x0, y1, x0, y1, x1, y0, x1, y1);

      // Retrieve sprite UV coordinates
      const u0 = bounds.x;
      const u1 = u0 + bounds.w;
      const v0 = bounds.y;
      const v1 = v0 + bounds.h;
      texCoords.push(u0, v0, u1, v0, u0, v1, u0, v1, u1, v0, u1, v1);
    });
  }, dungeon.walls);

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  // Buffer sprite positions
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  // Buffer texture UV coordinates
  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(texCoordAttributeLocation);
  gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  // Load and create texture
  const tilesetTexture = await loadTexture(tilesetImage);
  const unit = 0;
  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tilesetTexture);
  console.timeEnd('renderInit');

  const animate = () => {
    console.time('render');
    animationFrame = requestAnimationFrame(animate);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(texResolutionUniformLocation, tilesetTexture.width, tilesetTexture.height);
    gl.uniform1i(textureUniformLocation, unit);
    gl.uniform2f(deltaUniformLocation, dx, dy);
    gl.uniform1f(scaleUniformLocation, zoom);
    gl.drawArrays(gl.TRIANGLES, 0, positions.length);
    console.timeEnd('render');
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
