import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Map
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Resource
        this.resource = this.resources.items.city

        this.setMap()
    }

    setMap() {
        this.map = this.resource.scene
        this.map.scale.set(1, 1, 1)
        this.scene.add(this.map)
        this.map.castShadow = true

        this.map.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }
}