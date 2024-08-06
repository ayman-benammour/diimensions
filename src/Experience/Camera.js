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

        // For interpolation
        this.isInterpolating = false
        this.interpolationSpeed = 0.05 // Adjust the speed of interpolation
        this.targetStart = new THREE.Vector3()
        this.targetEnd = new THREE.Vector3()
        this.interpolationFactor = 0

        // document.addEventListener('click', () =>
        // {
        //     console.log('CAMERA POSITION', this.instance.position)
        //     console.log('CAMERA ROTATION', this.instance.rotation)
        // })
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 400)
        this.instance.position.set(-4.881156534793902, 1.4541228822648555, 21.1177039976208)
        this.instance.rotation.set(-0.10547755394654328, -0.7002182025643359, -0.0681157515964418)
        this.instance.zoom = 2
        this.instance.updateProjectionMatrix()
        this.scene.add(this.instance)
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    setTarget(target, heightOffset = 0.5, immediate = false) {
        const adjustedTarget = target.clone()
        adjustedTarget.y += heightOffset
        if (immediate) {
            this.controls.target.copy(adjustedTarget)
            this.controls.update()
        } else {
            this.targetStart.copy(this.controls.target)
            this.targetEnd.copy(adjustedTarget)
            this.interpolationFactor = 0
            this.isInterpolating = true
            
        }
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        if (this.isInterpolating) {
            this.interpolationFactor += this.interpolationSpeed
            if (this.interpolationFactor >= 1) {
                this.interpolationFactor = 1
                this.isInterpolating = false
            }
            this.controls.target.lerpVectors(this.targetStart, this.targetEnd, this.interpolationFactor)
        }
        this.controls.update()
    }
}
