window.addEventListener('load', function () {
    const form = document.querySelector('form');
    const inputFile = document.querySelector('#fileUp')
    const parrafoError = document.querySelector('p.image');
    const imageTitle = document.querySelector('p.imagentitle')
    const contraseña = document.querySelector('#password')
    const ConfirmContraseña = document.querySelector('#coPass')
    const passwords = document.querySelector('p.error');
    console.log(form)
    let checkImage = true
    inputFile.addEventListener('change', function (e) {
        parrafoError.style.display = 'none'
        passwords.style.display = 'none'
        imageTitle.innerHTML = ''
        console.log('tipo', e) // tipo de archivo
        if (e.target.files[0].type == 'image/png' || e.target.files[0].type == 'image/jpg' || e.target.files[0].type == 'image/jpeg') {
            //console.log('la imagen esta ok', e.target.files[0].name);
            checkImage = true
            imageTitle.innerHTML = 'Subiste el archivo : ' + e.target.files[0].name
        } else {
            console.log('la imagen esta no ok');
            checkImage = false
            parrafoError.style.display = 'block'
        }
    })
    form.addEventListener('submit', function (e) {
        console.log(checkImage)
        if (checkImage == true) {

        }
        else {
            e.preventDefault()
        }
        if (contraseña.value === ConfirmContraseña.value) {

        } else {
            e.preventDefault()
            passwords.style.display = 'block'
        }
    })


})