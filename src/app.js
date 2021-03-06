//require('./config/config');
const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const fs = require('fs');

const port = process.env.PORT || 3000;

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var tipo = "Aspirante";
require('./helpers/helpers');
const funciones = require('./funciones');
const mongoose = require('mongoose');
const multer  = require('multer');

var db = null;
const estudiante = require('./Models/estudiante');
const Curso = require('./Models/curso');
const CursoAspirante = require('./Models/cursoAspirante');
const Usuario = require('./Models/usuario');
const CursoDocente = require('./Models/cursoDocente');

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
        res.locals.nombreUsuario = req.session.usuarioCompleto.nombre;
        res.locals.coordinador = req.session.coordinador;
        res.locals.imagen = req.session.imagen;
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

app.get('/vistaDocente',(req,res)=>{
 
     CursoDocente.find({}, function(err, cursodocente) {
        Curso.populate(cursodocente, {path: "cur_id"},
        //CursoAspirante.populate(cursodocente,{path: "cur_id"},
        function(err, cursodocente){
            if(err){
                
                return console.log("ERROR = " + err)
                
            }

            res.render('vistaDocente',
            {
               mostrarCursoDocente : cursodocente
                
            }) 
          
        });        
            //res.status(200).send(cursodocente);
              
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

        funciones.guardarCursosDisponibles(cursosDis);

        res.render('vistaAspirante',
        {
            cursosDisponibles: cursosDis
            
        })
    });
});

app.post('/vistaAspirante', (req,res) =>
{
    let nombreCurso = req.body.nombreCurso;
    nombreCurso = nombreCurso.toLowerCase();

    if(nombreCurso != "")
    {
        db.collection("cursos").find({ estado: "Disponible" }).toArray((err,respuesta) =>
        {
            if (err){
                return console.log("\nERROR EN VISTAASPIRANTE = "+err)
            }

            let cursosDis = JSON.parse(JSON.stringify(respuesta));

            funciones.guardarCursosDisponibles(cursosDis);

            fs.readFile('listadoCursosDisponibles.json', "utf8", function(err, data) 
            {
                if (err) 
                {
                    return console.log("\nERROR EN VISTAASPIRANTE = "+err)
                } 
                else 
                {
                    let cursosDis = JSON.parse(data);

                    let cursos_aux = cursosDis;

                    cursos_aux.forEach(curso => curso.nombre = curso.nombre.toLowerCase());
                    cursos_aux = cursos_aux.filter(curso => curso.nombre == nombreCurso);
                    let id = cursos_aux[0]._id;

                    cursosDis = JSON.parse(data);

                    cursosDis = cursosDis.filter(cursod => cursod._id == id);

                    res.render('vistaAspirante',
                    {
                        cursosDisponibles: cursosDis
                        
                    })
                }
            });
        });
    }
    else
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
    }
});

app.get('/cursosCoordinador', (req,res)=>{
    res.render('cursosCoordinador',{
        coordinador : res.locals.coordinador
    });
});

app.get('/cursosDocente', (req,res)=>{
    res.render('cursosDocente',{
        coordinador : req.session.coordinador,
        mostrarCursoDocente : res.locals.usuarioCompleto
    });
});

app.post('/cursosCoordinador', (req,res)=>{
    funciones.cambiarEstado(req.body.id);
    res.render('cursosCoordinador',{
        coordinador : res.locals.coordinador
    });
});

app.get('/usuariosRol', (req,res)=>{
    res.render('usuariosRol',{
        coordinador : res.locals.coordinador
    });
});

