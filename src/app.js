const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
var tipo = "Aspirante";
require('./helpers/helpers');

const directorioPublico = path.join(__dirname,'../public');
const directorioPartials = path.join(__dirname,'../partials');
const dirNode_modules = path.join(__dirname , '../node_modules')

app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

app.use(express.static(directorioPublico));
hbs.registerPartials(directorioPartials);
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine','hbs');

app.get('/',(req,res)=>{
    res.render('index', {
        titulo: 'Aspirante'
    });
});


app.post('/calculos', (req,res)=>{
    res.render('calculos',{
        estudiante: req.body.nombre,
        nota1: parseFloat(req.body.nota1),
        nota2: parseFloat(req.body.nota2),
        nota3: parseFloat(req.body.nota3)
    })
});

app.get('/listado', (req,res)=>{
    res.render('listado');
});

app.get('/vistaAspirante', (req,res)=>{
    res.render('vistaAspirante');
});

app.get('/cursosAspirante', (req,res)=>{
    res.render('cursosAspirante');
});

app.get('/usuarios', (req,res)=>{
    res.render('usuarios');
});

app.get('/mostrarRegistrados', (req,res)=>{
    res.render('mostrarRegistrados');
});

app.get('/usuariosexiste', (req,res)=>{
    res.render('usuariosexiste');
});


app.post('/registro', (req,res)=>{
    res.render('registro',{
        
        cedula: req.body.cedula,
        nombre: req.body.nombre,
        telefono: req.body.telefono,
        correo: req.body.correo,
        password: req.body.password,
        rol: req.body.rol
    });
});

app.post('/sesionusuario', (req,res)=>{
    res.render('sesionusuario',{
         
        correo: req.body.correo,
        password: req.body.password
        
    });
});

app.post('/eliminarCursoPreinscripto', (req,res)=>{
    res.render('eliminarCursoPreinscripto',{
         
        id: parseInt(req.body.id)
        
    });
});


app.get('*',(req,res)=>{
    res.render('error',{
        estudiante: 'error'
    });
})

app.listen(3000, ()=>{
    console.log('iniciado')
})