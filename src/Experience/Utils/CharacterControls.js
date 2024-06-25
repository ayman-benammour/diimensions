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
        this.model = this.experience.world.fox

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('movements')
        }

        // Temporary data
        this.walkDirection = new THREE.Vector3()
        this.rotateAngle = new THREE.Vector3(0, 1, 0)
        this.rotateQuaternion = new THREE.Quaternion()
        this.cameraTarget = new THREE.Vector3()

        // Constants
        this.runVelocity = 5
        this.walkVelocity = 2

        // Keys
        this.zKey = 'z'
        this.qKey = 'q'
        this.sKey = 's'
        this.dKey = 'd'
        this.shiftKey = 'shift'
        this.directions = [this.zKey, this.qKey, this.sKey, this.dKey]

        this.toggleRun = false

        this.keysPressed()
        
        this.currentAction = 'idle'
  
    }

    switchRunToggle()
    {
        this.toggleRun = !this.toggleRun
    }

    keysPressed()
    {
        this.keysPressed = {}

        document.addEventListener('keydown', (event) => {
            if(event.shiftKey) {
                this.switchRunToggle()
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

        this.directionPressed = this.directions.some(key => this.keysPressed[key] == true)

        if (this.directionPressed && this.toggleRun) {
            this.newAction = 'running'
        } else if (this.directionPressed) {
            this.newAction = 'walking'
        } else {
            this.newAction = 'idle'
        }

        // Change animation only if the new action is different
        if (this.currentAction !== this.newAction) {
            this.currentAction = this.newAction
            this.model.animation.play(this.currentAction)
        }

    }

}