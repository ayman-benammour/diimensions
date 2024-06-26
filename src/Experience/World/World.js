import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import { Portal } from './Portal.js'
import SpiderMan from './SpiderMan.js'
import CharacterControls from '../Utils/CharacterControls.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.portal = new Portal()
            this.spiderman = new SpiderMan()
            this.floor = new Floor()
            this.environment = new Environment()
            this.characterControls = new CharacterControls()
        })
    }

    update()
    {
        if(this.characterControls)
            this.characterControls.update()
        if(this.portal)
            this.portal.trackPlayer(this.spiderman.model)
        if(this.spiderman)
            this.spiderman.update()
    }
}