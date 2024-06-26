import * as THREE from 'three'

import Debug from './Utils/Debug.js'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'

import sources from './sources.js'

let instance = null

export default class Experience {
    constructor(_canvas, onSceneChange) {
        // Singleton
        if (instance) {
            return instance
        }
        instance = this

        // Global access
        window.experience = this

        // Options
        this.canvas = _canvas
        this.onSceneChange = onSceneChange

        // Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()
        this.renderedWorld = 1
        
        this.characterControls = new CharacterControls()

        // Variable for switching scenes
        this.sceneDisplay = 1

        // Resize event
        this.sizes.on('resize', () => {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () => {
            this.update()
        })

        // Initialize the first scene
        this.startSceneSwitching()
    }

    startSceneSwitching() {
        setInterval(() => {
            this.sceneDisplay = this.sceneDisplay === 1 ? 2 : 1
            this.onSceneChange(this.sceneDisplay)
            this.switchScene()
        }, 5000)
    }

    switchScene() {
        this.destroyCurrentScene()
        if (this.sceneDisplay === 1) {
            this.loadScene1()
        } else {
            this.loadScene2()
        }
    }

    loadScene1() {
        // Code to initialize scene 1
        console.log("Loading Scene 1")
        // Add your specific scene 1 initialization code here
    }

    loadScene2() {
        // Code to initialize scene 2
        console.log("Loading Scene 2")
        // Add your specific scene 2 initialization code here
    }

    destroyCurrentScene() {
        // Traverse the scene and dispose of all geometries, materials, and textures
        this.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()

                if (Array.isArray(child.material)) {
                    for (let material of child.material) {
                        this.disposeMaterial(material)
                    }
                } else {
                    this.disposeMaterial(child.material)
                }
            }
        })

        if (this.camera.controls) {
            this.camera.controls.dispose()
        }
        this.renderer.instance.dispose()

        if (this.debug.active)
            this.debug.ui.destroy()
    }

    disposeMaterial(material) {
        if (material) {
            for (const key in material) {
                if (material[key] && typeof material[key].dispose === 'function') {
                    material[key].dispose()
                }
            }
        }
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }


    update() {
        this.camera.update()
        this.world.update()
        this.renderer.update()
    }

    destroy() {
        this.sizes.off('resize')
        this.time.off('tick')

        this.destroyCurrentScene()
    }
}