app.post('/usuariosRol', (req,res)=>{
    funciones.cambiarEstadoRol(req.body.cedula);
    res.render('usuariosRol',{
        coordinador : res.locals.coordinador
    });
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

        var ident = res.locals.usuarioCompleto._id;

        console.log("codigoCurso = "+codigoCurso + " ident = "+ident);

        db.collection("cursosAspirantes").find({cur_id: codigoCurso, usu_id: ident}).toArray( (err, dupla) =>
        {
            if (err){
                return console.log(err)
            }

            dupla = JSON.parse(JSON.stringify(dupla));

            console.log("dupla = "+JSON.stringify(dupla));

            if (dupla.length > 0)
            {
                return res.render ('resultadoInscripcion', {          
                    respuestaInscripcion: funciones.mostrarUsuarioInscrito()
                })
            }

            let horariosCurso = curso.horarios;
            horariosCurso = JSON.parse( JSON.stringify(horariosCurso) );
            horariosCurso = horariosCurso.map(horario => horario.clase);

            if(horariosCurso.length > 0)
            {
                var ident = res.locals.usuarioCompleto._id;
                var cursosAspirante = [];

                db.collection("cursosAspirantes").find({ usu_id: ident }).toArray((err,respuesta) =>
                {
                    if (err){
                        return console.log("\nERROR = "+err)
                    }

                    let duplasCursosAspirante = JSON.parse(JSON.stringify(respuesta));

                    if(duplasCursosAspirante.length != 0)
                    {
                        db.collection("cursos").find({}).toArray((err,respuesta) =>
                        {
                            if (err){
                                return console.log("\nERROR = "+err)
                            }
                            let listaCursos = JSON.parse(JSON.stringify(respuesta));

                            duplasCursosAspirante.forEach(dupla =>
                            {
                                cursosAspirante.push(listaCursos.filter(curso => curso._id == dupla.cur_id).pop());
                            });

                            for (var i = 0; i < cursosAspirante.length; i++) 
                            {
                                let horarios = cursosAspirante[i].horarios;
                                horarios = JSON.parse( JSON.stringify(horarios) );
                                horarios = horarios.map(horario => horario.clase);

                                if(horarios.length > 0)
                                {
                                    let comunes = horariosCurso.filter(x => horarios.includes(x));
                                    if(comunes.length > 0)
                                    {
                                        return res.render ('resultadoInscripcion', {          
                                            respuestaInscripcion: funciones.mostrarCruceCurso(curso, cursosAspirante[i])
                                        })
                                    }
                                }  
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
                                var usuario = res.locals.usuarioCompleto;
                                return res.render ('resultadoInscripcion', 
                                {          
                                    respuestaInscripcion: funciones.mostrarInscripcionExitosa(curso, usuario)
                                })   
                            }); 
                        });  
                    }
                    else
                    {
                        return res.render('cursosAspirante', 
                        {          
                            listado_cursos_aspirante: []
                        }) 
                    }
                    
                });
            }
            else
            {
                var ident = res.locals.usuarioCompleto._id;

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
                    var usuario = res.locals.usuarioCompleto;
                    return res.render ('resultadoInscripcion', 
                    {          
                        respuestaInscripcion: funciones.mostrarInscripcionExitosa(curso, usuario)
                    })   
                }); 
            }
        });
    });
});

app.post('/eliminarInscripcion', (req,res) => 
{
    let codigoCurso =  req.body.codigo;
    var ident = res.locals.usuarioCompleto._id;

    db.collection("cursosAspirantes").findOneAndDelete( ({cur_id: codigoCurso, usu_id: ident}), req.body, (err, dupla) =>
    {
        if (err){
            return console.log("\nERROR = "+err)
        }

        var idCurso = new mongoose.mongo.ObjectId(codigoCurso);
        db.collection("cursos").findOne({ _id: idCurso }, (err, curso) =>
        {
            res.render('resultadoEliminacionInscripcion',{
                respuestaEliminacionInscripcion: funciones.mostrarEliminacionInscripcionExitosa(curso)
            });
        });
        
    });
});


app.get('/cursosAspirante', (req,res) => 
{
    var ident = res.locals.usuarioCompleto._id;
    var cursosAspirante = [];

    db.collection("cursosAspirantes").find({ usu_id: ident }).toArray((err,respuesta) =>
    {
        if (err){
            return console.log("\nERROR = "+err)
        }

        let duplasCursosAspirante = JSON.parse(JSON.stringify(respuesta));

        if(duplasCursosAspirante.length != 0)
        {
            db.collection("cursos").find({}).toArray((err,respuesta) =>
            {
                if (err){
                    return console.log("\nERROR = "+err)
                }
                let listaCursos = JSON.parse(JSON.stringify(respuesta));

                duplasCursosAspirante.forEach(dupla =>
                {
                    cursosAspirante.push(listaCursos.filter(curso => curso._id == dupla.cur_id).pop());
                });

                return res.render('cursosAspirante', 
                {          
                    listado_cursos_aspirante: cursosAspirante
                    
                }) 
            });  
        }
        else
        {
            return res.render('cursosAspirante', 
            {          
                listado_cursos_aspirante: []
            }) 
        }
        
    });
});

