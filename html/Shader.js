"use strict";

/**
 * Define um Shader que pode ser carregado e compilado.
 */
export class Shader {
    /**
     * Instancia shader.
     *
     * @param {*} gl Contexto OpenGL.
     */
    constructor(gl) {
        /**
         * Contexto OpenGL.
         */
        this.gl = gl

        /**
         * Caminho do código fonte do vextex shader.
         */
        this.vertexPath = "shader/Base.vert"

        /**
         * Caminho do código fonte do fragment shader.
         */
        this.fragmentPath = "shader/Base.frag"

        /**
         * Programa de shader.
         */
        this.program
    }

    /**
     * Carrega e compila código fonte dos shaders.
     */
    async compile() {
        let gl = this.gl

        // Carrega código fonte do vertex shader.
        this.vertexSource = await this.loadFile(this.vertexPath)
        // Compila shader.
        let vertexShader = this.createShader(gl.VERTEX_SHADER, this.vertexSource)

        // Carrega código fonte do fragment shader.
        this.fragmentSource = await this.loadFile(this.fragmentPath)
        // Compila shader.
        let fragmentShader = this.createShader(gl.FRAGMENT_SHADER, this.fragmentSource)

        // Cria programa de shader.
        var program = gl.createProgram()
        // Anexa shaders ao programa.
        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)
        // Linka os shaders anexados em um programa.
        gl.linkProgram(program)

        // Verifica sucesso na linkagem.
        let success = gl.getProgramParameter(program, gl.LINK_STATUS)
        if (success) {
            this.program = program
        }
        else {
            // Em caso de falha, imprime log e deleta programa.
            console.log(gl.getProgramInfoLog(program))
            gl.deleteProgram(program)
        }
    }

    /**
     * Localiza o atributo no programa de shader e retorna uma referência.
     *
     * @param {*} attribute
     * @returns
     */
    getAttribLocation(attribute) {
        return this.gl.getAttribLocation(this.program, attribute)
    }

    /**
     * Localiza o uniforme no programa de shader e retorna uma referência.
     *
     * @param {*} uniform
     * @returns
     */
    getUniformLocation(uniform) {
        return this.gl.getUniformLocation(this.program, uniform)
    }

    /**
     * Cria e compila objeto shader.
     *
     * @param {*} type Tipo de shader.
     * @param {string} source Código fonte.
     * @returns Objeto shader.
     */
    createShader(type, source) {
        let gl = this.gl

        // Cria shader.
        let shader = gl.createShader(type)

        // Define o código fonte do shader.
        gl.shaderSource(shader, source)
        // Compila shader.
        gl.compileShader(shader)

        // Verifica sucesso na compilação.
        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
        if (success) {
            return shader
        }

        // Em caso de falha, imprime log e deleta shader.
        console.log(gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
    }

    /**
     * Ativa este shader para uso no frame atual.
     */
    use() {
        this.gl.useProgram(this.program)
    }

    /**
     * Carrega conteúdo do arquivo.
     *
     * @param {string} path
     * @returns Conteúdo do arquivo (requer await).
     */
    async loadFile(path) {
        return await fetch(path)
            .then(response => response.text())
            // .then(contents => {
            //     return contents
            // })
    }
}
