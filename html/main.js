"use strict";

import { Scene } from "./Scene.js"
import { Triangle } from "./Triangle.js"
import { FullRectangle } from "./FullRectangle.js"

class TestScene extends Scene {
    constructor(canvasSelector) {
        super(canvasSelector)

        // this.t = new Triangle(this.gl)
        this.obj = new FullRectangle(this.gl)
        this.obj.shader.fragmentPath = "shader/ColorWheel.frag"
    }

    draw(time) {
        this.obj.draw(time)
        // this.t.draw()
    }
}

function main() {
    let scene = new TestScene("#gl-canvas-1")

    let frequencyInput = document.getElementById("input-frequency")
    frequencyInput.oninput = function() {
        scene.obj.frequency = this.value / 10
    }

    scene.start()

    globalThis.scene = scene
}

window.onload = main
