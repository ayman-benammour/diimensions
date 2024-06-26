import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Fox from './Fox.js'
import { Portal } from './Portal.js'
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
            this.fox = new Fox()
            this.portal = new Portal()
            this.floor = new Floor()
            this.environment = new Environment()
            this.characterControls = new CharacterControls()
        })
    }

    update()
    {
        if(this.characterControls)
            this.characterControls.update()
        if(this.fox)
            this.fox.update()
        if(this.portal)
            this.portal.update()
    }
}