import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera {
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.setInstance()
        this.setControls()
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.set(6, 4, 8)
        this.scene.add(this.instance)
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        // Mise à jour de la position de la caméra pour suivre le modèle
        // if (this.model) {
        //     const offset = new THREE.Vector3(0, 2, 5) // Ajustez cet offset selon vos besoins
        //     const targetPosition = new THREE.Vector3().copy(this.model.position).add(offset)
        //     this.instance.position.lerp(targetPosition, 0.1)
        //     this.instance.lookAt(this.model.position)
        // }

        this.controls.update()
    }
}
