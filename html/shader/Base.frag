#version 300 es
// A linha acima não pode ser movida, e define que estamos
// utilizando a linguagem GLSL ES 3.00, do WebGL 2.

// Fragment shaders devem especificar manualmente a precisão do tipo float.
// 'highp' define que os floats serão de alta precisão, com 4 bytes.
precision highp float;

// Obs: Variáveis não usadas no shader são descartadas pelo compilador.

// Variáveis de entrada, recebidas do vertex shader.
// Cor do vértice (RGBA).
in vec4 vertexColor;

// Variáveis de saída (out).
// Cor do pixel (RGBA).
out vec4 outColor;

// Uniforms: constantes compartilhadas por todos os pixels.
// Resolução da tela (XY, quantidade de pixels).
uniform vec2 uResolution;
// Tempo de execução do programa.
uniform float uTime;

void main() {
    // Define a cor do pixel.
    outColor = vertexColor;
}
