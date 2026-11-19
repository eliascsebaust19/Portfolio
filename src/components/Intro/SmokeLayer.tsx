import React, { useLayoutEffect, useRef } from "react";
import { SMOKE_FRAG, SMOKE_VERT } from "./shaders/smoke";

export type SmokeUniforms = {
  t: number;
  side: number;
  gather: number;
  clear: number;
  dis: number;
  beam: number;
  amt: number;
  seed: number;
  ambient: number;
  grain: number;
};

// Soft smoke is upscaled; the logo and bolts stay full-resolution SVG.
const RW = 480;
const RH = 270;
const NAMES = [
  "uT",
  "uSide",
  "uGather",
  "uClear",
  "uDis",
  "uBeam",
  "uAmt",
  "uSeed",
  "uAmbient",
  "uGrain",
] as const;

type GLState = {
  gl: WebGLRenderingContext;
  loc: Record<string, WebGLUniformLocation | null>;
  lastTick: number;
};

const compile = (gl: WebGLRenderingContext, type: number, src: string) => {
  const s = gl.createShader(type);
  if (!s) throw new Error("Could not create shader");
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(s);
    gl.deleteShader(s);
    throw new Error(info || "shader compile error");
  }
  return s;
};

export const SmokeLayer: React.FC<{ u: SmokeUniforms; opacity?: number }> = ({
  u,
  opacity = 1,
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const st = useRef<GLState | null>(null);

  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      preserveDrawingBuffer: true,
      antialias: false,
    });
    if (!gl) return;
    const prog = gl.createProgram();
    if (!prog) return;

    let vertex: WebGLShader | undefined;
    let fragment: WebGLShader | undefined;
    let buf: WebGLBuffer | null = null;
    try {
      vertex = compile(gl, gl.VERTEX_SHADER, SMOKE_VERT);
      fragment = compile(gl, gl.FRAGMENT_SHADER, SMOKE_FRAG);
      gl.attachShader(prog, vertex);
      gl.attachShader(prog, fragment);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("Could not link smoke shader");
      gl.useProgram(prog);
      buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW
      );
      const aPos = gl.getAttribLocation(prog, "aPos");
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      const loc: Record<string, WebGLUniformLocation | null> = {
        uRes: gl.getUniformLocation(prog, "uRes"),
      };
      NAMES.forEach((n) => (loc[n] = gl.getUniformLocation(prog, n)));
      st.current = { gl, loc, lastTick: -1 };
    } catch {
      // Graceful fallback if WebGL unsupported
    }

    return () => {
      gl.useProgram(null);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      st.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    const s = st.current;
    const tick = Math.floor(u.t * 24);
    if (!s || s.lastTick === tick) return;
    s.lastTick = tick;
    const { gl, loc } = s;
    gl.viewport(0, 0, RW, RH);
    gl.uniform2f(loc.uRes, RW, RH);
    gl.uniform1f(loc.uT, u.t);
    gl.uniform1f(loc.uSide, u.side);
    gl.uniform1f(loc.uGather, u.gather);
    gl.uniform1f(loc.uClear, u.clear);
    gl.uniform1f(loc.uDis, u.dis);
    gl.uniform1f(loc.uBeam, u.beam);
    gl.uniform1f(loc.uAmt, u.amt);
    gl.uniform1f(loc.uSeed, u.seed);
    gl.uniform1f(loc.uAmbient, u.ambient);
    gl.uniform1f(loc.uGrain, u.grain);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  });

  return (
    <canvas
      ref={ref}
      width={RW}
      height={RH}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity,
      }}
    />
  );
};
