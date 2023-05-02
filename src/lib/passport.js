const passport = require('passport');
const LocalStrategy= require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

// ESTA PARTE ES PARA EL LOGIN 
passport.use('local.signin', new LocalStrategy({
usernameField: 'username',
passwordField: 'password',
passReqToCallback: 'true'
},async(req,username, password, done)=>{
   const row = await pool.query('SELECT * FROM user WHERE username = ?', [username]);
   if(rows.length >0){
       const user = row[0];
       const validPassword = await helpers.matchPassword(password, user.password);
       if(validPassword){
           done(null, user, req.flash('welcome '+ user.username));
       }else{
            done(null, false, req.flash('Incorrect Password'));
       }
   }else{
        return done(null, false, req.flash('El usuario no existe'));
   }
} 
));

passport.use('local.signup', new LocalStrategy({
usernameField:'username',
passwordField: 'password', 
passReqToCallback: true

}, async (req, username, password, done )=>{
const {fullname} = req.body;
const newUser ={
    username,
    password,
    fullname
}; 
newUser.password = await helpers.encryptPassword(password);
const result = await pool.query('INSERT INTO user SET ?', [newUser]);
newUser.id = result.insertId;
return done (null,newUser);
}));

// Estoy guardando el id del usuario
passport.serializeUser((user,done )=>{
done(null,user.id);
});

passport.deserializeUser(async(id,done)=>{
const rows = await pool.query('SELECT * FROM user WHERE id = ?', [id]);
done (null,rows[0]);
});