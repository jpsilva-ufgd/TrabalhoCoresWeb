#version 300 es
// A linha acima não pode ser movida, e define que estamos
// utilizando a linguagem GLSL ES 3.00, do WebGL 2.

// Atributos de entrada (in).
// Posição do vértice (XYZ).
// Usa um vec4, mas o quarto elemento é sempre 1 e não precisa ser setado.
in vec4 aPosition;
// Cor do vértice (RGBA).
in vec4 aColor;

// Variáveis de saída, que serão passadas ao fragment shader.
// Cor do vértice (RGBA).
out vec4 vertexColor;

// Uniforms: constantes compartilhadas por todos os vértices.
// Resolução da tela (XY, quantidade de pixels).
uniform vec2 uResolution;
// Tempo de execução do programa.
uniform float uTime;

void main() {
    // gl_Position é uma variável especial que define a posição do vértice.
    gl_Position = aPosition;
    // Define a cor do vértice.
    vertexColor = aColor;
}
