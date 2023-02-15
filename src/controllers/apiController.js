const fs = require('fs');
const path = require('path');
const db = require("../database/models")
const Op = db.Sequelize.Op

let apiController = {

    listBooks: function (req, res) {
        db.books.findAll({include: [{ association: "genres_book" }, { association: "autors_book" }]})      //localhost:3030/api/books
            .then(function (books) {
                for(let i = 0 ; i < books.length ; i++) {
                    books[i].dataValues.detail = 'localhost:3030/products/detalleProducto/' + books[i].id
                    books[i].dataValues.urlImage = 'http://localhost:3030/images/portadas/' + books[i].dataValues.portada      
                }
                console.log(books)
                res.json(200, {
                    total: books.length,
                    data: books,
                    status: 200
                })
            })
    },
    listGenres: function (req, res) {   //localhost:3030/api/listGenres
        db.genres.findAll({include: [{ association: "books_genre" }]})
            .then(function (genres) {
                var data = []
                var countBooksByGenre = []
                for(let i = 0 ; i < genres.length ; i++) {
                    for(let j = 0; j < genres[i].books_genre.length ; j++) {
                        data[i] = {
                            id: genres[i].id,
                            name: genres[i].name
                        }
                        countBooksByGenre[i] = {
                            Genero: genres[i].name,
                            Cantidad: genres[i].books_genre.length
                        }
                }}
                res.json(200, {
                    total: genres.length,
                    data: data,
                    count: countBooksByGenre ,
                    status: 200
                })
            })
    },
    listAutores: function (req, res) { //localhost:3030/api/autors
        db.autors.findAll({include: [{ association: "books_autor" }]})
            .then(function (autors) {
                var countBooksByAutor = []
                var data = []
                var booksByAutor = []
                var index = null;
                for(let i = 0; i < autors.length; i++){
                    data[i] = {
                        id: autors[i].id,
                        name: autors[i].name
                    }
                    countBooksByAutor[i] = {
                        Autor: autors[i].name,
                        Cantidad: autors[i].books_autor
                    }
                }
                for(let i = 0; i < countBooksByAutor.length; i++) {
                    for(let j = 0; j < countBooksByAutor[i].Cantidad.length; j++){
                        // console.log(countBooksByAutor[i].Autor, countBooksByAutor[i].Cantidad.length ,countBooksByAutor[i].Cantidad[j].title)
                        
                        booksByAutor[i] = {
                            Autor: countBooksByAutor[i].Autor,
                            Libros: countBooksByAutor[i].Cantidad.map((book)=> book.title)
                        }
                    }
                }
                for(let i = 0; i < booksByAutor.length; i++) {
                    if(i != 0){
                    if(booksByAutor[i].Libros.length > booksByAutor[i-1].Libros.length){
                        index = i;
                    }} else {
                        index = 0;
                    }
                }
                res.json(200, {
                    total: autors.length,
                    data: data,
                    count: countBooksByAutor,
                    booksByAutor: booksByAutor,
                    autorsWithMoreBooks: booksByAutor[index],
                    status: 200
                })
            })
    },
    detailBook: function (req, res) { //localhost:3030/api/books/detail/id
        db.books.findByPk(req.params.id, {include: [{ association: "genres_book" }, { association: "autors_book" }]})
            .then(function (book) {
                
                if (book != null) {
                    book.dataValues.urlImage = 'http://localhost:3030/images/portadas/' + book.dataValues.portada;
                    // book.dataValues.genero =  book.genres_book.name
                    // book.dataValues.autor = book.autors_book.name
                    console.log(book)
                    res.json(200, {
                        libro: book,
                        status: 200
                    })
                } else {
                    res.json(400, 'No existe el libro')
                }
            })
    },
    searchBook: function (req, res) {   //localhost:3030/api/books/search?title=
        db.books.findAll({
            where: { 
                title : {[Op.like]: '%' + req.query.title + '%'}
            }
        }, 
        {
            include: [{ association: "genres_book" }, { association: "autors_book" }]
        })
            .then(function (book) {
                if(book.length > 0) {
                for(let i = 0 ; i < book.length ; i++) {
                    book[i].dataValues.detail = 'localhost:3030/products/detalleProducto/' + book[i].id
                    book[i].dataValues.urlImage = 'http://localhost:3030/images/portadas/' + book[i].dataValues.portada
                }
                res.json(200, {
                    total: book.length,
                    book: book
                })}
                else {
                    res.json(200, {
                        book: [{title: 'No se encontraron libros'}]
                    })
                }
            })
    },
    last5Books: function (req, res) { //localhost:3030/api/books/lastFive
        db.books.findAll({limit: 5,
            where: {},
        order: [ [ 'id', 'DESC' ]] },
        {include: [{ association: "genres_book" }, { association: "autors_book" }]})
            .then(function (books) {
                for(let i = 0 ; i < books.length ; i++) {
                    books[i].dataValues.urlImage = 'http://localhost:3030/images/portadas/' + books[i].dataValues.portada
                }
                res.json(200, {
                    books : books
                    })
            })
    },
/* ---------------ENDPOINTS USERS-------------------- */
    listUsers: function(req,res){ //localhost:3030/api/users
        db.user.findAll()
            .then(function(users){
                for(let i=0; i < users.length ; i++){
                    delete users[i].dataValues.password
                    delete users[i].dataValues.rol_id
                    users[i].dataValues.urlAvatar = 'http://localhost:3030/images/avatar/' + users[i].dataValues.avatar
                }
                console.log(users)
                res.json(200, {
                    total: users.length,
                    data: users
                })
            })
    },
    lastUser: function(req,res){ //localhost:3030/api/users/lastUser
        db.user.findAll({
            limit: 1,
            where: {},
            order: [['id', 'DESC']]
        })
        .then(function(user){
            user[0].dataValues.urlAvatar = 'http://localhost:3030/images/avatar/' + user[0].dataValues.avatar
            delete user[0].dataValues.password
            delete user[0].dataValues.rol_id
            console.log(user)
            res.status(200).json({
                data: user
            })
        })
    },
    countAll: function(req,res){//localhost:3030/api/countAll
        let promiseBooks = db.books.findAll()
        let promiseGenres = db.genres.findAll()
        let promiseAutors = db.autors.findAll()
        Promise.all([promiseGenres, promiseAutors, promiseBooks])
            .then(function([genres,autors,books]){
                res.status(200).json({
                    countGenres: genres.length,
                    countAutors: autors.length,
                    countBooks: books.length
                })
            })
    }      
}

module.exports = apiController