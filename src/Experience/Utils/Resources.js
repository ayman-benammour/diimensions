import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import EventEmitter from './EventEmitter.js'

export default class Resources extends EventEmitter
{
    constructor(sources)
    {
        super()

        this.sources = sources

        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.setLoaders()
        this.startLoading()
    }

    setLoaders()
    {
        const loadingScreenElement = document.querySelector('.loadingScreen')
        const loadingButtonElement = document.querySelector('.loadingButton')
        const loadingBarElement = document.querySelector('.loadingBar')

        console.log(loadingButtonElement)

        this.loadingManagement = new THREE.LoadingManager(
            // Loaded
            () =>
            {
                window.setTimeout(() =>
                    {
                        loadingButtonElement.classList.add('ended')
                        window.setTimeout(() =>
                            {
                                loadingScreenElement.classList.add('ended')
                            }, 1000)
                        loadingBarElement.classList.add('ended')
                        loadingBarElement.style.transform = ''
                    }, 1000)
            },

            // Progress
            (itemUrl, itemsLoaded, itemsTotal) =>
            {
                const progressRatio = itemsLoaded / itemsTotal
                loadingBarElement.style.transform = `scaleX(${progressRatio})`
            }
        )

        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader(this.loadingManagement)
        this.loaders.textureLoader = new THREE.TextureLoader(this.loadingManagement)
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader(this.loadingManagement)
    }

    startLoading()
    {
        // Load each source
        for(const source of this.sources)
        {
            if(source.type === 'gltfModel')
            {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if(source.type === 'texture')
            {
                this.loaders.textureLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if(source.type === 'cubeTexture')
            {
                this.loaders.cubeTextureLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file)
                    }
                )
            }
        }
    }

    sourceLoaded(source, file)
    {
        this.items[source.name] = file

        this.loaded++

        if(this.loaded === this.toLoad)
        {
            this.trigger('ready')
        }
    }
}