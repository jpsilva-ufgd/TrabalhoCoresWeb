"use strict";

import { RenderObject } from "./RenderObject.js"
import { Shader } from "./Shader.js"

/**
 * Um retângulo que ocupa todo o canvas.
 */
export class FullRectangle extends RenderObject {
    constructor(gl) {
        super(gl)

        // Array de posições (X, Y, Z) dos vértices.
        this.vertexPositions = [
            // Triângulo 1.
            1, -1, 0, // Inferior direito
            -1, -1, 0, // inferior esquerdo
            -1, 1, 0, // Topo

            // Triângulo 2.
            1, -1, 0,
            -1, 1, 0,
            1, 1, 0
        ]

        /**
         * Frequência da animação (Ex: 0.2 = 1/5 = um ciclo a cada 5 segundos).
         */
        this.frequency = 0.2

        /**
         * Saturação das cores.
         */
        this.saturation = 1
    }

    async load() {
        await super.load()

        /**
         * Frequência de animação.
         */
        this.uniforms.frequency = this.shader.getUniformLocation("frequency")

        /**
         * Saturação das cores.
         */
        this.uniforms.saturation = this.shader.getUniformLocation("saturation")
    }

    setShaderParams() {
        let gl = this.gl

        super.setShaderParams()

        // Atribui valor dos uniformes.
        // Frequência de animação.
        gl.uniform1f(this.uniforms.frequency, this.frequency)
        // Saturação das cores.
        gl.uniform1f(this.uniforms.saturation, this.saturation)
    }
}
