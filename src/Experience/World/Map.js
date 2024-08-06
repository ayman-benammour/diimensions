import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Map
{
    constructor(map, music)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Resource
        this.resource = this.resources.items[map]

        this.setMap()
        this.setAmbienceSound(music)
    }

    setMap() {
        this.map = this.resource.scene
        this.map.scale.set(1, 1, 1)
        this.scene.add(this.map)
        this.map.castShadow = true
        this.map.receiveShadow = true

        this.map.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }

    setAmbienceSound(music)
    {
        this.ambienceSound = new Audio('/sounds/ambiance.mp3')
        this.musicSound = new Audio(music)
        // this.musicSound2 = new Audio('/sounds/music-miguel-dimension.mp3')
        this.ambienceSound.volume = 0.2
        this.musicSound.volume = 0.1
        // this.musicSound2.volume = 0.1
        this.ambienceSound.loop = true
        this.musicSound.loop = true
        // this.musicSound2.loop = true
    
        this.userInteracted = false
    
        // Function to play the audio if the user has interacted
        const playAmbienceSound = () => {
            if (!this.userInteracted) {
                this.userInteracted = true
                this.ambienceSound.play() // Play the audio file
                this.musicSound.play() // Play the audio file
            }
        }
    
        // Listen for any user interaction to enable audio
        document.addEventListener('click', playAmbienceSound, { once: true })
        document.addEventListener('keydown', playAmbienceSound, { once: true })
    }
}