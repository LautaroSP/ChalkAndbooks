const fs = require('fs');
const path = require('path');
const db = require("../database/models")
let mainController = {
    index : function(req,res){
        var indexBooks = [];
        db.books.findAll()
            .then(function(books){
                indexBooks.push(books[5].dataValues, books[14].dataValues, books[15].dataValues, books[11].dataValues)
                indexBooks[0].banner = '/images/sherlockbanner.png';
                indexBooks[1].banner = '/images/BannerHP.jpg';
                indexBooks[2].banner = '/images/señordelosanillos.png';
                indexBooks[3].banner = '/images/bannerRebelion.png';
                res.render('index', {books: indexBooks, allbooks: books})
        })
       
    }

}
module.exports = mainController;