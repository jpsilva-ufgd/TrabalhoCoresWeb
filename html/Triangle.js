"use strict";

import { RenderObject } from "./RenderObject.js"
import { Shader } from "./Shader.js"

export class Triangle extends RenderObject {
    constructor(gl) {
        let shader = new Shader(gl)

        super(gl, shader)

        // Array de posições (X, Y, Z) dos vértices.
        this.vertexPositions = [
            0.6, -0.5, 0, // Inferior direito
            -0.6, -0.5, 0, // inferior esquerdo
            0.0, 0.5, 0 // Topo
        ]

        // Array de cores (R, G, B, A) dos vértices.
        this.vertexColors = [
            1, 0, 0, 1,
            0, 1, 0, 1,
            0, 0, 1, 1
        ]
    }
}
