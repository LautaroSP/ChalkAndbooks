// CRUD USUARIOS 
const fs = require('fs');
const path = require('path')
const bcryptjs = require('bcryptjs');


const User = {
    fileName: path.join(__dirname, '../data/users.json'),
    getData: function(){
        return JSON.parse(fs.readFileSync(this.fileName, 'utf8'));
    },

    generateID: function(){
        let allUsers = this.findAll();
        let lastUser = allUsers.pop();
        if(lastUser){
            return lastUser.id + 1;
        }
        return 1;
    },

    findAll: function(){
        return this.getData();
    },

    findByPk: function(id){
        let allUsers = this.findAll();
        let user = allUsers.find(user => user.id === id);
        return user;
    },

    findByField: function(field, camp){
        let allUsers = this.findAll();
        let user = allUsers.find(user => user[field] === camp);
        return user;
    },

    create: function (req){
        let allUsers = this.findAll();
        let newUser = {
            id: this.generateID(),
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            email: req.body.email,
            password: bcryptjs.hashSync(req.body.password, 10),
            rol_id: 1
        }
        if(req.file){
            newUser.avatar = req.file.filename
        }
        else {
            newUser.avatar = "default.png"
            
            }
        allUsers.push(newUser);
        fs.writeFileSync(this.fileName, JSON.stringify(allUsers, null, ' '));
        return newUser;
    },

    delete: function(id){
        let allUsers = this.findAll();
        let finalUsers = allUsers.filter(oneUser => oneUser.id !== id);
        fs.writeFileSync(this.fileName, JSON.stringify(finalUsers, null, ' '));
    }


}
module.exports = User