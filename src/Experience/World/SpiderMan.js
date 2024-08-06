import * as THREE from 'three'
import Experience from '../Experience.js'

export default class SpiderMan {
    constructor(model) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('model')
        }

        // Resource
        this.resource = this.resources.items[model]

        this.setModel()
        this.setAnimation()
        // document.addEventListener('click', () =>
        // {
        //     console.log('MODEL POSITION', this.model.position)
        //     console.log('MODEL ROTATION', this.model.rotation)
        // })
    }

    setModel() {
        this.model = this.resource.scene
        this.model.scale.set(1, 1, 1)
        this.scene.add(this.model)
    
        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true
                child.receiveShadow = true
    
                // Make sure materials are not transparent by default
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(mat => {
                            mat.transparent = false
                            mat.depthWrite = true
                            mat.depthTest = true
                            mat.side = THREE.FrontSide
                        })
                    } else {
                        child.material.transparent = false
                        child.material.depthWrite = true
                        child.material.depthTest = true
                        child.material.side = THREE.FrontSide
                    }
                }
            }
        })
    }
    

    setAnimation() {
        this.animation = {}

        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.model)

        // Actions
        this.animation.actions = {}

        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations.find(anim => anim.name === 'idle'))
        this.animation.actions.walk = this.animation.mixer.clipAction(this.resource.animations.find(anim => anim.name === 'walk'))
        this.animation.actions.run = this.animation.mixer.clipAction(this.resource.animations.find(anim => anim.name === 'run'))
        this.animation.actions.jump = this.animation.mixer.clipAction(this.resource.animations.find(anim => anim.name === 'jump'))
        this.animation.actions.emote1 = this.animation.mixer.clipAction(this.resource.animations.find(anim => anim.name === 'emote1'))
        this.animation.actions.emote2 = this.animation.mixer.clipAction(this.resource.animations.find(anim => anim.name === 'emote2'))
        this.animation.actions.emote3 = this.animation.mixer.clipAction(this.resource.animations.find(anim => anim.name === 'emote3'))

        this.animation.actions.current = this.animation.actions.idle
        this.animation.actions.current.play()

        // Play the action
        this.animation.play = (name) => {
            const newAction = this.animation.actions[name]
            const oldAction = this.animation.actions.current

            newAction.reset()
            newAction.play()
            newAction.crossFadeFrom(oldAction, 0.2)

            this.animation.actions.current = newAction
        }
    }

    update() {
        this.animation.mixer.update(this.time.delta * 0.001)
    }
}
