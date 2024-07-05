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
        this.model = this.experience.world.spiderman
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
        this.zKey = 'KeyW'
        this.qKey = 'KeyA'
        this.sKey = 'KeyS'
        this.dKey = 'KeyD'
        this.upArrow = 'ArrowUp'
        this.leftArrow = 'ArrowLeft'
        this.downArrow = 'ArrowDown'
        this.rightArrow = 'ArrowRight'
        this.vKey = 'KeyV'
        this.bKey = 'KeyB'
        this.cKey = 'KeyC'
        this.nKey = 'KeyN'
        this.spaceKey = 'Space'
        this.shiftKey = 'ShiftLeft'
        this.directions = [this.zKey, this.qKey, this.sKey, this.dKey, this.upArrow, this.leftArrow, this.downArrow, this.rightArrow]

        this.toggleRun = false

        this.keysPressed()
        
        this.currentAction = 'idle'

        // Custom sequence
        this.secretCodeSequence = [
            [this.zKey, this.upArrow], [this.qKey, this.leftArrow], [this.sKey, this.downArrow], [this.qKey, this.leftArrow],
            [this.zKey, this.upArrow], [this.qKey, this.leftArrow], [this.sKey, this.downArrow], [this.qKey, this.leftArrow],
            [this.zKey, this.upArrow], [this.dKey, this.rightArrow], [this.zKey, this.upArrow], [this.dKey, this.rightArrow],
            [this.zKey, this.upArrow], [this.qKey, this.leftArrow], [this.zKey, this.upArrow], [this.dKey, this.rightArrow],
            [this.sKey, this.downArrow], [this.dKey, this.rightArrow], [this.zKey, this.upArrow], [this.qKey, this.leftArrow],
            [this.zKey, this.upArrow], [this.qKey, this.leftArrow], [this.bKey], [this.nKey]
        ];
        this.secretCodeIndex = 0

            // Create audio element
            this.secretMusic = new Audio('/sounds/secretMusic.mp3')
            this.secretMusic.volume = 0.5
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
                this.keysPressed[event.code] = true
            }

            // Check for emotes
            if (event.code === this.cKey) {
                this.newAction = 'emote1'
                this.model.animation.play(this.newAction)
            }

            if (event.code === this.vKey) {
                this.newAction = 'emote2'
                this.model.animation.play(this.newAction)
            }

            if (event.code === this.spaceKey) {
                this.newAction = 'jump'
                this.model.animation.play(this.newAction)
            }

            this.camera.instance.zoom = 1
            this.camera.instance.updateProjectionMatrix()

            // Check custom sequence
            if (this.secretCodeSequence[this.secretCodeIndex].includes(event.code)) {
                this.secretCodeIndex++;
                if (this.secretCodeIndex === this.secretCodeSequence.length) {
                    this.secretMusic.play()

                    this.newAction = 'emote3'
                    this.model.animation.play(this.newAction)

                    this.secretCodeIndex = 0;
                }
            } else {
                this.secretCodeIndex = 0;
            }

        }, false)

        document.addEventListener('keyup', (event) => {
            this.keysPressed[event.code] = false
        }, false)
    }

    directionOffset(keysPressed) 
    {
        let directionOffset = 0 // Z

        if (keysPressed[this.sKey] || keysPressed[this.downArrow]) {
            if (keysPressed[this.dKey] || keysPressed[this.rightArrow]) {
                directionOffset = Math.PI / 4 // Z+Q
            } else if (keysPressed[this.qKey] || keysPressed[this.leftArrow]) {
                directionOffset = - Math.PI / 4 // Z+D
            }
        } else if (keysPressed[this.zKey] || keysPressed[this.upArrow]) {
            if (keysPressed[this.dKey] || keysPressed[this.rightArrow]) {
                directionOffset = Math.PI / 4 + Math.PI / 2 // S+Q
            } else if (keysPressed[this.qKey] || keysPressed[this.leftArrow]) {
                directionOffset = -Math.PI / 4 - Math.PI / 2 // S+D
            } else {
                directionOffset = Math.PI // s
            }
        } else if (keysPressed[this.dKey] || keysPressed[this.rightArrow]) {
            directionOffset = Math.PI / 2 // Q
        } else if (keysPressed[this.qKey] || keysPressed[this.leftArrow]) {
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
            this.newAction = 'run'
        } else if (this.directionPressed) {
            this.newAction = 'walk'
        } else {
            this.newAction = 'idle'
        }

        // Change animation only if the new action is different
        if (this.currentAction !== this.newAction) {
            this.currentAction = this.newAction
            this.model.animation.play(this.newAction)
        }

        if (this.currentAction == 'run' || this.currentAction == 'walk') {
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
            const velocity = this.currentAction == 'run' ? this.runVelocity : this.walkVelocity

            // Move model & camera
            const moveX = this.walkDirection.x * velocity * this.time.delta
            const moveZ = this.walkDirection.z * velocity * this.time.delta
            this.model.model.position.x -= moveX
            this.model.model.position.z -= moveZ
            this.updateCameraTarget(moveX, moveZ)
        }

    }
}
