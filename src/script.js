import Experience from './Experience/Experience.js'
const experience = new Experience(document.querySelector('canvas.webgl'))

// Phone
const uiPhoneElement = document.querySelector('.uiPhone')

uiPhoneElement.addEventListener('click', () => {
    uiPhoneElement.classList.toggle('active')
})

// Menu
const echapElement = document.querySelector('.echap')

echapElement.addEventListener('click', () => {
    echapElement.classList.toggle('active')
})