import * as THREE from 'three'
import Experience from '../Experience.js'
import { GroundedSkybox } from 'three/examples/jsm/Addons.js'
import { RGBELoader } from 'three/examples/jsm/Addons.js'

export default class Environment
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        
        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('environment')
        }

        this.setSunLight()
        this.setEnvironmentMap()
    }

    setSunLight()
    {
        this.sunLight = new THREE.DirectionalLight('#ffffff', 4)

        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.near = -30
        this.sunLight.shadow.camera.far = 50
        this.sunLight.shadow.mapSize.set(2048, 2048)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.shadow.camera.top = 25
        this.sunLight.shadow.camera.right = 40
        this.sunLight.shadow.camera.bottom = - 30
        this.sunLight.shadow.camera.left = - 45

        this.sunLight.position.set(-5, 5, 5)

        const directionalLightCameraHelper = new THREE.CameraHelper(this.sunLight.shadow.camera)
        // this.scene.add(directionalLightCameraHelper)
        this.scene.add(this.sunLight)

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.sunLight, 'intensity')
                .name('sunLightIntensity')
                .min(0)
                .max(10)
                .step(0.001)
            
            this.debugFolder
                .add(this.sunLight.position, 'x')
                .name('sunLightX')
                .min(- 5)
                .max(5)
                .step(0.001)
            
            this.debugFolder
                .add(this.sunLight.position, 'y')
                .name('sunLightY')
                .min(- 5)
                .max(5)
                .step(0.001)
            
            this.debugFolder
                .add(this.sunLight.position, 'z')
                .name('sunLightZ')
                .min(- 5)
                .max(5)
                .step(0.001)
        }
    }

    setEnvironmentMap() {

        this.environmentMap = {}
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.intensity = 0.3
        this.environmentMap.texture.mapping = THREE.EquirectangularReflectionMapping
        
        this.scene.environment = this.environmentMap.texture
        this.scene.environmentIntensity = this.environmentMap.intensity
        // this.scene.background = this.environmentMap.texture
        // this.scene.backgroundIntensity = 0.3
    
        this.environmentMap.updateMaterials = () => {
            this.scene.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }
        this.environmentMap.updateMaterials()
    
        // Debug
        if (this.debug.active) {
            this.debugFolder
                .add(this.environmentMap, 'intensity')
                .name('envMapIntensity')
                .min(0)
                .max(4)
                .step(0.001)
                .onChange(this.environmentMap.updateMaterialss)
        }
    }
 
}