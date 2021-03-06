
import { mat4 } from 'gl-matrix';
import "./default.css";

const vsSource = `
attribute vec4 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}
`;

const fsSource = `
void main() {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`;

let gl: WebGLRenderingContext;
let canvas: HTMLCanvasElement;
let programInfo: ReturnType<typeof createProgramInfo>;
let b: ReturnType<typeof initBuffers>;

function main() {
    canvas = document.querySelector("#canvas")!;
    gl = canvas.getContext("webgl")!;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource)!;
    programInfo = createProgramInfo(gl, shaderProgram);
    b = initBuffers(gl);

    drawScene(gl, programInfo, b);

    onResize();
    window.onresize = onResize;
}

function onResize() {
    canvas.setAttribute("width", String(window.innerWidth));
    canvas.setAttribute("height", String(window.innerHeight));
    drawScene(gl, programInfo, b)
}

function createProgramInfo(gl: WebGLRenderingContext, shaderProgram: WebGLProgram) {
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        },
    };

    return programInfo;
}

function initShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLProgram | undefined {

    try {
        const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)!;
        const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)!;

        // Create the shader program
        const shaderProgram: WebGLProgram = gl.createProgram()!;
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        // If creating the shader program failed, alert
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            throw new Error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        }

        return shaderProgram;
    } catch (e) {
        console.log(e);
    }

}

function loadShader(gl: WebGLRenderingContext, type: GLenum, source: string): WebGLShader {
    const shader: WebGLShader = gl.createShader(type)!;

    // Send the source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        throw new Error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader))
    }

    return shader;
}

function initBuffers(gl: WebGLRenderingContext): { position: WebGLBuffer, tick: WebGLBuffer } {

    // Create a buffer for the square's positions.
    const positionBuffer = gl.createBuffer()!;

    // Select the positionBuffer as the one to apply buffer operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Now create an array of positions for the square.
    const positions = [
        -1.0, 1.0,
        1.0, 1.0,
        -1.0, -1.0,
        1.0, -1.0,
    ];

    // Now pass the list of positions into WebGL to build the shape. We do this by creating a Float32Array from the JavaScript array, then use it to fill the current buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const tickBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, tickBuffer);
    const tickPositions = [
        -1.0, -2,
        1, -2,
        -1.0, -10,
        1, -10
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tickPositions), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        tick: tickBuffer
    };
}

function drawScene(gl: WebGLRenderingContext, programInfo: ReturnType<typeof createProgramInfo>, buffers: ReturnType<typeof initBuffers>) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create a perspective matrix, a special matrix that is used to simulate the distortion of perspective in a camera. Our field of view is 45 degrees, with a width/height ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units  and 100 units away from the camera. Note: glmatrix.js always has the first argument as the destination to receive the result.
    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    gl.viewport(0, 0, window.innerWidth, window.innerHeight)

    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    // Set the drawing position to the "identity" point, which is the center of the scene.
    const modelViewMatrix = mat4.create();

    // Now move the drawing position a bit to where we want to start drawing the square.
    mat4.translate(modelViewMatrix,     // destination matrix
        modelViewMatrix,     // matrix to translate
        [0.0, 0.0, -60.0]);  // amount to translate

    // Tell WebGL how to pull out the positions from the position buffer into the vertexPosition attribute.

    const numComponents = 2;  // pull out 2 values per iteration
    const type = gl.FLOAT;    // the data in the buffer is 32bit floats
    const normalize = false;  // don't normalize
    const stride = 0;         // how many bytes to get from one set of values to the next, 0 = use type and numComponents above
    const offset = 0;         // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);


    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);

    // Set the shader uniforms
    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

    {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);

        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.tick);

        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }

}

main();

export { };