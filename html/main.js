"use strict";

import { Scene } from "./Scene.js"
import { Triangle } from "./Triangle.js"
import { FullRectangle } from "./FullRectangle.js"
import { Color } from "./Color.js"

/**
 * Retorna o primeiro elemento no documento HTML com o ID especificado.
 *
 * @param {*} inputId
 */
function $(inputId) {
    return document.getElementById(inputId)
}

/**
 * Determina uma função a ser chama quando o input for modificado.
 *
 * @param {*} inputId Id do campo input no documento HTML.
 * @param {*} callback Função a ser chamada.
 */
function onInput(inputId, callback) {
    // Localiza input no HTML.
    let input = $(inputId)
    // Define callback que é chamado sempre que o valor do input for modificado.
    input.oninput = callback
    // Chama callback uma vez para inicializar estado.
    callback.bind(input)()
}

/**
 * Cena que contém um triângulo simples com vértices coloridos.
 */
class TriangleScene extends Scene {
    constructor(canvasSelector) {
        super(canvasSelector)

        this.triangle = new Triangle(this.gl)
    }

    draw(time) {
        this.triangle.draw(time)
    }
}

/**
 * Cena que contém uma roda de cores animada.
 */
class ColorWheelScene extends Scene {
    constructor(canvasSelector) {
        super(canvasSelector)

        this.rectangle = new FullRectangle(this.gl)
        this.rectangle.shader.fragmentPath = "shader/ColorWheel.frag"
    }

    draw(time) {
        this.rectangle.draw(time)
    }
}

/**
 * Atualiza sliders e visualização de cor no slide de conversão.
 *
 * @param {Color} color Cor.
 */
function updateColorSlide(color) {
    // Sliders RGBA.
    // Converte escala de 0..1 para 0..255.
    let rgba = color.rgba.map(x => Math.round(x * 255))
    // Atualiza sliders.
    $("input-red").value = rgba[0]
    $("input-green").value = rgba[1]
    $("input-blue").value = rgba[2]
    $("input-alpha").value = rgba[3]
    // Atualiza texto.
    $("output-rgb").textContent = `[${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]}]`

    // Sliders CMYK.
    // Converte escala de 0..1 para 0..100.
    let cmyk = color.cmyk.map(x => Math.round(x * 100))
    // Atualiza sliders.
    $("input-cyan").value = cmyk[0]
    $("input-magenta").value = cmyk[1]
    $("input-yellow").value = cmyk[2]
    $("input-black").value = cmyk[3]
    // Atualiza texto.
    $("output-cmyk").textContent = `[${cmyk[0]},${cmyk[1]},${cmyk[2]},${cmyk[3]}]`

    // Sliders HSL.
    let hsl = color.hsl
    // Arredonda matiz, mantendo a escala 0..360.
    hsl[0] = Math.round(hsl[0])
    // Converte saturação e luminosidade da escala de 0..1 para 0..100.
    hsl[1] = Math.round(hsl[1] * 100)
    hsl[2] = Math.round(hsl[2] * 100)
    // Atualiza sliders.
    $("input-hue").value = hsl[0]
    $("input-saturation").value = hsl[1]
    $("input-lightness").value = hsl[2]
    // Atualiza texto.
    $("output-hsl").textContent = `[${hsl[0]},${hsl[1]},${hsl[2]}]`

    $("output-hex").textContent = color.hex
    $("result-color").style = "background-color: " + color.hex
}

function main() {
    let color = new Color()

    // Conversor de cores.
    // Sliders RGBA.
    onInput("input-red", function() {
        let rgb = color.rgb
        rgb[0] = this.value / 255
        color = Color.fromRgb(...rgb, color.a)
        updateColorSlide(color)
    })
    onInput("input-green", function() {
        let rgb = color.rgb
        rgb[1] = this.value / 255
        color = Color.fromRgb(...rgb, color.a)
        updateColorSlide(color)
    })
    onInput("input-blue", function() {
        let rgb = color.rgb
        rgb[2] = this.value / 255
        color = Color.fromRgb(...rgb, color.a)
        updateColorSlide(color)
    })
    onInput("input-alpha", function() {
        color.a = this.value / 255
        updateColorSlide(color)
    })
    // Sliders CMYK.
    onInput("input-cyan", function() {
        let cmyk = color.cmyk
        cmyk[0] = this.value / 100
        color = Color.fromCmyk(...cmyk, color.a)
        updateColorSlide(color)
    })
    onInput("input-magenta", function() {
        let cmyk = color.cmyk
        cmyk[1] = this.value / 100
        color = Color.fromCmyk(...cmyk, color.a)
        updateColorSlide(color)
    })
    onInput("input-yellow", function() {
        let cmyk = color.cmyk
        cmyk[2] = this.value / 100
        color = Color.fromCmyk(...cmyk, color.a)
        updateColorSlide(color)
    })
    onInput("input-black", function() {
        let cmyk = color.cmyk
        cmyk[3] = this.value / 100
        color = Color.fromCmyk(...cmyk, color.a)
        updateColorSlide(color)
    })
    // Sliders HSL
    onInput("input-hue", function() {
        let hsl = color.hsl
        hsl[0] = this.value
        color = Color.fromHsl(...hsl, color.a)
        updateColorSlide(color)
    })
    onInput("input-saturation", function() {
        let hsl = color.hsl
        hsl[1] = this.value / 100
        color = Color.fromHsl(...hsl, color.a)
        updateColorSlide(color)
    })
    onInput("input-lightness", function() {
        let hsl = color.hsl
        hsl[2] = this.value / 100
        color = Color.fromHsl(...hsl, color.a)
        updateColorSlide(color)
    })

    // Cena com triângulo.
    let triangleScene = new TriangleScene("#canvas-triangle")
    triangleScene.start()

    // Roda de cores animada.
    let colorWheelScene = new ColorWheelScene("#canvas-color-wheel")
    // Slider de velocidade de animação.
    onInput("input-wheel-frequency", function() {
        colorWheelScene.rectangle.frequency = this.value / 10
        $("wheel-frequency").textContent = this.value / 10
    })
    // Slider de saturação.
    onInput("input-wheel-saturation", function() {
        colorWheelScene.rectangle.saturation = this.value / 100
        $("wheel-saturation").textContent = this.value
    })

    colorWheelScene.start()
}

// Executa a função 'main' após carregar completamente a página HTML.
window.onload = main
