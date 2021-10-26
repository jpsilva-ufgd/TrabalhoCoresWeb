"use strict";

/**
 * Uma cena que pode ser renderizada em um canvas, com WebGL2.
 */
export class Scene {
    /**
     * Instancia cena sobre um canvas.
     *
     * @param {*} canvasSelector Seletor CSS do canvas.
     */
    constructor(canvasSelector) {
        // Localiza o canvas no documento HTML a partir do seletor CSS.
        let canvas = document.querySelector(canvasSelector)

        /**
         * Contexto OpenGL.
         */
        this.gl = canvas.getContext("webgl2", {
            preserveDrawingBuffer: true // Desenha objetos sobre o buffer atual, ao invés
                                        // apagar completamente a cada renderização.
        })

        if (this.gl == null) {
            throw new Error("Falha ao inicializar WebGL. Utilize um navegador com suporte a WebGL 2.")
        }

        /**
         * Cor de fundo (RGBA) que preencherá o canvas a cada frame, antes de desenhar os objetos.
         */
        this.backgroundColor // = [0, 0, 0, 1]
    }

    /**
     * Carrega objetos pendentes na cena.
     */
    async load() {
        // Itera sobre todos os membros do objeto.
        for (let member in this) {
            member = this[member]

            // Verifica se possui a flag indiciando que não foi carregado, e se possui o método para executar.
            if (member.loaded === false && typeof member.load === "function") {
                await member.load()
            }
        }
    }

    /**
     * Inicia renderização, chamando o método 'draw' a cada frame para desenha a cena.
     */
    async start() {
        // Carrega cena.
        await this.load()

        // Agenda a execução do método para renderizar próximo frame.
        // O método 'bind(this)' é necessário para não perder a referência
        // ao contexto 'this' pelo callback.
        this.frameRequest = requestAnimationFrame(this.requestDraw.bind(this))
    }

    /**
     * Interrompe renderização.
     */
    stop() {
        cancelAnimationFrame(this.frameRequest)
    }

    /**
     * Atualiza tamanho da viewport do canvas, caso este seja redimensionado no documento HTML.
     */
    updateCanvasSize() {
        let canvas = this.gl.canvas

        // Se o tamanho no documento (clientWidth, clientHeight) for diferente do tamanho
        // do buffer do canvas (width, height), redimensiona o canvas.
        if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
            canvas.width = canvas.clientWidth
            canvas.height = canvas.clientHeight
        }

        // Ajusta viewport de acordo com as dimensões do canvas.
        this.gl.viewport(0, 0, canvas.width, canvas.height)
    }

    /**
     * Prepara cada frame para ser renderizado, e chama os métodos apropriados.
     *
     * @param {*} time
     */
    requestDraw(time) {
        let gl = this.gl

        // Converte o tempo de milissegundos em segundos.
        time *= 0.001
        // Atualiza tamanho da viewport.
        this.updateCanvasSize()

        if (this.backgroundColor) {
            // Define a cor de fundo.
            gl.clearColor(...this.backgroundColor)
            // Limpa o buffer com a cor de fundo especificada.
            gl.clear(gl.COLOR_BUFFER_BIT)
        }

        // Desenha cena.
        this.draw(time)

        // Agenda novamente a execução do mesmo método para renderizar próximo frame.
        this.frameRequest = requestAnimationFrame(this.requestDraw.bind(this))
    }

    /**
     * Método abstrato, chamado a cada frame para desenhar cena.
     * Deve ser reescrito pela subclasse para descrever a cena.
     *
     * @param {*} time Tempo de execução, em segundos.
     */
    draw(time) {
        throw new Error("Scene.draw() é abstrato e deve ser definido para renderizar cena.")
    }
}
