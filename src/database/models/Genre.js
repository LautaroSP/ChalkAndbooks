var db = require('./index');
var Book = require('./Book')

module.exports = function (sequelize, dataTypes) {
    let alias = "genres";
    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:{
            type: dataTypes.STRING,
        } ,
    };
    let config = {
        tableName: "genres",
        timestamps: false
    }


    const Genre = sequelize.define(alias, cols, config);
    Genre.associate = function(model){
        Genre.hasMany(model.books, {
            as: "books_genre",
            foreignKey: "autors_id"
        })
    }

    return Genre
}