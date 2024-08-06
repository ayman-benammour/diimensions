import Experience from '../Experience.js'
import Environment from './Environment.js'
import Map from './Map.js'
import Portal from './Portal.js'
import SpiderMan from './SpiderMan.js'
import CharacterControls from '../Utils/CharacterControls.js'
import * as THREE from 'three'
import Interface from '../Interface.js'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.camera = this.experience.camera

        document.querySelector('.miles').addEventListener('click', () => {
            this.setMilesDimension()
        })

        document.querySelector('.miguel').addEventListener('click', () => {
            this.setMiguelDimension()
        })

        // Wait for resources
        this.resources.on('ready', () => {
            this.setMilesDimension()
        })
    }

    update() {
        if (this.portal) {
            this.portal.trackPlayer(this.spiderman.model)
            if (this.portal.tp) {
                switch (this.portal.worldToRender) {
                    case 1:
                        this.setMilesDimension()
                        break;

                    case 2:
                        this.setMiguelDimension()
                        break;

                    case 3:
                        // Monde 2
                        this.experience.scene.clear()
                        this.portal = new Portal(1)
                        this.portal.model.position.set(-40, 1.5, 31.8)
                        this.spiderman = new SpiderMan()
                        // this.floor = new Floor()
                        this.environment = new Environment()
                        this.characterControls = new CharacterControls()
                        this.camera.setTarget(this.spiderman.model.position, 0.5, true)
                        break;
                }
            }
        }

        if (this.spiderman)
            this.spiderman.update()

        if (this.characterControls)
            this.characterControls.update()

        if (this.spiderman && this.spidermanModel == 'miles') {
            this.camera.setTarget(this.spiderman.model.position, 1.2, true)
        } else if (this.spiderman && this.spidermanModel == 'miguel') {
            this.camera.setTarget(this.spiderman.model.position, 1.5, true)
        }
    }

    setMilesDimension() {
        this.experience.scene.clear()
        this.spidermanModel = 'miles'

        // Setup camera
        this.camera.instance.position.set(-4.881156534793902, 1.4541228822648555, 21.1177039976208)
        this.camera.instance.rotation.set(-0.10547755394654328, -0.7002182025643359, -0.0681157515964418)
        this.camera.instance.zoom = 2
        this.camera.instance.updateProjectionMatrix()

        // Setup portal
        this.portal = new Portal(2)
        this.portal.model.position.set(-23, 2, 30)

        // Setup map
        this.environment = new Environment('milesEnvMap')
        this.environment.sunLight.color.set(0xffffff)
        this.environment.sunLight.intensity = 4
        this.scene.environmentIntensity = 0.4

        this.map = new Map('milesMap', '/sounds/music-miles-dimension.mp3')
        document.body.style.background = "linear-gradient(180deg, #EE8F61 0%, #FCC28C 29.4%, #EFDDCF 100%)"

        // Setup character
        this.spiderman = new SpiderMan('miles')
        this.spiderman.model.position.set(-3.946427373830228, 0, 16.828284135159702)
        this.spiderman.model.rotation.set(0, -0.6529530259104375, 0)
        this.characterControls = new CharacterControls(0.008)

        // Set interface
        if (this.interface) {
            this.interface.destroy()
        }
        this.interface = new Interface('miles')
    }

    setMiguelDimension() {
        this.experience.scene.clear()
        this.spidermanModel = 'miguel'

        // Setup camera
        this.camera.instance.position.set(-3.671042134507728, 1.8239871858982313, 1.8249157014114301)
        this.camera.instance.rotation.set(-3.002967028501666, 0.7785894588412353, 3.043922527344918)
        this.camera.instance.zoom = 2
        this.camera.instance.updateProjectionMatrix()

        // Setup portal
        this.portal = new Portal(1)
        this.portal.model.position.set(8, 2, -4)

        // Setup map
        this.environment = new Environment('miguelEnvMap')
        this.environment.sunLight.color.set(0x16A9D3)
        this.environment.sunLight.intensity = 4
        this.scene.environmentIntensity = 4
        this.environment.environmentMap.texture.colorSpace = THREE.SRGBColorSpace

        this.map = new Map('miguelMap', '/sounds/music-miguel-dimension.mp3')
        document.body.style.background = "linear-gradient(180deg, #05182F 0%, #125577 58%, #16A9D3 100%)"

        // Setup character
        this.spiderman = new SpiderMan('miguel')
        this.spiderman.model.position.set(-4.538112398666169, 0, 5.0059024006640485)
        this.spiderman.model.rotation.set(0, -0.9324680386519175, 0)
        this.characterControls = new CharacterControls(0.007)

        // Set interface
        if (this.interface) {
            this.interface.destroy()
        }
        this.interface = new Interface('miguel')
    }
}
