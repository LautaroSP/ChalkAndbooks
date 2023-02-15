module.exports = function (sequelize, dataTypes) {
    const Autor = require ('./Autor')
    const Genre = require ('./Genre')
    let alias = "books";
    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title:{
            type: dataTypes.STRING,
        } ,
        autors_id:{
            type: dataTypes.INTEGER,
        },
        description:{
            type: dataTypes.STRING,
        },
        price:{
            type: dataTypes.INTEGER,
        },
        stock:{
            type: dataTypes.INTEGER,
        },
        genres_id:{
            type: dataTypes.INTEGER,
        },
        editorial:{
            type: dataTypes.STRING,
        },
        published:{
            type: dataTypes.INTEGER,
        },
        portada:{
            type: dataTypes.STRING,
        }

    };
    let config = {
        tableName: "books",
        timestamps: false
    }


    const Book = sequelize.define(alias, cols, config);
    Book.associate = function(model){
        Book.belongsTo(model.genres, {
            as: "genres_book",
            foreignKey: "genres_id"
        })
        Book.belongsTo(model.autors,{
            as: "autors_book",
            foreignKey: "autors_id"
        })
    }
        
    return Book
}