const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
var tipo = "Aspirante";
require('./helpers/helpers');
const funciones = require('./funciones');
const mongoose = require('mongoose');

var db = null;
const estudiante = require('./Models/estudiante');
const Curso = require('./Models/curso');
const CursoAspirante = require('./Models/cursoAspirante');
const Usuario = require('./Models/usuario');

const bcrypt = require('bcrypt');
const session = require('express-session');

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

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use((req,res, next) => 
{
    if (req.session.usuario) {
        res.locals.sesion = true,
        res.locals.nombre = req.session.nombre,
        res.locals.usuarioCompleto = req.session.usuarioCompleto;
    }
    next();
});


app.get('/',(req,res)=>{

    esCoordinador: true   
    
    Curso.find({}).exec((err,respuesta) =>
    {
        if (err){
            return console.log(" ERROR = " + err)
        }
        
        res.render('index',
        {
            listadoCursosdb : respuesta 
        
        })
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

app.get('/vistaAspirante', (req,res)=>
{
    db.collection("cursos").find({ estado: "Disponible" }).toArray((err,respuesta) =>
    {
        if (err){
            return console.log("\nERROR EN VISTAASPIRANTE = "+err)
        }
        let cursosDis = JSON.parse(JSON.stringify(respuesta));
        res.render('vistaAspirante',
        {
            cursosDisponibles: cursosDis
        })
    });
});

app.get('/cursosCoordinador', (req,res)=>{
    res.render('cursosCoordinador');
});

app.get('/cursosDocente', (req,res)=>{
    res.render('cursosDocente');
});

app.post('/cursosCoordinador', (req,res)=>{
    funciones.cambiarEstado(req.body.id);
    res.render('cursosCoordinador');
});

app.get('/usuariosRol', (req,res)=>{
    res.render('usuariosRol');
});

app.post('/usuariosRol', (req,res)=>{
    funciones.cambiarEstadoRol(req.body.cedula);
    res.render('usuariosRol');
});

app.post('/eliminarEstudiante', (req,res)=>{
    var texto  = req.body.cedula;
    res.render('eliminarEstudiante',{
        cedula : texto.split("&")[0],
        id : texto.split("&")[1]
    });
});

app.post('/resultadoInscripcion', (req,res)=>
{   
    let codigoCurso =  req.body.codigo;

    var idCurso = new mongoose.mongo.ObjectId(codigoCurso);

    db.collection("cursos").findOne({ _id: idCurso }, (err, curso) =>
    {
        if (err){
            return console.log(err)
        }

        if (!curso)
        {
            return res.render ('resultadoInscripcion', {          
                respuestaInscripcion: funciones.mostrarCursoInexistente()
            })
        }

        //var ident = "5caeb6e2e7179a36ac344aa4";  //REEMPLAZAR POR ID REAL
        var ident = usuarioCompleto._id;
        console.log("ident = "+ident);

        /*db.collection("cursosAspirantes").find({cur_id: codigoCurso}, {usu_id: ident}).toArray( (err, dupla) =>
        {
            if (err){
                return console.log(err)
            }

            dupla = JSON.parse(JSON.stringify(dupla));
            if (dupla.length != 0)
            {
                return res.render ('resultadoInscripcion', {          
                    respuestaInscripcion: funciones.mostrarUsuarioInscrito()
                })
            }

            let duplaNueva = {
                cur_id: codigoCurso,
                usu_id: ident,
                estado: true
            };

            db.collection("cursosAspirantes").insertOne(duplaNueva, (err, resultado) => 
            {
                if (err){
                    return console.log(err)
                }
                return res.render ('resultadoInscripcion', {          
                    //respuestaInscripcion: funciones.mostrarInscripcionExitosa;
                    respuestaInscripcion: "Inscripcion Exitosa"
                })   
            });  
        });*/  
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
 
Usuario.findOne({ correo: req.body.correo }, (error, dato) => {

    if (error) {

        return console.log("error")
    }
    if (dato != null) {
       
       res.render('registro',{
         mostrar : "El correo " + dato.correo + " ya se encuentra registrado en la Base de datos"  
       }) 

    }

    if (!dato) {

    
        let usuario = new Usuario ({
            cedula: req.body.cedula,
            nombre: req.body.nombre,
            telefono: req.body.telefono,
            correo: req.body.correo,
            rol: req.body.rol,
            password: bcrypt.hashSync(req.body.password, 10)
        
        })

        usuario.save((err, resultado) => {
        
               if(err){

                  res.render('registro',{
                   mostrar : err
               })
        }

               res.render('registro',{
                
                  mostrar : "Usuario " + resultado.nombre + " registrado con exito"

               })

        });

    }


});

});



app.post('/sesionusuario', (req,res)=>
{
    var esCoordinador = false;
    var correoIngresado = req.body.correo;
    var contIngresada = req.body.password;

    console.log("correo = "+correoIngresado + "  contIngresada = "+contIngresada);

    db.collection("usuarios").findOne({ correo: correoIngresado }, (err, usuario) =>
    {
        if (err){
            return console.log(err)
        }
        if(!usuario)
        {
            return res.render('usuarioInicioInexistente');
        }
        if(!bcrypt.compareSync(contIngresada, usuario.password))
        {
            return res.render('datosInicioErroneos');
        }

        req.session.usuario = usuario._id;  
        req.session.nombre = usuario.nombre;
        req.session.usuarioCompleto =  usuario;

        var rol = usuario.rol;
        
        if(rol == "Aspirante")
        {
            db.collection("cursos").find({ estado: "Disponible" }).toArray((err,respuesta) =>
            {
                if (err){
                    return console.log("\nERROR EN VISTAASPIRANTE = "+err)
                }
                let cursosDis = JSON.parse(JSON.stringify(respuesta));
                return res.render('vistaAspirante',
                {
                    cursosDisponibles: cursosDis
                })
            });
        }
        else if(rol == "Coordinador")
        {
            var esCoordinador = true;
            return res.render('cursosCoordinador',{
                coordinado: esCoordinador,
                sesion: true
            });
        }
        else if(rol == 'Docente')
        {
            //RENDERIZAR LA VISTA DEL DOCENTE
        }
    });

    /*let est = new estudiante ({
        nombre : 334,
        matematicas : 23,
        ingles : 234,
        programacion :  234,
        password : 'sdad'
    })

    est.validate(function(err) {
        if (err)
            console.log("Error = "+err);
        else
            console.log('pass validate');
    });*/


    /*EL SIGUIENTE FRAGMETO DE CODIGO SOLO ES DE PRUEBA*/
    /*db.collection("cursos").find({}).toArray((err,respuesta) =>
    {
        if (err){
            return console.log(err)
        }
        //console.log( JSON.parse(JSON.stringify(respuesta))[0].nombre );

        let cursosDis = JSON.parse(JSON.stringify(respuesta));
        
        res.render('vistaAspirante',
        {
            cursosDisponibles: cursosDis
        })
    })*/
});

app.post('/eliminarCursoPreinscripto', (req,res)=>{
    res.render('eliminarCursoPreinscripto',{
         
        id: parseInt(req.body.id)
        
    });
});

app.get('/cerrarSesion', (req,res)=>
{
    req.session.destroy((err) => 
    {
        if (err) return console.log(err)    
    })  
    // localStorage.setItem('token', '');
    res.redirect('/');   
});


app.get('*',(req,res)=>{
    res.render('error',{
        estudiante: 'error'
    });
})


mongoose.connect('mongodb://admin:admin1@ds141641.mlab.com:41641/dbedcontinua',{useNewUrlParser: true}, (err,result)=>{
    if (err) {
        return console.log(err);
    }
    db = result;
    console.log('conectado');
})

app.listen(port, ()=>{
    console.log('iniciado')
})