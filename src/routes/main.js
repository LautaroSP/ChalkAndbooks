const express = require('express');
const router = express.Router();

const multer = require('multer');

const path = require('path');

const invitadoMiddle = require('../middlewares/invitadoMiddle')
const authMiddle = require('../middlewares/authMiddle')
const adminMiddle = require('../middlewares/adminMiddle');

const mainController = require("../controllers/mainController")

const userController = require("../controllers/userController")

const { body }= require('express-validator')
const validations = [
    body('nombre').notEmpty().withMessage('Debes escribir un nombre'),     // CAMPOS DEL REGISTRO nombre, apellido , email , password, copassword, terms
    body('apellido').notEmpty().withMessage('Debes escribir un apellido'), //Validaciones de express-validator
    body('email').isEmail().withMessage('Tienes que ingresar un Email correcto'), 
    body('password').isLength({min: 8}).withMessage('El largo debe ser mas de 8 caracteres'),
    body('avatar').custom((value, {req}) =>{
        let file = req.file;
        if(file){
            console.log(file.mimetype)
         if((file.mimetype != 'image/png' )|| (file.mimetype != 'image/jpg') || (file.mimetype != 'image/jpeg')){
            //throw new Error('Las extensiones aceptadas son .jpg y .png');
            }
        }
        return true;    //REVISAR 

    }).withMessage('Las extensiones aceptada son .jpg y .png')
];

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, path.join(__dirname, '../../public/images/avatar'));
    },
    filename: function (req, file, cb) {
        console.log(file)
        const newFileName = 'avatar-' + req.body.nombre + '-' + Date.now() + path.extname(file.originalname);
        cb(null, newFileName);
    }
})


const upload = multer( { 
    storage,
    fileFilter: function (req, file, cb) {
        if(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"){
            cb(null, true);
        } else {
          cb(null, false);
          //return cb(new Error('Solo .png, .jpg and .jpeg ')); REVISAR 
        }
    }
 });


router.get ("/", mainController.index)
// Los /user estan aca porque crashea si lo hago en el router de usuarios
router.get ("/user/login",invitadoMiddle, userController.login)

router.post ("/user/login", userController.loginProcess)

router.get ("/user/register",invitadoMiddle, userController.register)

router.post ("/user/register", upload.single('avatar'),validations, userController.guardarUsuario)

router.get ("/user/profile/",authMiddle, userController.profile)

router.get ("/user/profile/:id/editProfile",authMiddle, userController.editProfile)

router.post("/user/profile/:id/editProfile",upload.single('avatar'), userController.guardarEditProfile) //pendiente...

router.get("/user/profile/:id/editContra",authMiddle, userController.editContra)

router.post("/user/profile/:id/editContra", userController.guardarEditContra)

router.get("/user/listUsers", authMiddle, userController.listUsers)

router.get("/user/logout", userController.logout)

router.get("/user/editUser/:id", authMiddle, userController.editUser)

router.post("/user/editUser/:id", upload.single('avatar'), authMiddle, userController.editUserSave) //no funcionan las validaciones por backend aca ? RARO

router.get("/user/confirmDelete/:id" , authMiddle, userController.confirmDelete)

router.post("/user/destroyUserAdmin/:id", authMiddle, userController.deleteUser)

router.get("/user/editContraAdmin/:id", authMiddle, userController.editContraAdmin)

router.post("/user/editContraAdmin/:id", authMiddle, userController.confirmEditContraAdmin)

module.exports = router;