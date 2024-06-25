import * as THREE from 'three'
import Experience from '../Experience.js'

export default class CharacterControls
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        console.log(this.experience.world.fox)

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('movements')
        }

        this.test()
  
    }

    test()
    {
        this.keysPressed = {}

        document.addEventListener('keydown', (event) => {
            if(event.shiftKey) {
                // Toggle
            } else {
                this.keysPressed[event.key.toLowerCase()] = true
            }
        },false)

        document.addEventListener('keyup', (event) => {
            this.keysPressed[event.key.toLowerCase()] = false
        },false)
    }

    update()
    {
        // this.handleMovements()
    }
}