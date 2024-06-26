import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import { Portal } from './Portal.js'
import SpiderMan from './SpiderMan.js'
import CharacterControls from '../Utils/CharacterControls.js'
import * as THREE from 'three'  

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.renderedWorld = 1

        // Wait for resources
        this.resources.on('ready', () => {
            if (this.renderedWorld == 1) {
                // Setup
                this.portal = new Portal(2)
                this.portal.model.position.set(0, 1, 5)
                this.spiderman = new SpiderMan()
                this.floor = new Floor()
                this.environment = new Environment()
                this.characterControls = new CharacterControls()
            }
        })
    }

    update() {
        if (this.characterControls)
            this.characterControls.update()
        if (this.portal) {
            this.portal.trackPlayer(this.spiderman.model)
            if (this.portal.tp) {
                switch (this.portal.worldToRender) {
                    case 1:
                        // Monde 1
                        this.experience.scene.clear()
                        this.portal = new Portal(2)
                        this.portal.model.position.set(0, 1, 5)
                        this.spiderman = new SpiderMan()
                        this.floor = new Floor()
                        this.environment = new Environment()
                        this.characterControls = new CharacterControls()
                        break;
                    case 2:
                        // Monde 2
                        this.experience.scene.clear()
                        this.portal = new Portal(1)
                        this.portal.model.position.set(0, 1, 15)
                        this.spiderman = new SpiderMan()
                        // this.floor = new Floor()
                        this.environment = new Environment()
                        this.characterControls = new CharacterControls()
                        break;
                }
            }
        }
        if (this.spiderman)
            this.spiderman.update()
    }
}