'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

export function ShaderCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    if (!gl) return;

    function syncSize() {
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(syncSize).observe(canvas);
    }
    syncSize();

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;
    const fs = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_dark;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float sparkle(vec2 uv, float t) {
  float s = 0.0;
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    vec2 pos = vec2(hash(vec2(fi, 0.0)), hash(vec2(fi, 1.0)));
    float phase = hash(vec2(fi, 2.0)) * 6.28;
    float speed = 0.2 + hash(vec2(fi, 3.0)) * 0.3;
    float size = 0.003 + hash(vec2(fi, 4.0)) * 0.008;
    float brightness = 0.3 + hash(vec2(fi, 5.0)) * 0.7;
    vec2 delta = uv - pos;
    float dist = length(delta);
    float pulse = sin(t * speed + phase) * 0.5 + 0.5;
    float glow = smoothstep(size * 2.0, 0.0, dist) * pulse * brightness;
    s += glow;
  }
  return s;
}

void main() {
    vec2 uv = v_texCoord;
    float noise = sin(uv.x * 2.0 + u_time * 0.2) * cos(uv.y * 2.0 + u_time * 0.3) * 0.1;
    float d = u_dark;

    vec3 ivory = mix(vec3(0.99, 0.99, 0.94), vec3(0.12, 0.12, 0.08), d);
    vec3 champagne = mix(vec3(0.97, 0.91, 0.81), vec3(0.15, 0.13, 0.09), d);
    vec3 goldSubtle = mix(vec3(0.83, 0.69, 0.22), vec3(0.91, 0.76, 0.29), d);
    vec3 sparkleGold = mix(vec3(0.83, 0.69, 0.22), vec3(0.91, 0.76, 0.29), d);

    vec3 color = mix(ivory, champagne, uv.y + noise);
    color = mix(color, goldSubtle, (1.0 - uv.y) * 0.05);

    float sp = sparkle(uv, u_time);
    color += sparkleGold * sp * 0.4;

    gl_FragColor = vec4(color, 1.0);
}`;

    function createShader(type: number, src: string) {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, createShader(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, createShader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uDark = gl.getUniformLocation(prog, 'u_dark');

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    const handleMouse = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };
    window.addEventListener('mousemove', handleMouse);

    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    let animId: number;
    function render(t: number) {
      if (typeof ResizeObserver === 'undefined') syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uDark) gl.uniform1f(uDark, themeRef.current === 'dark' ? 1.0 : 0.0);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    }
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 opacity-40 pointer-events-none"
      style={{ display: 'block' }}
    />
  );
}
