import Experience from '../Experience.js'
import Environment from './Environment.js'
import Map from './Map.js'
import MapLego from './MapLego.js'
import MapMinecraft from './MapMinecraft.js'
import Portal from './Portal.js'
import SpiderMan from './SpiderMan.js'
import CharacterControls from '../Utils/CharacterControls.js'
import * as THREE from 'three'

export default class World 
{
    constructor() 
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () => {
                // Setup
                this.portal = new Portal(2)
                this.portal.model.position.set(-23, 4, 30)
                this.spiderman = new SpiderMan()
                this.map = new Map()
                this.environment = new Environment()
                this.characterControls = new CharacterControls()
        })
    }

    update() 
    {
        if (this.portal)
        {
            this.portal.trackPlayer(this.spiderman.model)
            if (this.portal.tp) 
            {
                switch (this.portal.worldToRender) 
                {
                    case 1:
                        // Monde 1
                        this.experience.scene.clear()
                        this.portal = new Portal(2)
                        this.portal.model.position.set(-100, 1, 33)
                        this.spiderman = new SpiderMan()
                        this.map = new Map()
                        this.environment = new Environment()
                        this.characterControls = new CharacterControls()
                        break;
                    case 2:
                        // Monde 2
                        this.experience.scene.clear()
                        this.portal = new Portal(3)
                        this.portal.model.position.set(-20, 1.5, 32)
                        this.spiderman = new SpiderMan()
                        this.map = new MapLego()
                        // this.floor = new Floor()
                        this.environment = new Environment()
                        this.characterControls = new CharacterControls()
                        break;
                    case 3:
                        // Monde 2
                        this.experience.scene.clear()
                        this.portal = new Portal(1)
                        this.portal.model.position.set(-40, 1.5, 31.8)
                        this.spiderman = new SpiderMan()
                        this.map = new MapMinecraft()
                        // this.floor = new Floor()
                        this.environment = new Environment()
                        this.characterControls = new CharacterControls()
                        break;
                }
            }
        }

        if (this.spiderman)
            this.spiderman.update()

        if (this.characterControls)
            this.characterControls.update()
    }
}