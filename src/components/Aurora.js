'use client';
import { useEffect, useRef } from 'react';

// --- SAFER SHADERS (Sine-Wave Plasma) ---
const VERT_SRC = `
attribute vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG_SRC = `
precision mediump float; // Changed to mediump for maximum compatibility on all devices
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    float t = uTime * 0.5;
    
    // Create organic movement using simple Sine Waves (Guaranteed to compile, no complex noise functions)
    // Overlapping sine waves create a fluid 'Aurora' look
    float w1 = sin(st.x * 3.0 + t);
    float w2 = sin(st.y * 2.0 + t * 0.7);
    float w3 = sin((st.x * 0.5 + st.y * 0.5) * 5.0 - t * 1.2);
    
    // Combine waves
    float wave = w1 + w2 + w3; 
    
    // Normalize wave from approximately -3..3 to 0..1 for color mixing
    float f = (wave + 3.0) / 6.0;

    // Smooth Color Mixing
    // Mix Color 1 -> Color 2
    vec3 color = mix(uColor1, uColor2, smoothstep(0.1, 0.6, f));
    // Mix result -> Color 3 at the peaks
    color = mix(color, uColor3, smoothstep(0.5, 0.9, f));

    gl_FragColor = vec4(color, 1.0);
}
`;

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255
    ] : [0, 0, 0];
}

export default function Aurora({
    colorStops = ["#ff00dd", "#ffffff", "#fa0064"], // Default Pink/White/Red scheme
}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Try getting context safely
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (!gl) {
            console.warn("WebGL not supported");
            return;
        }

        // Compile Shader with ERROR CHECKING
        const createShader = (type, source) => {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compile error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vert = createShader(gl.VERTEX_SHADER, VERT_SRC);
        const frag = createShader(gl.FRAGMENT_SHADER, FRAG_SRC);

        // Critical: If failing to compile, ABORT to prevent crash
        if (!vert || !frag) {
            return;
        }

        const program = gl.createProgram();
        gl.attachShader(program, vert);
        gl.attachShader(program, frag);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(program));
            return;
        }

        gl.useProgram(program);

        // Fullscreen Quad
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1, 1, -1, -1, 1,
            -1, 1, 1, -1, 1, 1
        ]), gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // Uniform Locations
        const uTime = gl.getUniformLocation(program, 'uTime');
        const uResolution = gl.getUniformLocation(program, 'uResolution');
        const uColor1 = gl.getUniformLocation(program, 'uColor1');
        const uColor2 = gl.getUniformLocation(program, 'uColor2');
        const uColor3 = gl.getUniformLocation(program, 'uColor3');

        // Set Colors
        const c1 = hexToRgb(colorStops[0] || '#ff00dd');
        const c2 = hexToRgb(colorStops[1] || '#ffffff');
        const c3 = hexToRgb(colorStops[2] || '#fa0064');
        gl.uniform3f(uColor1, c1[0], c1[1], c1[2]);
        gl.uniform3f(uColor2, c2[0], c2[1], c2[2]);
        gl.uniform3f(uColor3, c3[0], c3[1], c3[2]);

        // Resize Handler
        const resize = () => {
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                gl.viewport(0, 0, canvas.width, canvas.height);
                gl.uniform2f(uResolution, canvas.width, canvas.height);
            }
        };
        window.addEventListener('resize', resize);
        resize();

        // Animation Loop
        let frameId;
        const startTime = performance.now();
        const render = () => {
            // Robustness check in loop
            if (!gl) return;

            const time = (performance.now() - startTime) * 0.001;
            gl.uniform1f(uTime, time);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            frameId = requestAnimationFrame(render);
        };
        render();

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', resize);
            try {
                // Safe WebGL Cleanup
                gl.getExtension('WEBGL_lose_context')?.loseContext();
            } catch (e) {
                // Ignore context loss errors on cleanup
            }
        };
    }, [colorStops]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                display: 'block',
                width: '100%',
                height: '100%'
            }}
        />
    );
}
