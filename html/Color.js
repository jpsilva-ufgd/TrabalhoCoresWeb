"use strict";

/**
 * Uma cor em formato RGB, CMYK ou HSL, com canal Alpha (transparência).
 */
export class Color {
    /**
     * Instancia cor do format especificado.
     *
     * @param {string} format "rgb" (padrão), "cmyk" ou "hsl".
     */
    constructor(format = "rgb") {
        /**
         * Formato em que a cor é armazenada.
         *
         * Pode ser "rgb" (padrão), "cmyk" ou "hsl".
         */
        this.format = format

        // RGB

        /**
         * Vermelho (0 a 1).
         */
        this.r = 1

        /**
         * Verde (0 a 1).
         */
        this.g = 1

        /**
         * Azul (0 a 1).
         */
        this.b = 1

        // CMYK

        /**
         * Ciano (0 a 1).
         */
        this.c = 0

        /**
         * Magenta (0 a 1).
         */
        this.m = 0

        /**
         * Amarelo (0 a 1).
         */
        this.y = 0

        /**
         * Preto (0 a 1).
         */
        this.k = 0

        // HSL

        /**
         * Matiz (0 a 359).
         */
        this.h = 0

        /**
         * Saturação (0 a 1).
         */
        this.s = 0

        /**
         * Luminosidade (0 a 1).
         */
        this.l = 1

        // Alpha (vale para todos os formatos acima).

        /**
         * Alpha (transparência) (0 a 1).
         */
        this.a = 1
    }

    /**
     * Instancia cor a partir de sua representação RGB.
     *
     * @param {*} r Vermelho (0 a 1).
     * @param {*} g Verde (0 a 1).
     * @param {*} b Azul (0 a 1).
     * @param {*} a Alpha (0 a 1).
     */
    static fromRgb(r, g, b, a = 1) {
        let color = new Color("rgb")
        color.r = r
        color.g = g
        color.b = b
        color.a = a

        return color
    }

    /**
     * Cor em formato de array [R, G, B].
     */
    get rgb() {
        let r, g, b

        // Verifica formato armazenado.
        switch (this.format) {
            case "rgb":
                // Nenhuma conversão necessária.
                return [this.r, this.g, this.b]

            case "cmyk":
                // Cada cor é o inverso da cor oposta, multiplicando pelo
                // inverso da quantidade de preto.

                // Vermelho (oposto do ciano).
                r = (1 - this.c) * (1 - this.k)
                // Verde (oposto do magenta).
                g = (1 - this.m) * (1 - this.k)
                // Azul (oposto do azul).
                b = (1 - this.y) * (1 - this.k)

                return [r, g, b]

            case "hsl":
                // Saturação 0 não possui cor definida.
                if (this.s == 0) {
                    // Usa lumininosidade como tom de cinza.
                    r = g = b = this.l
                }
                else {
                    // Calcula o chroma, que é a intensidade da cor,
                    // a partir da saturação e luminosidade.
                    let chroma = (1 - Math.abs(2 * this.l - 1)) * this.s
                    // Parâmetro utilizado para encontrar um ponto no cubo RGB.
                    let x = chroma * (1 - Math.abs((this.h / 60) % 2 - 1))
                    // Componente adicionado a cada valor para corrigir a luminosidade.
                    let m = this.l - chroma / 2

                    // Determina valor RGB de acordo com o ângulo da matiz.
                    if (0 <= this.h && this.h < 60) {
                        r = chroma
                        g = x
                        b = 0
                    } else if (60 <= this.h && this.h < 120) {
                        r = x
                        g = chroma
                        b = 0
                    } else if (120 <= this.h && this.h < 180) {
                        r = 0
                        g = chroma
                        b = x
                    } else if (180 <= this.h && this.h < 240) {
                        r = 0
                        g = x
                        b = chroma
                    } else if (240 <= this.h && this.h < 300) {
                        r = x
                        g = 0
                        b = chroma;
                    } else if (300 <= this.h && this.h < 360) {
                        r = chroma
                        g = 0
                        b = x
                    }

                    // Adiciona componente para ajustar luminosidade.
                    r += m
                    g += m
                    b += m
                }

                return [r, g, b]
        }
    }

    /**
     * Cor no formato de array [R, G, B, A]
     */
    get rgba() {
        return [...this.rgb, this.a]
    }

    /**
     * Instancia cor a partir de sua representação em CMYK.
     *
     * @param {*} c Ciano (0 a 1).
     * @param {*} m Magenta (0 a 1).
     * @param {*} y Amarelo (0 a 1).
     * @param {*} k Preto (0 a 1).
     * @param {*} a Alpha (0 a 1).
     */
    static fromCmyk(c, m, y, k, a = 1) {
        let color = new Color("cmyk")
        color.c = c
        color.m = m
        color.y = y
        color.k = k
        color.a = a

        return color
    }

    /**
     * Cor em formato de array [C, M, Y, K].
     */
    get cmyk() {
        // Verifica formato armazenado.
        switch (this.format) {
            case "rgb":
                // Cada cor é o inverso da cor oposta, divida pelo
                // inverso da quantidade de preto.

                // Preto (inverso do maior entre RGB, que é o menor entre CMY).
                // O preto é adicionado ao valor de CMY.
                let k = 1 - Math.max(this.r, this.g, this.b)
                let c, m, y

                if (k == 1) {
                    // 100% preto.
                    c = m = y = 0
                }
                else {
                    // Ciano (oposto do vermelho).
                    c = (1 - this.r - k) / (1 - k)
                    // Magenta (oposto do verde).
                    m = (1 - this.g - k) / (1 - k)
                    // Amarelo (oposto do azul).
                    y = (1 - this.b - k) / (1 - k)
                }

                return [c, m, y, k]

            case "cmyk":
                // Nenhuma conversão necessária.
                return [this.c, this.m, this.y, this.k]

            case "hsl":
                // Converte de HSL para RGB, e de RGB para CMYK.
                return Color.fromRgb(...this.rgb).cmyk
        }
    }

