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
        this.camera = this.experience.camera

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
        this.runVelocity = 0.008
        this.walkVelocity = 0.002

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

    directionOffset(keysPressed) 
    {
        let directionOffset = 0 // Z

        if (keysPressed[this.sKey]) {
            if (keysPressed[this.dKey]) {
                directionOffset = Math.PI / 4 // Z+Q
            } else if (keysPressed[this.qKey]) {
                directionOffset = - Math.PI / 4 // Z+D
            }
        } else if (keysPressed[this.zKey]) {
            if (keysPressed[this.dKey]) {
                directionOffset = Math.PI / 4 + Math.PI / 2 // S+Q
            } else if (keysPressed[this.qKey]) {
                directionOffset = -Math.PI / 4 - Math.PI / 2 // S+D
            } else {
                directionOffset = Math.PI // s
            }
        } else if (keysPressed[this.dKey]) {
            directionOffset = Math.PI / 2 // Q
        } else if (keysPressed[this.qKey]) {
            directionOffset = - Math.PI / 2 // D
        }

        return directionOffset
    }

    updateCameraTarget(moveX, moveZ)
    {
        this.camera.instance.position.x -= moveX
        this.camera.instance.position.z -= moveZ

        // update camera target
        this.cameraTarget.x = this.model.model.position.x
        this.cameraTarget.y = this.model.model.position.y + 1
        this.cameraTarget.z = this.model.model.position.z
        this.camera.controls.target = this.cameraTarget
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

        if (this.currentAction == 'running' || this.currentAction == 'walking') {

            // Calculate towards camera direction
            const angleYCameraDirection = Math.atan2(
                (this.camera.instance.position.x - this.model.model.position.x),
                (this.camera.instance.position.z - this.model.model.position.z)
            )

            // Diagonal movement angle offset
            const directionOffset = this.directionOffset(this.keysPressed)

            // Rotate model
            this.rotateQuaternion.setFromAxisAngle(this.rotateAngle, angleYCameraDirection + directionOffset)
            this.model.model.quaternion.rotateTowards(this.rotateQuaternion, 0.07)

            // Calculate direction
            this.camera.instance.getWorldDirection(this.walkDirection)
            this.walkDirection.y = 0
            this.walkDirection.normalize()
            this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset)

            // Run-walk velocity
            const velocity = this.currentAction == 'running' ? this.runVelocity : this.walkVelocity

            // Move model & camera
            const moveX = this.walkDirection.x * velocity * this.time.delta
            const moveZ = this.walkDirection.z * velocity * this.time.delta
            this.model.model.position.x -= moveX
            this.model.model.position.z -= moveZ
            this.updateCameraTarget(moveX, moveZ)
        }

    }

}