const express = require ('express');
const morgan = require('morgan');
const expressHbs = require('express-handlebars');
const path = require ('path');
const router = require('./routes');
const flash = require('connect-flash');
const session = require ('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require ('passport');


const { database } = require('./keys');

//Initialization express
const app = express();
require('./lib/passport');

//Public 
app.use(express.static(path.join(__dirname,'public')));

//Settings 
app.set('port', process.env.PORT||4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', expressHbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir:[path.join(app.get('views'), 'partials')],
    extname: '.hbs',
    helpers: require('./lib/handlebars')
  })
);
app.set('view engine', '.hbs');


//Middlewares
app.use (session({
    resave:false,
    saveUninitialized:false,
    secret:'nodemysqlaplication',
    store: new MySQLStore(database),
    // EL STORE ES PARA ALMACENAR EN LA BASE DE DATOS 
}));

app.use (flash());
app.use (morgan('dev'));
app.use (express.urlencoded({extended:false}));
app.use (express.json());
app.use (passport.initialize());
app.use (passport.session());

// Global variables
//Toma informacion del usuario, toma lo q el servidor quiere responder
app.use((req, res, next)=>{
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//Routes
app.use(require ('./routes/index')),
app.use(require ('./routes/authentication'));
app.use('/links',require ('./routes/links'));

//Starting server
app.listen(app.get('port'),()=>{
    console.log(`Server starting on http://localhost:${app.get('port')}`)
});



module.exports = router;