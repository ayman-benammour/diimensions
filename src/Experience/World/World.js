import Experience from '../Experience.js'
import Environment from './Environment.js'
import Map from './Map.js'
import MapLego from './MapLego.js'
import { Portal } from './Portal.js'
import SpiderMan from './SpiderMan.js'
import CharacterControls from '../Utils/CharacterControls.js'
import * as THREE from 'three'
import MapMinecraft from './MapMinecraft.js'

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
                this.portal.model.position.set(-3, 1, 33)
                this.spiderman = new SpiderMan()
                this.map = new Map()
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
                        this.portal.model.position.set(-3, 1, 33)
                        this.spiderman = new SpiderMan()
                        this.map = new Map()
                        this.environment = new Environment()
                        this.characterControls = new CharacterControls()
                        break;
                    case 2:
                        // Monde 2
                        this.experience.scene.clear()
                        this.portal = new Portal(1)
                        this.portal.model.position.set(-20, 1.5, 32)
                        this.spiderman = new SpiderMan()
                        this.map = new MapLego()
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