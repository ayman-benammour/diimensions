import Experience1 from './Experience/Experience.js'
import Experience2 from './Experience2/Experience.js'

// Sélectionner le canvas pour rendre les scènes
const canvas = document.querySelector('canvas.webgl')

// Variable pour alterner entre les expériences
let sceneDisplay = 1
let experience

// Callback pour gérer le changement de scène
function handleSceneChange(newI) {
    sceneDisplay = newI
    initExperience()
}

// Fonction pour initialiser l'expérience en fonction de la valeur de i
function initExperience() {
    if (experience) {
        experience.destroy()
    }

    if (sceneDisplay === 1) {
        experience = new Experience1(canvas, handleSceneChange)
    } else if (sceneDisplay === 2) {
        experience = new Experience2(canvas, handleSceneChange)
    }

    experience.update()
}

// Initialiser la première expérience
initExperience()
