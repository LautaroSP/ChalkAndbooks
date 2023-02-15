window.addEventListener('load', function () {
    const form = document.querySelector('form');
    const contraseña = document.querySelector('#password')
    const ConfirmContraseña = document.querySelector('#coPass')
    const parrafoError = document.querySelector('p.error');
    const parrafoLenght = document.querySelector('p.lenght');
    form.addEventListener('submit', function (e) {
        parrafoError.style.display = 'none'
        parrafoLenght.style.display = 'none'
        if (contraseña.value === ConfirmContraseña.value && contraseña.value != '') {
            

        } else {
            e.preventDefault()
            console.log(contraseña.value.lenght)
            parrafoError.style.display = 'block'
            parrafoLenght.style.display = 'block'
        }
    })

})
