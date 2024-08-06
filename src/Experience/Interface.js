import * as THREE from 'three';
import Experience from './Experience.js';

export default class Interface {
    constructor(model) {
        this.experience = new Experience();
        this.camera = this.experience.camera;
        this.map = this.experience.world.map;

        this.echapElement = document.querySelector('.echap');
        this.menuElement = document.querySelector('.menu');
        this.canvasElement = document.querySelector('.webgl');
        this.soundElement = document.querySelector('.sound');
        this.profileElement = document.querySelector('.profile');
        this.phoneElement = document.querySelector('.phone');

        // Colors
        if (model === 'miguel') this.menuElement.style.background = '#0a17b6';
        if (model === 'miles') this.menuElement.style.background = '#E60509';

        this.profileElement.src = `/images/${model}/${model}-profile.png`;
        this.phoneElement.src = `/images/${model}/${model}-phone.png`;

        if (this.echapElement.classList.contains('menuClose')) {
            this.echapElement.src = `/images/${model}/${model}-menu-button.svg`;
        } else {
            this.echapElement.src = `/images/${model}/${model}-echap-button.svg`;
        }

        if (this.soundElement.classList.contains('soundOff')) {
            this.soundElement.src = `/images/${model}/${model}-sound-off-button.svg`;
        } else {
            this.soundElement.src = `/images/${model}/${model}-sound-button.svg`;
        }

        // Phone
        this.togglePhone = this.togglePhone.bind(this);
        this.phoneElement.addEventListener('click', this.togglePhone);
        
        this.menu(model);
        this.sound(model);
    }

    togglePhone() {
        this.phoneElement.classList.toggle('active');
    }

    menuState(model) {
        if (!this.echapElement || !this.menuElement || !this.canvasElement) return;

        this.echapElement.classList.toggle('menuClose');
        this.menuElement.classList.toggle('menuClose');
        this.canvasElement.classList.toggle('menuClose');

        if (this.echapElement.classList.contains('menuClose')) {
            this.echapElement.src = `/images/${model}/${model}-menu-button.svg`;
        } else {
            this.echapElement.src = `/images/${model}/${model}-echap-button.svg`;
        }
    }

    menu(model) {
        this.menuStateBound = () => this.menuState(model);
        this.menuKeyDownBound = (event) => {
            if (event.code === 'Escape') {
                this.menuState(model);
            }
        };

        this.echapElement.addEventListener('click', this.menuStateBound);
        document.addEventListener('keydown', this.menuKeyDownBound);
    }

    soundState(model) {
        if (!this.soundElement) return;

        if (this.soundElement.classList.contains('soundOff')) {
            this.soundElement.src = `/images/${model}/${model}-sound-off-button.svg`;
            this.map.ambienceSound.pause();
            this.map.musicSound.pause();
        } else {
            this.soundElement.src = `/images/${model}/${model}-sound-button.svg`;
            this.map.ambienceSound.play();
            this.map.musicSound.play();
        }

        this.soundElement.classList.toggle('soundOn');
        this.soundElement.classList.toggle('soundOff');
    }

    sound(model) {
        this.soundStateBound = () => this.soundState(model);
        this.soundKeyDownBound = (event) => {
            if (event.key === 'm') {
                this.soundState(model);
            }
        };

        this.soundElement.addEventListener('click', this.soundStateBound);
        document.addEventListener('keydown', this.soundKeyDownBound);
    }

    destroy() {
        // Stop any playing sounds
        if (this.map.ambienceSound) this.map.ambienceSound.pause();
        if (this.map.musicSound) this.map.musicSound.pause();

        // Remove event listeners
        if (this.phoneElement) this.phoneElement.removeEventListener('click', this.togglePhone);

        if (this.echapElement) this.echapElement.removeEventListener('click', this.menuStateBound);
        document.removeEventListener('keydown', this.menuKeyDownBound);

        if (this.soundElement) this.soundElement.removeEventListener('click', this.soundStateBound);
        document.removeEventListener('keydown', this.soundKeyDownBound);

        // Nullify references
        this.experience = null;
        this.camera = null;
        this.map = null;
        this.echapElement = null;
        this.menuElement = null;
        this.canvasElement = null;
        this.soundElement = null;
        this.profileElement = null;
        this.phoneElement = null;
    }
}