app.get('/horarioAspirante', (req,res) => 
{
    var ident = res.locals.usuarioCompleto._id;
    var cursosAspirante = [];

    db.collection("cursosAspirantes").find({ usu_id: ident }).toArray((err,respuesta) =>
    {
        if (err){
            return console.log("\nERROR = "+err)
        }

        let duplasCursosAspirante = JSON.parse(JSON.stringify(respuesta));

        if(duplasCursosAspirante.length != 0)
        {
            db.collection("cursos").find({}).toArray((err,respuesta) =>
            {
                if (err){
                    return console.log("\nERROR = "+err)
                }
                let listaCursos = JSON.parse(JSON.stringify(respuesta));

                duplasCursosAspirante.forEach(dupla =>
                {
                    cursosAspirante.push(listaCursos.filter(curso => curso._id == dupla.cur_id).pop());
                });

                return res.render('horarioAspirante', 
                {          
                    listado_cursos_aspirante: cursosAspirante
                    
                }) 
            });  
        }
        else
        {
            return res.render('horarioAspirante', 
            {          
                listado_cursos_aspirante: []
            }) 
        }
        
    });
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


//funciones.enviarConfirmacionRegistro(req.body.correo);
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/upload')
//   },
//   filename: function (req, file, cb) {
//     cb(null, 'Usuario' + "_" + req.body.correo + path.extname(file.originalname)) 
//   }
// })
 
var upload = multer({})



app.post('/registro', upload.single('archivo'), (req,res)=>{
 
Usuario.findOne({ correo: req.body.correo }, (error, dato) => {

    if (error) {

        return console.log("error")
    }

    console.log("DATO = "+dato);
    if (dato != null) {
       
       res.render('registro',{
         mostrar : "El correo " + dato.correo + " ya se encuentra registrado en la Base de datos" 
         
       }) 

    }

    if (!dato) {

        funciones.enviarConfirmacionRegistro(req.body.correo)
    
        let usuario = new Usuario ({
            cedula: req.body.cedula,
            nombre: req.body.nombre,
            telefono: req.body.telefono,
            correo: req.body.correo,
            rol: req.body.rol,
            password: bcrypt.hashSync(req.body.password, 10),
            imagen: req.file.buffer
        
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

        var imagen =usuario.imagen.toString("base64");
        req.session.usuario = usuario._id;  
        req.session.nombre = usuario.nombre;
        req.session.usuarioCompleto =  usuario;
        res.locals.nombreUsuario = usuario.nombre;
        res.locals.usuarioCompleto = usuario;
        req.session.imagen =  imagen;
        res.locals.imagen = imagen;

        var esCoordinador = false;
        
        var rol = usuario.rol;
        req.session.coordinador = esCoordinador;
        res.locals.coordinador = esCoordinador;

        Curso.find({}).exec((err,respuesta) =>
        {
            if (err){
                return console.log(" ERROR = " + err)
            }
            funciones.guardar('listadoCursos', respuesta);
        });
        CursoDocente.find({}).exec((err,respuesta) =>
        {
            if (err){
                return console.log(" ERROR = " + err)
            }
            funciones.guardar('listadoCursosDocente', respuesta);
        });
        db.collection("cursoAspirantes").find({}).toArray((err,respuesta) =>
        {
            if (err){
                return console.log(" ERROR = " + err)
            }
            funciones.guardar('listadoCursosAspirantes', respuesta);
            console.log(respuesta);
        });
        Usuario.find({}).exec((err,respuesta) =>
        {
            if (err){
                return console.log(" ERROR = " + err)
            }
            funciones.guardar('listadoUsuarios', respuesta);
            
        });
        funciones.guardarinicio(usuario);
        
        
        
        if(rol == "Aspirante")
        {
            db.collection("cursos").find({ estado: "Disponible" }).toArray((err,respuesta) =>
            {
                if (err){
                    return console.log("\nERROR = "+err)
                }
            
                let cursosDis = JSON.parse(JSON.stringify(respuesta));

                funciones.guardarCursosDisponibles(cursosDis);

                return res.render('vistaAspirante',
                {
                    cursosDisponibles: cursosDis
                       
                })
            });
        }
        else if(rol == "Coordinador")
        {
            esCoordinador = true;
            req.session.coordinador = esCoordinador;
            return res.render('cursosCoordinador',{
                coordinador: esCoordinador,
                sesion: true
                
                
            });
        }
        else if(rol == 'Docente')
        {
            return res.render('cursosDocente',{
                coordinador: esCoordinador,
                sesion: true

                
            });

        }  
          
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


app.get('/chat', (req,res)=>{
    res.render('chat');
});


app.get('*',(req,res)=>{
    res.render('error',{
        estudiante: 'error'
    });
})


/**************** CHAT *****************************/

io.on('connection', client => {

    console.log("un usuario se ha conectado");

    client.on('usuarioNuevo', (usuarioConectado) =>{
        /*let listado = usuarios.agregarUsuario(client.id, usuario)
        console.log(listado)
        let texto = `Se ha conectado ${usuario}`
        io.emit('nuevoUsuario', texto )*/
        console.log("desde usuarioNuevo = " + usuarioConectado);
    })
});


/**************** CHAT *****************************/


mongoose.connect('mongodb://admin:admin1@ds141641.mlab.com:41641/dbedcontinua',{useNewUrlParser: true}, (err,result)=>{
    if (err) {
        return console.log(err);
    }
    db = result;
    console.log('conectado');
})

server.listen(port, ()=>{
    console.log('iniciado')
})

exports.app = app;