const path = require('path')
const fs = require('fs');
const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require("../database/models")



let userController = {
    compareID: function (id1, id2) {
        if (id1 != id2) {
            return res.send('NOT EQUALS ID')
        }
        return true;
    },

    login: function (req, res) {
        res.render('users/login')
    },

    loginProcess: function (req, res) {
        db.user.findOne({
            where: {
                email: req.body.email
            }
        })
            .then(function (user) {
                if (user) {
                    var userToLogin = user.dataValues
                }
                else {
                    return res.render('users/login', {
                        errors: {
                            email: {
                                msg: 'Email o contraseña incorrecta'
                            }
                        }
                    })
                }

                if (userToLogin) {
                    let passwordCompare = bcryptjs.compareSync(req.body.password, userToLogin.password);
                    console.log(passwordCompare)
                    if (passwordCompare) {
                        delete userToLogin.password
                        req.session.userLogged = userToLogin
                        if (req.body.remember) {
                            res.cookie('idUser', req.session.userLogged.id, { maxAge: ((1000 * 60) * 30) })
                        }

                        res.redirect('/')
                    } else {
                        return res.render('users/login', {
                            errors: {
                                email: {
                                    msg: 'Email o contraseña incorrecta'
                                }
                            }
                        })
                    }
                }
            })
    },


    register: function (req, res) {
        res.render('users/registro')
    },

    guardarUsuario: function (req, res) {
        const resultValidation = validationResult(req)
        if (resultValidation.errors.length > 0) {
            return res.render('users/registro', {
                errors: resultValidation.mapped(),
                data: req.body
            })
        }
        db.user.findOne({
            where: {
                email: req.body.email
            }
        })
            .then(function (userInDB) {
                if (userInDB) {
                    if (req.body.email == userInDB.email) {
                        return res.render('users/registro', {
                            errors: {
                                email: {
                                    msg: 'Este email ya está registrado'
                                }
                            },
                            data: req.body
                        })
                    }
                }


                // User.create(req)
                // console.log(req.file)
                if (req.file) {
                    db.user.create({
                        nombre: req.body.nombre,
                        apellido: req.body.apellido,
                        email: req.body.email,
                        password: bcryptjs.hashSync(req.body.password, 10),
                        rol_id: 2,
                        avatar: req.file.filename
                    })
                } else {
                    db.user.create({
                        nombre: req.body.nombre,
                        apellido: req.body.apellido,
                        email: req.body.email,
                        password: bcryptjs.hashSync(req.body.password, 10),
                        rol_id: 2,
                        avatar: "default.png"
                    })
                }
                res.redirect('/user/login');
            })
        /*let newUser = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            email: req.body.email,
            password: req.password,
            rol: "viewer"
        }
        if(req.file){
            console.log(req.file)
            newUser.avatar = req.filename
        }
        else {
            newUser.avatar = "default.png"
            
            }
            let newListUsers = fs.readFileSync(path.join(__dirname, '../data/users.json'), {encoding: 'utf-8'});
            let listUsers = JSON.parse(newListUsers)
            let newID = listUsers[listUsers.length - 1].id + 1;
            newUser.id = newID;
            listUsers.push(newUser)
            let userJson = JSON.stringify(listUsers)
            fs.writeFileSync(path.join(__dirname, '../data/users.json'), userJson);
            res.redirect('/');*/


    },

    profile: function (req, res) {
        /*let id = req.params.id -1;         //PROCESO DE VISTA ANTIGUO SIN SESSION

        let newListUsers = fs.readFileSync(path.join(__dirname, '../data/users.json'), {encoding: 'utf-8'});
        let listUsers = JSON.parse(newListUsers)
        let user = listUsers[id]*/

        db.user.findByPk(req.session.userLogged.id)
            .then(function (users) {
                res.render('users/profile', { user: users })
            })


    },

    editProfile: function (req, res) {
        db.user.findByPk(req.session.userLogged.id)
            .then(function (response) {
                res.render('users/editProfile', { user: response })
            })
    },
    guardarEditProfile: function (req, res) {

        // let id = req.session.userLogged.id
        // let newListUsers = fs.readFileSync(path.join(__dirname, '../data/users.json'), {encoding: 'utf-8'});
        // let listUsers = JSON.parse(newListUsers)
        // let user = listUsers[id]
        // user.nombre = req.body.nombre;
        // user.apellido = req.body.apellido;
        // user.email = req.body.email;
        // if(req.file)                                //Comprobamos si se subio una imagen, sino dejamos por defecto
        // {
        //     user.avatar = req.file.filename
        // }
        // else{
        //     user.avatar = req.session.userLogged.avatar
        // }
        // listUsers[id] = user;
        // let userJSON = JSON.stringify(listUsers)
        // fs.writeFileSync(path.join(__dirname, '../data/users.json') , JSON.stringify(listUsers, null, ' '));
        // res.redirect("/")

        const resultValidation = validationResult(req)
        if (resultValidation.errors.length > 0) {
            db.user.findByPk(req.session.userLogged.id)
            .then(function (response) {
                res.render('users/editProfile', { 
                    user: response,
                    errors: resultValidation.mapped(),
                    data: req.body })
            })
        } else {
        if (req.file) {
            db.user.update({
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                email: req.body.email,
                avatar: req.file.filename
            }, {
                where: {
                    id: req.session.userLogged.id
                }
            })
                .then(function (response) {
                    res.redirect("/user/profile")
                })
        } else {
            db.user.update({
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                email: req.body.email,
                avatar: req.session.userLogged.avatar
            }, {
                where: {
                    id: req.session.userLogged.id
                }
            })
                .then(function (response) {
                    res.redirect("/user/profile")
                })
        }
    }
    },

    editContra: function (req, res) {
        let id = req.session.userLogged.id;
        res.render('users/editContra', { id: id })

    },

    guardarEditContra: function (req, res) {
        db.user.update({
            password: bcryptjs.hashSync(req.body.password, 10)
        }, {
            where: { id: req.session.userLogged.id }
        })
        res.redirect('/user/profile')
    },

    listUsers: function (req, res) {
        db.user.findAll({
            include: [{ association: "rol_user" }]
        })
            .then(function (users) {
                res.render('users/listUser', { users: users })
            })

    },

    logout: function (req, res) {
        res.clearCookie('emailUsuario')
        req.session.destroy()
        return res.redirect("/")
    },
    editUser: function (req, res) {
        let editUser = ""
        
        db.user.findByPk(req.params.id)
            .then(function (user) {
                editUser = user
                res.render('users/editAdminUser', { user: user })
            }) //SE EJECUTA DOS VECES LA QUERY LA SEGUNDA OCN UN PARAMETRO CUALQUIERA

    },
    editUserSave: function (req, res) {
        const resultValidation = validationResult(req)
        if (resultValidation.errors.length > 0) {
            let editUser = ""
            db.user.findByPk(req.params.id)
                .then(function (user) {
                    editUser = user
                    res.render('users/editAdminUser', { 
                        user: user,
                        errors: resultValidation.mapped(),
                        data: req.body })
            })
        } else {
        if (req.file) {
            db.user.update({
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                email: req.body.email,
                rol_id: req.body.rol_id,
                avatar: req.file.filename
            }, {
                where: {
                    id: req.params.id
                }
            })
                .then(function (response) {
                    res.redirect("/user/listUsers")
                })
        } else {
            db.user.update({
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                email: req.body.email,
                rol_id: req.body.rol_id,
            }, {
                where: {
                    id: req.params.id
                }
            })
                .then(function (response) {
                    res.redirect("/user/listUsers")
                })
        }
    }
    },
    confirmDelete: function (req, res) {
        db.user.findByPk(req.params.id)
            .then(function (user) {
                editUser = user
                res.render('users/confirmDelete', { user: user })
            })

    },
    deleteUser: function (req, res) {

        db.user.destroy({
            where: {
                id: req.params.id
            }
        }).then(function (response) {
            if (req.session.userLogged.id == req.params.id) {
                res.clearCookie('emailUsuario')
                req.session.destroy()
                return res.redirect("/")
            }
            else {
                res.redirect('/user/listUsers')
            }
        })
    },
    editContraAdmin: function (req, res) {
        db.user.findByPk(req.params.id)
            .then(function(user){
                res.render('users/editContraAdmin', {user:user})
            })
    },
    confirmEditContraAdmin: function(req, res){
        db.user.update({
            password: bcryptjs.hashSync(req.body.password, 10)
        } , {
        where: { 
            id: req.params.id
        }})
            .then(function(){
                res.redirect('/user/listUsers')
            })
    }                                      

}
module.exports = userController;