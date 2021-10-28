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
// Frequência da animação (Ex: 0.2 = 1/5 = um ciclo a cada 5 segundos).
uniform float frequency;
// Saturação das cores.
uniform float saturation;

// Constante matemática PI.
const float PI = 3.14159265358979323846264;

/*
* Converte uma cor HSV em RGB.
* Fonte: http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
*/
vec3 hsvToRgb(vec3 color)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(color.xxx + K.xyz) * 6.0 - K.www);
    return color.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), color.y);
}

/*
* Cria uma roda de cores para demonstrar animção de cor de shaders.
* Fonte: https://www.shadertoy.com/view/4d2fzD
*/
void main() {
    // UV = coordenada do pixel, normalizada de 0 a 1.
    vec2 uv = gl_FragCoord.xy / uResolution;
    // Normaliza de 0 a 1 para 1 a -1 (note a inversão).
    vec2 uvc = -1.0 * ((2.0 * uv) - 1.0);
    // Calcula ângulo do pixel ao redor do centro.
    float ang = (atan(uvc.y, uvc.x) + PI) / (2.0 * PI);
    // Subtrai tempo atual, multiplica pela frequência (velocidade da animação)
    // e extrai parte fracionária,
    ang = fract(ang - uTime * frequency);
    // Calcula distância do pixel ao centro.
    float dist = sqrt(uvc.x * uvc.x + uvc.y * uvc.y);

    // Usa ângulo como matiz da cor, e distância como brilho.
    vec3 hsvColor = vec3(ang, saturation, dist);
    // Converte em RGB.
    vec3 rgbColor = hsvToRgb(hsvColor);

    // Define a cor do pixel.
    outColor = vec4(rgbColor, 1.0);
}
