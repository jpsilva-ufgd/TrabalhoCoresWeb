"use strict";

import { Shader } from "./Shader.js"

/**
 * Um objeto 2D ou 3D que contém vértices e pode ser renderizado em um canvas WebGL.
 */
export class RenderObject {
    constructor(gl) {
        /**
         * Contexto OpenGL.
         */
        this.gl = gl

         /**
          * VAO - Vertex Array Object
          * Armazena estado dos vértices do objeto.
          * Contém um ou mais VBOs (Vertex Buffer Object), os quais contém os
          * dados dos vértices em si.
          *
          * Este array é referenciado toda vez que o objeto for renderizado,
          * para recuperar os dados dos vértices que estão na memória da GPU.
          */
        this.vertexArrayObject

        /**
         * Array de posições (X, Y, Z) dos vértices.
         */
        this.vertexPositions

        /**
         * Array de cores (R, G, B, A) dos vértices.
         */
        this.vertexColors

        /**
         * Este objeto precisa ser carregado antes de desenhar.
         */
        this.loaded = false
    }

    /**
     * Shader para renderizar esse objeto.
     */
    get shader() {
        // Se nenhum shader especificado, usa o padrão.
        if (!this._shader) {
            this._shader = new Shader(this.gl)
        }

        return this._shader
    }

    set shader(value) {
        this._shader = value
    }

    /**
     * Carrega dados e compila shaders do objeto.
     * Deve ser executado antes de desenhar.
     */
    async load() {
        // Verifica se já foi carregado.
        if (this.loaded) {
            return
        }

        let gl = this.gl

        // Carrega e compila shaders.
        await this.shader.compile()

        /**
         * Localização dos attributos dos shaders.
         */
        this.attr = {
            /**
             * Posição do vértice (XYZ).
             *
             * Definido no shader como:
             * in vec4 aPosition;
             */
            position: this.shader.getAttribLocation("aPosition"),

            /**
             * Cor do vértice (RGBA).
             *
             * Definido no shader como:
             * in vec4 aColor;
             */
            color: this.shader.getAttribLocation("aColor")
        }

        /**
         * Localização dos uniforms dos shaders.
         *
         * Uniform é uma variável global dentro do shader.
         */
        this.uniforms = {
            /**
             * Resolução da tela (XY, quantidade de pixels).
             */
            resolution: this.shader.getUniformLocation("uResolution"),

            /**
             * Tempo de execução, em segundos.
             */
            time: this.shader.getUniformLocation("uTime")
        }

        // Cria o array que contém todas as informações dos vértices (VAO).
        this.vertexArrayObject = gl.createVertexArray()
        // Define o VAO como ativo, isto é, futuras chamadas a gl.vertexAttribPointer
        // e gl.enableVertexAttribArray irão referenciar esse VAO.
        gl.bindVertexArray(this.vertexArrayObject)

        // Cria buffer que contém a posição dos vértices.
        this.createArrayBuffer(this.attr.position, this.vertexPositions, 3)
        // Cria buffer que contém a cor dos vértices.
        if (this.vertexColors) {
            this.createArrayBuffer(this.attr.color, this.vertexColors, 4)
        }

        // Objeto carregado.
        this.loaded = true
    }

    /**
     * Define parâmetros do shader.
     *
     * Deve ser extendida para definir parâmetros nas classes herdadas.
     * Deve ser chamada após ativar o shader, com 'shader.use()'.
     */
    setShaderParams() {
        let gl = this.gl

        // Resolução do canvas.
        gl.uniform2f(this.uniforms.resolution, gl.canvas.width, gl.canvas.height)
        // Tempo de execução.
        gl.uniform1f(this.uniforms.time, this.time)
    }

    /**
     * Desenha objeto.
     *
     * @param {*} time Tempo em segundos, usado como parâmetro do shader.
     */
    draw(time = 0) {
        let gl = this.gl
        this.time = time

        // Ativa o shader para ser utilizado.
        this.shader.use()
        // Parâmetros do shader.
        this.setShaderParams()

        // Carrega o array de dados dos vértices que serão renderizados.
        gl.bindVertexArray(this.vertexArrayObject)
        // Desenha vértices, a partir do primeiro (0), formando um triângulo a cada 3.
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexPositions.length / 3)
    }

    /**
     * Cria buffer com array de dados dos vértices.
     *
     * @param {*} shaderAttributeId Índice do attributo no shader (localizado com getAttribLocation).
     * @param {*} data Array de dados, que devem ser do tipo float.
     * @param {*} attributeSize Quantidade de elementos do array cada vértice possui.
     *                          Ex: Se for um array de posições, attributeSize = 3 (X, Y, Z)
     *                              Se for um array de cores, attributeSize = 4 (R, G, B, A)
     */
    createArrayBuffer(shaderAttributeId, data, attributeSize) {
        let gl = this.gl

        // Cria buffer que irá conter dados dos vértices (como posição ou cor).
        let buffer = gl.createBuffer()
        // Define o array de vértices como o ativo, isto é, futuras chamadas
        // ao gl.ARRAY_BUFFER irão referênciar esse array.
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        // Carrega array de vértices no buffer.
        // gl.STATIC_DRAW define que o objeto será estático, isto é, os vértices
        // não serão constantemente movidos.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)

        // Ativa atributo com dados dos vértices.
        gl.enableVertexAttribArray(shaderAttributeId)
        // Define o formato do array de dados dos vértices.
        gl.vertexAttribPointer(
            shaderAttributeId, // O índice do atributo no shader.
            attributeSize, // Quantiade de elementos cada vértice do array possui (veja exemplos acima).
            gl.FLOAT, // O tipo de dados do array é float.
            false, // Não aplica normalização aos valores (isto é, limitar entre -1 e 1).
            0, // Stride: O tamanho em bytes de cada item no array.
               // Utilizado caso exista mais de um tipo de informação no mesmo array.
               // Como utilizamos um array separado para cada informação, então pode ser 0.
            0 // Posição do array que contém os dados (0 = desde o início).
        )
    }
}
