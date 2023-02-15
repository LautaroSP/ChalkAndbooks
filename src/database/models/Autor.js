module.exports = function (sequelize, dataTypes) {
    let alias = "autors";
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
        tableName: "autors",
        timestamps: false
    }


    const Autor = sequelize.define(alias, cols, config);
    Autor.associate = function(model){
        console.log(model)
        Autor.hasMany(model.books, {
            as: "books_autor",
            foreignKey: "autors_id"
        })
    }

   

    return Autor
      
}