const express = require("express")

const router = express.Router()

const multer = require('multer');

const path = require('path');

const { body }= require('express-validator');



const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, path.join(__dirname, '../../public/images/portadas'));
    },
    filename: function (req, file, cb) {
        console.log(file)
        const newFileName = 'portada-' + req.body.nombreProducto + '-' + Date.now() + path.extname(file.originalname);
        cb(null, newFileName);
    }
})

const adminMiddle = require('../middlewares/adminMiddle')

const upload = multer( { storage });
const validationsProd = [
    body('nombreProducto').notEmpty().withMessage('Tienes que escribir un titulo'),
    body('editorial').notEmpty().withMessage('Tienes que escribir una editorial'),
    body('published').notEmpty().withMessage('Tienes que poner una fecha de publicacion'),
    body('descProducto').isLength({min: 10}).withMessage('La descripcion debe ser minimo 10 caracteres'),
    body('price').notEmpty().withMessage('Tienes que colocar un precio'),
    body('stock').notEmpty().withMessage('Tienes que indicar el stock'),
    body('portada').custom((value, {req}) => {
        let file = req.file;
        let acceptedExt = ['.jpg', '.png', '.jpeg']
        if(!file){
            throw new Error('Tienes que subir una portada')
        }
        return true;
    })
]
const validationsEditProd = [
    body('nombreProducto').notEmpty().withMessage('Tienes que escribir un titulo'),
    body('editorial').notEmpty().withMessage('Tienes que escribir una editorial'),
    body('published').notEmpty().withMessage('Tienes que poner una fecha de publicacion'),
    body('descProducto').isLength({min: 10}).withMessage('La descripcion debe ser minimo 10 caracteres'),
    body('price').notEmpty().withMessage('Tienes que colocar un precio'),
    body('stock').notEmpty().withMessage('Tienes que indicar el stock')
]


const productController = require("../controllers/productController")
router.get('/', productController.index)
router.get ("/carrito", productController.carrito)

router.get ("/detalleProducto/:id", productController.detalleProducto)

router.get ("/crearProducto", productController.crearProducto)
router.post ("/crearProducto", upload.single('portada'), validationsProd, productController.guardarProducto)

router.get ("/detalleProducto/:id/edit", productController.formEditarProducto)
router.put ("/detalleProducto/:id/edit", upload.single('portada'), validationsEditProd, productController.editarProducto)
router.delete ("/detalleProducto/:id/edit", productController.borrarProducto)

module.exports = router