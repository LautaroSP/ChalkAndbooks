const fs = require('fs');
const path = require('path');
const db = require("../database/models")
const { validationResult } = require('express-validator');
let productController = {

    index: function (req, res) {
        db.books.findAll()
            .then(function (books) {
                res.render('products/products', { books: books })
            })


        // let newListproduct = fs.readFileSync(path.join(__dirname, '../data/product.json'), { encoding: 'utf-8' }); //Listado viejo
        // let listProducts = JSON.parse(newListproduct)
        // res.render('products/products', { listProducts: listProducts });
    },


    carrito: function (req, res) {
        res.render('products/carrito')
    },

    crearProducto: function (req, res) {
        let promiseGenres = db.genres.findAll()
        let promiseAutors = db.autors.findAll()
        Promise.all([promiseGenres, promiseAutors])
            .then(function ([generos, autors]) {
                res.render('products/crear-producto', { generos: generos, autors: autors });
            })
    },
    guardarProducto: function (req, res) {
        const resultValidation = validationResult(req)
        console.log(resultValidation.errors.length, resultValidation.mapped())
        if (resultValidation.errors.length > 0) {
            console.log('entre? ')
            let promiseGenres = db.genres.findAll()
            let promiseAutors = db.autors.findAll()
            Promise.all([promiseGenres, promiseAutors])
                .then(function ([generos, autors]) {
                    res.render('products/crear-producto', {
                        generos: generos,
                        autors: autors,
                        errors: resultValidation.mapped(),
                        data: req.body
                    });
                })
        } else {
            db.books.create({
                title: req.body.nombreProducto,
                autors_id: req.body.autors,
                description: req.body.descProducto,
                price: req.body.price,
                stock: req.body.stock,
                genres_id: req.body.genero,
                editorial: req.body.editorial,
                published: req.body.published,
                portada: req.file.filename,
            })
                .then(function (response) {
                    res.redirect('/products')
                })
        }

        // console.log(req.body)            proceso viejo de guardado
        // if(req.file){
        //     console.log(req.file)
        //     let newProduct = {
        //         titulo: req.body.nombreProducto,
        //         autor: req.body.nombreAutor,
        //         genero: req.body.genero,
        //         descripcion: req.body.descProducto,
        //         precio: req.body.price,
        //         stock: req.body.stock,
        //         portada: req.file.filename,
        //     }
        //     let newListproduct = fs.readFileSync(path.join(__dirname, '../data/product.json'), {encoding: 'utf-8'});
        //     let listProducts = JSON.parse(newListproduct)
        //     let newID = listProducts[listProducts.length - 1].id + 1;
        //     newProduct.id = newID;
        //     listProducts.push(newProduct);

        //     let productsJSON = JSON.stringify(listProducts);

        //     fs.writeFileSync(path.join(__dirname, '../data/product.json'), productsJSON);

        //     res.render('products/products', {listProducts: listProducts})
        // }
        // else{
        //     res.render('products/crear-producto')
        //}

    },

    formEditarProducto: function (req, res) {
        let promiseBooks = db.books.findByPk(req.params.id)
        let promiseGenres = db.genres.findAll()
        let promiseAutors = db.autors.findAll()
        Promise.all([promiseAutors, promiseGenres, promiseBooks])
            .then(function ([autors, genres, books]) {
                res.render('products/editar-producto', { autors: autors, books: books, genres: genres })
            })


        // let idProduct = req.params.id - 1;
        // let newListproduct = fs.readFileSync(path.join(__dirname, '../data/product.json'), { encoding: 'utf-8' });
        // let listProducts = JSON.parse(newListproduct)
        // let product = listProducts[idProduct]
        // res.render('products/editar-producto', { product: product })
    },

    editarProducto: function (req, res) {
        const resultValidation = validationResult(req)
        console.log(resultValidation.errors.length, resultValidation.mapped())
        if (resultValidation.errors.length > 0) {
            let promiseBooks = db.books.findByPk(req.params.id)
            let promiseGenres = db.genres.findAll()
            let promiseAutors = db.autors.findAll()
            Promise.all([promiseAutors, promiseGenres, promiseBooks])
                .then(function ([autors, genres, books]) {
                    res.render('products/editar-producto', {
                        autors: autors,
                        books: books,
                        genres: genres,
                        errors: resultValidation.mapped(),
                        data: req.body
                    });
                })
        } else {
            db.books.findByPk(req.params.id)
                .then(function (libro) {
                    if (req.file) {
                        db.books.update({
                            title: req.body.nombreProducto,
                            autors_id: req.body.autors,
                            description: req.body.descProducto,
                            price: req.body.price,
                            stock: req.body.stock,
                            genres_id: req.body.genero,
                            editorial: req.body.editorial,
                            published: req.body.published,
                            portada: req.file.filename

                        }, {
                            where: {
                                id: req.params.id
                            }
                        })
                        res.redirect("/products")
                    } else {
                        db.books.update({
                            title: req.body.nombreProducto,
                            autors_id: req.body.autors,
                            description: req.body.descProducto,
                            price: req.body.price,
                            stock: req.body.stock,
                            genres_id: req.body.genero,
                            editorial: req.body.editorial,
                            published: req.body.published,
                            //portada: libro.portada

                        }, {
                            where: {
                                id: req.params.id
                            }
                        })

                    }
                    res.redirect("/products")
                })}


            // let idProduct = req.params.id - 1;  //CRUD VIEJO EDICION
            // let newListproduct = fs.readFileSync(path.join(__dirname, '../data/product.json'), { encoding: 'utf-8' });
            // let listProducts = JSON.parse(newListproduct)
            // let oldProduct = listProducts[idProduct]
            // if (req.file) {                              //si no se sube un archivo de imagen vuelvo a la edicion
            //     let newProduct = {
            //         titulo: req.body.nombreProducto,
            //         autor: req.body.nombreAutor,
            //         genero: req.body.genero,
            //         descripcion: req.body.descProducto,
            //         precio: req.body.price,
            //         stock: req.body.stock,
            //         portada: req.file.filename,
            //     }
            //     // logica de edicion
            //     let reemplazar = function (objA, objB) {
            //         if (objA == undefined) {
            //             objA = objB
            //         }
            //     }
            //     reemplazar(newProduct.titulo, oldProduct.titulo)
            //     reemplazar(newProduct.autor, oldProduct.autor)
            //     reemplazar(newProduct.genero, oldProduct.genero)
            //     reemplazar(newProduct.descripcion, oldProduct.descripcion)
            //     reemplazar(newProduct.precio, oldProduct.precio)
            //     reemplazar(newProduct.stock, oldProduct.stock)
            //     reemplazar(newProduct.portada, oldProduct.portada)
            //     newProduct.id = oldProduct.id
            //     listProducts[idProduct] = newProduct
            //     let productsJSON = JSON.stringify(listProducts);

            //     fs.writeFileSync(path.join(__dirname, '../data/product.json'), productsJSON);


            //     res.render('/products', { listProducts: listProducts })
            // }
            // else {
            //     let idProduct = req.params.id - 1;
            //     let newListproduct = fs.readFileSync(path.join(__dirname, '../data/product.json'), { encoding: 'utf-8' });
            //     let listProducts = JSON.parse(newListproduct)
            //     let product = listProducts[idProduct]
            //     res.render('products/editar-producto', { product: product })
            // }

        },

        borrarProducto: function (req, res) {
            db.books.destroy({
                where: {
                    id: req.params.id
                }
            }).then(function (response) {
                res.redirect('/products')
            })


        },

        detalleProducto: function (req, res) {
            db.books.findByPk(req.params.id, {
                include: [{ association: "genres_book" }, { association: "autors_book" }]
            })
                .then(function (product) {
                    res.render('products/detalle-producto', { product: product })
                })

            // let idProduct = req.params.id - 1;   //Viejo detalle
            // let newListproduct = fs.readFileSync(path.join(__dirname, '../data/product.json'), { encoding: 'utf-8' });
            // let listProducts = JSON.parse(newListproduct)
            // let product = listProducts[idProduct]   
        }
    }

module.exports = productController;