'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

/*db.Libro.associate = function (models) {
      Libro.belongsTo(models.Autor, {
         as: 'autor',
        foreignKey: 'autors_id',
     });
    
      Libro.belongsTo(models.Genero, {
       as: 'genero',
         foreignKey: 'genres_id',
       });
     };

db.Autor.associate = function (models) {
      Autor.hasMany(models.Libro, {
        as: 'libros',
        foreignKey: 'autors_id',
      });
    };
db.Genero.associate = function (models) {
       Genero.hasMany(models.Libro, {
         as: 'libros',
         foreignKey: 'genres_id',
       });
     };*/

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
