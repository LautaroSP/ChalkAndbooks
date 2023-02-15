module.exports = function (sequelize, dataTypes) {
    let alias = "user";
    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre:{
            type: dataTypes.STRING,
        } ,
        apellido:{
            type: dataTypes.STRING,
        },
        email:{
            type: dataTypes.STRING,
        },
        password:{
            type: dataTypes.STRING,
        },
        rol_id:{
            type: dataTypes.INTEGER,
        },
        avatar:{
            type: dataTypes.STRING,
        }
    };
    let config = {
        tableName: "users",
        timestamps: false
    }


    const User = sequelize.define(alias, cols, config);
    User.associate = function(model){
        User.belongsTo(model.roles, {
            as: "rol_user",
            foreignKey: "rol_id"
        })
    }


    return User
}