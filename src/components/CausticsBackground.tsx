import { useEffect, useRef } from "react";

export default function CausticsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;
    let gl: WebGLRenderingContext | null = null;

    // Synchronize drawing buffer size
    const resizeCanvas = () => {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl") as WebGLRenderingContext | null;
    if (!gl) {
      console.warn("WebGL not supported by this browser.");
      return;
    }

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      varying vec2 v_texCoord;

      float grid(vec2 uv, float res) {
          vec2 grid = fract(uv * res);
          float line = min(grid.x, grid.y);
          return 1.0 - smoothstep(0.0, 0.02, line);
      }

      void main() {
          vec2 uv = v_texCoord;
          vec2 p = uv * 2.0 - 1.0;
          p.x *= u_resolution.x / u_resolution.y;

          // Background color (Fresh Aquatic Surface: #f4faff)
          vec3 color = vec3(0.957, 0.98, 1.0);

          // Blueprint grid
          float g1 = grid(uv, 10.0);
          float g2 = grid(uv, 50.0);
          color = mix(color, vec3(0.0, 0.404, 0.49), g1 * 0.08); // subtle teal lines
          color = mix(color, vec3(0.0, 0.404, 0.49), g2 * 0.04);

          // Light refractions (caustics effect)
          float t = u_time * 0.2;
          for(float i = 1.0; i < 4.0; i++) {
              p.x += 0.3 / i * sin(i * 3.0 * p.y + t + i);
              p.y += 0.3 / i * cos(i * 3.0 * p.x + t + i);
          }
          float refraction = 0.5 * sin(p.x + p.y) + 0.5;
          color += vec3(0.0, 0.706, 0.847) * pow(refraction, 10.0) * 0.08; // cyan glints

          // Mouse interaction (soft ripple)
          vec2 mCoords = u_mouse / u_resolution;
          float dist = distance(uv, mCoords);
          float ripple = sin(dist * 20.0 - u_time * 3.0) * exp(-dist * 4.0);
          color += vec3(0.0, 0.404, 0.49) * ripple * 0.05;

          // Faint noise
          float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
          color -= noise * 0.01;

          gl_FragColor = vec4(color, 1.0);
      }
    `;

    const createShader = (glContext: WebGLRenderingContext, type: number, source: string) => {
      const shader = glContext.createShader(type);
      if (!shader) return null;
      glContext.shaderSource(shader, source);
      glContext.compileShader(shader);
      if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
        console.error("Shader compile error: ", glContext.getShaderInfoLog(shader));
        glContext.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const program = gl.createProgram();
    if (!program) return;

    const compiledVs = createShader(gl, gl.VERTEX_SHADER, vs);
    const compiledFs = createShader(gl, gl.FRAGMENT_SHADER, fs);
    if (!compiledVs || !compiledFs) return;

    gl.attachShader(program, compiledVs);
    gl.attachShader(program, compiledFs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error: ", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const uTimeLoc = gl.getUniformLocation(program, "u_time");
    const uResolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const uMouseLoc = gl.getUniformLocation(program, "u_mouse");

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        mouseX = e.clientX - rect.left;
        // Flip Y for WebGL coordinates
        mouseY = rect.height - (e.clientY - rect.top);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        if (rect.width && rect.height) {
          mouseX = touch.clientX - rect.left;
          mouseY = rect.height - (touch.clientY - rect.top);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    const render = (time: number) => {
      if (!gl || !canvas) return;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uTimeLoc, time * 0.001);
      gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);
      gl.uniform2f(uMouseLoc, mouseX, mouseY);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationFrameId);
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(compiledVs);
        gl.deleteShader(compiledFs);
        gl.deleteBuffer(positionBuffer);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none opacity-40 transition-opacity duration-1000"
      style={{ display: "block" }}
      id="shader-canvas-background"
    />
  );
}
