import * as THREE from 'three'
import Experience from './Experience.js'

export default class Interface
{
    constructor()
    {
        this.experience = new Experience()
        this.camera = this.experience.camera

        this.echapElement = document.querySelector('.echap')
        this.menuElement = document.querySelector('.menu')
        this.canvasElement = document.querySelector('.webgl')

        this.menu()
    }

    menuState()
    {
        this.echapElement.classList.toggle('menuClose')
        this.menuElement.classList.toggle('menuClose')
        this.canvasElement.classList.toggle('menuClose')

        if (this.echapElement.classList.contains('menuClose')) {
            this.echapElement.src = "/images/menuButton.svg";
        } else {
            this.echapElement.src = "/images/echapButton.svg";
        }
    }

    menu() 
    {
        
        this.echapElement.addEventListener('click', () => {
            this.menuState()
        })
        
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Escape') {
                this.menuState()
            }
        });
    }
}