window.addEventListener('load', function () {
    const form = document.querySelector('form');
    const inputFile = document.querySelector('#portada')
    const parrafoError = document.querySelector('p.image');
    let checkImage = true
    inputFile.addEventListener('change', function (e) {
        parrafoError.style.display = 'none'
        console.log('tipo', e) // tipo de archivo
        if (e.target.files[0].type == 'image/png' || e.target.files[0].type == 'image/jpg' || e.target.files[0].type == 'image/jpeg') {
            console.log('la imagen esta ok', e.target.files[0].name);
            checkImage = true
        } else {
            checkImage = false
            console.log('la imagen esta no ok' , checkImage);
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
    })



})