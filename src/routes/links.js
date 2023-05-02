const express = require('express');
const router = express.Router();

// Para guardar las tareas en la base de datos(Conexion de la base de datos)
const pool = require('../database');
const {isLoggedIn} = require('../lib/auth'); 

router.get('/add',isLoggedIn, (req,res)=>{
    res.render('links/add');
});

router.post('/add', isLoggedIn,async (req,res)=>{
    const {title, url,description} = req.body;
    const newlink = {
        title,
        url,
        description,
        user_id: req.user.id
    };
    await pool.query ( 'INSERT INTO links set ?', [newlink]);
    req.flash ('success', 'Link guardado');
    res.redirect('/links');
});

router.get ('/', isLoggedIn,async (req,res)=>{
   const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
   console.log(links);
   res.render('links/list',{links});
});

router.get ('/delete/:id',isLoggedIn, async (req, res)=>{
    const {id} = req.params;
    await pool.query('DELETE FROM links WHERE id = ?', [id]);
    req.flash('success', 'Enlace removido satisfactoriamente'); 
    res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn,async (req,res)=>{
    const{id}= req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    res.render('links/edit', {link:links[0]});
    // en el original ponen res.render('links/edit', {link:links[0]});
})

router.post('/edit/:id',isLoggedIn, async(req, res)=>{
    const {id} = req.params;
    const {title, url, description} = req.body;
    const newlink = {
        title,
        url,
        description,
       
    };
   await pool.query('UPDATE links set ? WHERE id = ?',[ newlink,id]);
   req.flash('success', 'Actualizado');
   res.redirect('/links');
//    EL FLASH ALERT NO ME ESTA FUNCIONANDO 
});


module.exports = router;