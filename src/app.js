const express = require('express');
const mainRoutes = require("./routes/main")
const productsRoutes = require("./routes/products")
const userRoutes = require("./routes/user")
const apiRoutes = require("./routes/api")
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const loggedViewMiddle = require('./middlewares/loggedViewMIddle')
const cookies = require('cookie-parser');
const db = require('./database/models');
const adminMiddle = require('./middlewares/adminMiddle');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'))
app.use(session({
    secret: 'idk',
    resave: false,
    saveUninitialized: false
}))
app.use(cookies());
app.use(loggedViewMiddle);  //Va despues del session, es para visualizar cosas logeado o otras sin loggear.
app.use(adminMiddle);
const cors = require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

const publicPath = path.join(__dirname, '../public');

app.use( express.static (publicPath) );
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use('/', mainRoutes);

app.use('/products', productsRoutes);

app.use('/api', apiRoutes)
 // app.use('/users', require("./routes/user")); Crashea y no entiendo porque, asique lo dejo en el / y lo manejo desde mainRoutes

 app.listen(3030, ()=>{
    console.log('Servidor corriendo en puerto 3030!');
})