    /**
     * Instancia cor a partir de sua representação HSL.
     *
     * @param {*} h Matiz.
     * @param {*} s Saturação.
     * @param {*} l Luminosidade.
     * @param {*} a Alpha (0 a 1).
     */
    static fromHsl(h, s, l, a = 1) {
        let color = new Color("hsl")
        color.h = h
        color.s = s
        color.l = l
        color.a = a

        return color
    }

    /**
     * Cor em formato de array [H, S, L].
     *
     * H (hue ou matiz) é um valor entre 0 e 360.
     */
    get hsl() {
        // Verifica formato armazenado.
        switch (this.format) {
            case "rgb":
                // Calcula o máximo e mínimo valores entre RGB.
                let maxC = Math.max(this.r, this.g, this.b)
                let minC = Math.min(this.r, this.g, this.b)

                // Calcula o chroma, que é a intensidade da cor, definida pela
                // distância entre os valores.
                // Se os valores de RGB forem próximos, a cor é menos intensa (mais cinza).
                let chroma = maxC - minC

                // Calcula matiz, que é a percepção da cor em si.
                let hue

                // Chroma 0 é um tom de cinza.
                if (chroma == 0) {
                    // Como a saturação é zero, este valor poderia ser qualquer um,
                    // pois efetivamente não existe percepção de cor.
                    hue = 0
                }
                else {
                    // No modelo HSL, as cores estão dispostas em um círculo.
                    // A matiz é um ângulo nesse círculo
                    // (denmonstração visual: https://en.wikipedia.org/wiki/File:Hsv-hexagons-to-circles.svg)
                    // O círculo é divido em 6 partes, que contém em seus extremos as cores RGB,
                    // e também seus opostos CMY.
                    // Calcular a matiz significa encontrar em qual ângulo nesse círculo a cor está situada.
                    switch (maxC) {
                        // Calcula matiz de acordo com o segmento em que a cor está situada.
                        // O segmento é estabelecido de acordo com o maior valor de RGB.
                        case this.r:
                            hue = ((this.g - this.b) / chroma) % 6
                            break

                        case this.g:
                            hue = ((this.b - this.r) / chroma) + 2
                            break

                        case this.b:
                            hue = ((this.r - this.g) / chroma) + 4
                            break
                    }

                    // Após descobrir o segmento, multiplica por 60 (360 / 6 partes)
                    // para estabelecer o ângulo.
                    hue *= 60

                    // Se o ângulo for negativo, adiciona 360 graus para torna-lo positivo,
                    // sem alterar a localização.
                    if (hue < 0)
                        hue += 360
                }

                // Luminosidade.
                // É a média entre os valores de RGB.
                let lightness = (maxC + minC) / 2

                // Saturação.
                let saturation

                // Chroma 0 é um tom de cinza.
                if (chroma == 0) {
                    saturation = 0
                }
                else {
                    // Normaliza a escala do chroma para cobrir todos as combinações de matiz e luminosidade.
                    // (demonstração visual: https://en.wikipedia.org/wiki/File:Hsl-hsv_saturation-lightness_slices.svg)
                    saturation = chroma / (1 - Math.abs(2 * lightness - 1))
                }

                return [hue, saturation, lightness]

            case "cmyk":
                // Converte de CMYK para RGB, e de CMYK para HSL.
                return Color.fromRgb(...this.rgb).hsl

            case "hsl":
                // Nenhuma conversão necessária.
                return [this.h, this.s, this.l]
        }
    }

    /**
     * Instancia cor a partir de uma string hexadecimal.
     *
     * @param {*} hex String no formato "rrggbbaa".
     */
    static fromHex(hex) {
        // Extrai valores a usando expressão regular.
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

        if (!result) {
            throw Error("Cor hexadecimal inválida: " + hex)
        }

        // Converte de strings em hexacimal para inteiro,
        // e converte escala de 0..255 para 0..1.
        let r = parseInt(result[1], 16) / 255
        let g = parseInt(result[2], 16) / 255
        let b = parseInt(result[3], 16) / 255
        let a = parseInt(result[4], 16) / 255

        return Color.fromRgb(r, g, b, a)
    }

    /**
     * Cor em formato hexadecimal "#rrggbbaa".
     */
    get hex() {
        let rgba = this.rgba

        // Converte de 0..1 para a escala 0..255 e converte em string hexadecimal.
        var r = Color.toHexString(rgba[0] * 255)
        var g = Color.toHexString(rgba[1] * 255)
        var b = Color.toHexString(rgba[2] * 255)
        var a = Color.toHexString(rgba[3] * 255)

        // Concatena resultado.
        return "#" + r + g + b + a
    }

    /**
     * Converte o número em uma string com seu valor em base hexadecimal.
     * A string possui tamanho mínimo de 2 caracteres.
     *
     * @param {*} x Número.
     */
    static toHexString(x) {
        // Arredonda parte fracionária e converte em base 16.
        var hex = Math.round(x).toString(16)
        // Adiciona um 0 à esquerda se houver apenas um caracter.
        if (hex.length < 2) {
            hex = "0" + hex
        }

        return hex
    }
}
