const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
var tipo = "Aspirante";
require('./helpers/helpers');
const funciones = require('./funciones');

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
        esCoordinador: true
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

app.get('/cursosCoordinador', (req,res)=>{
    res.render('cursosCoordinador');
});

app.post('/cambiarEstado', (req,res)=>{
    res.render('cambiarEstado',{
        cursoId : req.body.id
    });
});

app.post('/eliminarEstudiante', (req,res)=>{
    var texto  = req.body.cedula;
    res.render('eliminarEstudiante',{
        cedula : texto.split("&")[0],
        id : texto.split("&")[1]
    });
});

app.post('/resultadoInscripcion', (req,res)=>{
    res.render('resultadoInscripcion',{
        codCurso: req.body.codCurso
    });
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

app.get('/agregarCurso', (req,res)=>{
    res.render('agregarCurso');
});

app.post('/agregarCursos', (req,res)=>{
    res.render('agregarCursos',{
        id: req.body.id,
        nombre: req.body.nombre,
        descripcion:req.body.descripcion,
        valor: req.body.valor,
        modalidad: req.body.modalidad,
        intensidad: req.body.intensidad,
        estado: req.body.estado
    });
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

app.post('/sesionusuario', (req,res)=>
{
    var vista = funciones.iniciarSesion(req.body.correo, req.body.password);
    res.render(vista);
});

app.post('/eliminarCursoPreinscripto', (req,res)=>{
    res.render('eliminarCursoPreinscripto',{
         
        id: parseInt(req.body.id)
        
    });
});

app.get('/cerrarSesion', (req,res)=>
{
    funciones.cerrarSesion();
    res.render('index', {
        esCoordinador: true
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