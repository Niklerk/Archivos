const fs = require('fs');
listaEstudiantes = [];
listaUsuarios = [];
listaCursos = [];
listaInicio = [];
usuarioConectado = null;

const crear = (estudiantes) => {
    listar();
    let est = {
        nombre: estudiantes.nombre,
        matematicas: estudiantes.matematicas,
        ingles: estudiantes.ingles,
        programacion: estudiantes.programacion
    };
    if (!duplicado(estudiantes.nombre)) {
        listaEstudiantes.push(est);
        guardar();
        console.log('archivo creado con exito');
    } else
        console.log('ya existe otro estudiante con ese nombre');
}

const guardar = (nombre, lista) => {
    let datos = JSON.stringify(lista);
    fs.writeFile(`${nombre}.json`, datos, (err) => {
        if (err) throw (err);
    })
}
const listar = () => {
    try {
        listaEstudiantes = JSON.parse(fs.readFileSync('listado.json'));
    } catch (error) {
        listaEstudiantes = [];
    }
}
const mostrar = () => {
    listar();
    let texto = 'listado de estudiantes ';
    texto += '<br/>';
    texto += "<table class='table table-striped table-hover'> \
             <thead class='thead-dark'> \
             <th> Nombre </th>\
            <th> Matematicas </th>\
            <th> Ingles </th>\
            <th> Programacion </th>";
    texto += "</thead>\
             <tbody>";
    listaEstudiantes.forEach(estudiante => {
        texto += Imprimir(estudiante);
    });
    texto += "</tbody>\
             </table>";
    return texto;
}
const mostrarEst = (_nombre) => {
    listar();
    let est = duplicado(_nombre);
    if (!est) {
        console.log('No existe este estudiante');
    } else {
        console.log('notas del estudiante');
        ImprimirLog(est);
    }
}
const mostrarMat = () => {
    listar();
    let est = listaEstudiantes.filter(e => e.matematicas >= 3);
    if (est.length == 0) {
        console.log('Ningun estudiante va ganado');
    } else {
        console.log('notas del estudiante');
        est.forEach(estudiante => {
            ImprimirLog(estudiante, true, false, false);
        });
    }
}
const eliminar = (_nombre) => {
    listar();
    let est = listaEstudiantes.filter(e => e.nombre != _nombre);
    if (est.length == listaEstudiantes.length) {
        console.log('No existe este estudiante');
    } else {
        listaEstudiantes = est;
        guardar();
        console.log('se ha eliminado el estudiante con exito');
    }
}
const mostrarPro = () => {
    listar();
    console.log('Promedio de los estudiante');
    listaEstudiantes.forEach(estudiante => {
        if (promedio(estudiante) > 3) {
            ImprimirLog(estudiante, true, true, true, true);
        }
    });
}
const actualizar = (_nombre, _asignatura, _calificacion) => {
    listar();
    let est = duplicado(_nombre);
    if (!est) {
        console.log('No existe este estudiante');
    } else {
        est[_asignatura] = _calificacion;
        guardar();
        console.log('se ha actualizado correctamente el estudiante');
        ImprimirLog(est);
    }
}

let ImprimirLog = (estudiante, mat = true, ing = true, prog = true, prom = false) => {
    console.log(estudiante.nombre);
    console.log(' notas ');
    if (mat) console.log('Matematicas ' + estudiante.matematicas);
    if (ing) console.log(' Ingles ' + estudiante.ingles);
    if (prog) console.log(' Programacion ' + estudiante.programacion);
    if (prom) console.log(' Promedio ' + promedio(estudiante));
    console.log('\n');
}

let Imprimir = (estudiante, mat = true, ing = true, prog = true, prom = false) => {
    let texto = "<tr>";
    texto += "<td>" + estudiante.nombre + "</td>";
    if (mat) texto += "<td>" +  estudiante.matematicas + "</td>";
    if (ing) texto += "<td>" +  estudiante.ingles + "</td>";
    if (prog) texto += "<td>" + estudiante.programacion + "</td>";
    if (prom) texto += "<td>" + promedio(estudiante) + "</td>";
    texto += '<tr/>';
    return texto;
}

let duplicado = (_nombre) => {
    return listaEstudiantes.find(e => e.nombre == _nombre);
}

let promedio = (estudiante) => {
    return (estudiante.matematicas + estudiante.ingles + estudiante.programacion) / 3
}

const listarCursosCoordinador = () => {
    listarCursos();
    let texto = "<table class='table table-striped table-hover'> \
                <thead class='thead-dark'> \
                <th style='display: none' >ID</th>\
                <th>NOMBRE</th>\
                <th>DESCRIPCION</th>\
                <th>VALOR</th>\
                <th>MODALIDAD</th>\
                <th>INTENSIDAD</th>\
                <th>ESTADO</th>\
                <th>CAMBIAR ESTADO</th>\
                <th>AGREGAR CURSO</th>\
                </thead>\
                <tbody>";


    listaCursos.forEach(cursos =>{
    texto +='<tr>' +
            "<td style='display: none'>" + cursos.id + '</td>' +
            '<td>' + crearDetalleUsuarios(cursos) + '</td>' +
            '<td>' + cursos.descripcion + '</td>' +
            '<td>' + cursos.valor + '</td>' +
            '<td>' + cursos.modalidad + '</td>' +
            '<td>' + cursos.intensidad + '</td>' +
            '<td>' + cursos.estado + '</td>' +
            `<td> <form class='form' action="/cambiarEstado" method="POST"><button class="btn btn-outline-danger" name='id' value="${cursos.id}">Cambiar</form> </td>` +
            "<td> <a href= '/agregarCurso'><i class='fas fa-address-book fa-w-14 fa-3x'></i></a></td>" +
            '</tr>'
    })

    texto = texto + '</tbody></table>';
    return texto;

}

let crearDetalleUsuarios = (_curso)=>{
    let html = '';
    listarCursosAspirantes();
    listarUsuariosInscritos();
    html += obtenerCabeceraCoordinador(_curso);
    html += obtenerCuerpoCoordinador(_curso);
    html += obtenerPie();
    return html;
}

const obtenerCuerpoCoordinador = (_curso) =>
{
    let texto = '';
    texto += `<div class="card">
                <div class="card-header" id="heading${_curso.id}">
                        <div class="col-sm-12 text-justify">
                            <h5 class="mb-0">
                                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${_curso.id}" aria-expanded="true" aria-controls="collapse${_curso.id}">
                                    ${_curso.nombre}
                                </button>
                            </h5>
                        </div>
                    </div>
                </div>`;
                if(_curso.estado == 'Disponible'){
                    let aspirante = listaCursosAspirantes.filter(dupla => dupla.cur_id == _curso.id);
                    if (aspirante.length > 0) {
                        texto +=  `<div id="collapse${_curso.id}" class="collapse" aria-labelledby="heading${_curso.id}" data-parent="#Curso${_curso.id}">
                            <div class="card-body" style="padding-left: 60px">`;
                            aspirante.forEach(e => {
                                let encontrado = listaUsuarios.find(buscar => buscar.cedula == e.usu_id);
                                if(!encontrado){
                                    texto += 'no hay usuario';
                                }else{
                                    texto += mostrarUsuarioCurso(encontrado,_curso.id);
                                }
                            });
                        }
                    }
                    texto +=  `</div>
                </div>
                </div>`; 
    return texto;
}

const obtenerCabeceraCoordinador = (curso) =>
{
    let texto = "<div class='container'>" +
                    "<div class='accordion' id='Curso"+ curso.id+"'>";
    return texto;
}


const mostrarUsuarioCurso = (_Usuarios, id) => {

    let texto = "<table class='table table-striped table-hover'> \
                <thead class='thead-dark'> \
                <th>CEDULA</th>\
                <th>NOMBRE</th>\
                <th>TELEFONO</th>\
                <th>ELIMINAR</th>\
                </thead>\
                <tbody>";
      texto +='<tr>' +
             '<td>' + _Usuarios.cedula + '</td>' +
             '<td>' + _Usuarios.nombre + '</td>' +
             '<td>' + _Usuarios.telefono + '</td>' +
             `<td><form class='form' action="/eliminarEstudiante" method="POST"><button class="btn btn-danger" name='cedula' value="${_Usuarios.cedula}&${id}">Eliminar</form> </td>` 

    texto += '</tbody></table>';
    return texto;

}

let cambiarEstado = (cursoId)=>{
    if(cursoId > 0);
    {
        listarCursos();

        let encontrado = listaCursos.find(e => e.id == cursoId);

        if (encontrado.length != listaCursos.length ) {
            if (encontrado.estado == 'Disponible') {
                encontrado["estado"] = 'Cerrado';
            } else {
                encontrado["estado"] = 'Disponible';
            }

        }
        guardar('listadoCursos',listaCursos);
    }
}

let eliminarEstudiante = (cedula, id)=>{
    if(cedula > 0);
    {
        listarCursosAspirantes();
        let encontrado = listaCursosAspirantes.find(e => e.usu_id == cedula && e.cur_id == id);
        if (encontrado.length != listaCursos.length ) {
            encontrado["estado"] = false;
            encontrado = listaCursosAspirantes.filter(e => e.estado);
            listaCursosAspirantes = encontrado;
            guardar('listadoCursosAspirantes',listaCursosAspirantes);
        }
    }
}

let agregarCurso = (id, nombre, descripcion, valor, modalidad, intensidad, estado)=>{
    if(id > 0);
    {
        listarCursos();

        let encontrado = listaCursos.find(e => e.id == id);

        if (!encontrado ) {
            let curso = {
                id: id,
                nombre: nombre,
                descripcion:descripcion,
                valor: valor,
                modalidad: modalidad,
                intensidad: intensidad,
                estado: estado
            };
            listaCursos.push(curso);
            guardar('listadoCursos',listaCursos);
            return "el curso se ha creado con exito"
        }else
            return "el curso ya existe"

    }
}

/******************* SECCION AGREGADA POR MARCELA *************************************/

const listarCursos = () => 
{
    try 
    {
        listaCursos = require('../listadoCursos.json');
    } catch (error) {
        listaCursos = [];
    }
}

const obtenerCabecera = () =>
{
    let texto = "<div class='container'>" +
                    "<div class='accordion' id='accordionExample'>";
    return texto;
}

const obtenerCuerpo = (cursos) =>
{
    let texto = '';
    var i = 1;
    cursos.forEach(curso =>
    {
        texto = texto +
            `<div class="card">
                <div class="card-header" id="heading${i}">
                    <div class="row">
                        <div class="col-sm-12 text-justify">
                            <h5 class="mb-0">
                                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                                    Curso ${i}: ${curso.nombre}
                                </button>
                            </h5>
                        </div>
                        <div class="col-sm-12 text-justify" style="padding-left: 50px">
                            Código de curso: ${curso.id}.
                            <br>
                            Descripción: ${curso.descripcion}
                            <br>
                            Valor: ${curso.valor} pesos.
                        </div>
                    </div>
                </div>

                <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                  <div class="card-body" style="padding-left: 60px">
                        <h6 style="color: blue"> Información Detallada:</h6>
                        Modalidad: ${curso.modalidad}
                        <br>
                        Intensidad: ${curso.intensidad}
                  </div>
                </div>
              </div>`; 
        i = i+1;           
    });
    return texto;
}

const obtenerPie = () =>
{
    let texto =     "</div>";
                "</div>";
    return texto;
}

const eliminadoExito = () =>
{
    let texto = "<div class='container'>" + "Eliminado con éxito" +
                    "<div class='accordion' id='accordionExample'>";
    return texto;
}

const mostrarCursosTotalesAspirante = () =>
{
    listarCursos();

    let cursosDisponibles = listaCursos.filter(cur => cur.estado == "Disponible");

    let cabecera = obtenerCabecera();
    let cuerpo = obtenerCuerpo(cursosDisponibles);
    let pie = obtenerPie();
    let tabla = cabecera + cuerpo + pie;
    return tabla;
}

const listarCursosAspirantes = () =>
{
    try 
    {
        listaCursosAspirantes = require('../listadoCursosAspirantes.json');
    } catch (error) {
        listaCursosAspirantes = [];
    }
}

const obtenerUsuarioConectado = () =>
{
    try 
    {
        usuarioConectado = require('../listadoInicio.json');
    } catch (error) {
        usuarioConectado = null;
    }
}

const obtenerCursosPorAspirante = () =>
{
    listarCursos();
    listarCursosAspirantes();
    obtenerUsuarioConectado();
    
    var cedula = usuarioConectado.cedula;
    var cursosAspirante = [];

    let duplasCursosAspirante = listaCursosAspirantes.filter(dupla => dupla.usu_id == cedula);

    duplasCursosAspirante.forEach(dupla =>
    {
        cursosAspirante.push(listaCursos.filter(curso => curso.id == dupla.cur_id).pop());
    });

    return cursosAspirante;
}

const mostrarCursosAspirante = () =>
{
    let cursosAspirante = obtenerCursosPorAspirante();

    let cabecera = obtenerCabecera();
    let cuerpo = obtenerCuerpo(cursosAspirante);
    let pie = obtenerPie();
    let tabla = cabecera + cuerpo + pie;
    return tabla;
}

const cursoExiste = (codCurso) =>
{
    listarCursos();
    let cursosDisponibles = listaCursos.filter(cur => cur.estado == "Disponible");
    let curso = cursosDisponibles.find(curso => curso.id == codCurso);
    if(curso != null) return true;
    else return false;
}

const usuarioInscrito = (codCurso) =>
{
    listarCursosAspirantes();
    obtenerUsuarioConectado();

    var cedula = usuarioConectado.cedula;
    var dupla = listaCursosAspirantes.filter(dupla => dupla.cur_id == codCurso && dupla.usu_id == cedula);

    if(dupla.length != 0) return true;
    else return false;
}

const guardarCursoAspirante = () => 
{
    let datos = JSON.stringify(listaCursosAspirantes);
    fs.writeFile('listadoCursosAspirantes.json', datos, (err) => {
        if (err) throw (err);
    })
}

const mostrarInscripcionExitosa = (codCurso) =>
{   
    var usuario = usuarioConectado;
    let curso = listaCursos.find(curso => curso.id == codCurso);

    var texto = '';
    texto = texto +  
        `<div class="container">
            <h3 style="color: #076633;">¡Gracias por inscribirte en uno de nuestros cursos!</h3>
            <br>
            <h5>Te confirmamos los datos de tu inscripción: </h5>
            <br>
            <div style="margin-left: 30px">
                <h5 style="color: #076633; margin-bottom: 15px">Persona Inscrita: </h5>
                <p style="margin-bottom: 5px;">Cedula: ${usuario.cedula}</p>
                <p style="margin-bottom: 5px;">Nombre: ${usuario.nombre}</p>
                <p style="margin-bottom: 5px;">Telefono: ${usuario.telefono}</p>
                <p>Correo: ${usuario.correo}</p>

                <h5 style="color: #076633; margin-bottom: 15px">Curso Inscrito: </h5>
                <p style="margin-bottom: 5px;">Código: ${curso.id}</p>
                <p style="margin-bottom: 5px;">Nombre: ${curso.nombre}</p>
                <p style="margin-bottom: 5px;">Descripción: ${curso.descripcion}</p>
                <p style="margin-bottom: 5px;">Valor: ${curso.valor}</p>
                <p style="margin-bottom: 5px;">Modalidad: ${curso.modalidad}</p>
                <p>Intensidad: ${curso.intensidad}</p>
            </div>
            <h5><a class="nav-link" href="/cursosAspirante"> >>Ver mis cursos inscritos</a></h5>
        </div>`;
    return texto;
}

const mostrarUsuarioInscrito = () =>
{
    var texto = '';
    texto = texto + 
        `<div class="container">
            <h3 style="color: #076633;">Inscripción Fallida</h3>
            <h5>Lo sentimos, usted ya se encuentra inscrito(a) en el curso.</h5>
            <h5><a class="nav-link" href="/cursosAspirante"> >>Ver mis cursos inscritos</a></h5>
        </div>`;
    return texto;  
}

const mostrarCursoInexistente = () =>
{
    var texto = '';
    texto = texto + 
        `<div class="container">
            <h3 style="color: #076633;">Inscripción Fallida</h3>
            <h5>Lo sentimos, el código ingresado no corresponde a ningun curso.</h5>
            <h5><a class="nav-link" href="/vistaAspirante"> >>Ver cursos disponibles</a></h5>
        </div>`;
    return texto;
}

const inscribirCurso = (codCurso) =>
{
    if(cursoExiste(codCurso))
    {
        if(!usuarioInscrito(codCurso))
        {
            let dupla = {
                cur_id: codCurso,
                usu_id: usuarioConectado.cedula
            };
            listaCursosAspirantes.push(dupla);
            guardarCursoAspirante();
            return mostrarInscripcionExitosa(codCurso);
        }
        else
            return mostrarUsuarioInscrito();
    }
    else
        return mostrarCursoInexistente();
}


/******************* SECCION DE MARCELA FINALIZADA *************************************/

/******************* SECCION AGREGADA POR JHON *************************************/

const mostrarCursosDetalles = (correo) =>
{
    listarUsuariosInscritos();
    listarCursos();

    listaUsuarios = require('../listadoUsuarios.json') 

    let encontrado = listaUsuarios.find(buscar => buscar.correo == correo)
  
    if(!encontrado){
        console.log('No existe este estudiante');
    }
    let cursosDisponibles = listaCursos.filter(cur => cur.estado == "Aspirante");

    let cabecera = obtenerCabecera();
    let cuerpo = obtenerCuerpo(cursosDisponibles);
    let pie = obtenerPie();
    let tabla = cabecera + cuerpo + pie;
    return tabla;
}

const eliminarCursoPreinscripto = (id) =>
{
    listarCursos();
    let encontrado = listaCursos.filter(buscar => buscar.estado == "Aspirante")
  
    if(!encontrado){
        console.log('No tiene cursos preinscriptos');
    } else {
        if(!encontrado) {
            let cursosDisponibles = listaCursos.filter(cur => cur.id == id);
    
            let cabecera = eliminadoExito();
            let cuerpo = obtenerCuerpo(cursosDisponibles);
            let pie = obtenerPie();
            let tabla = cabecera + cuerpo + pie;
            return tabla;
        } else {
            console.log('No existe este curso');
        }
    }
}

/******************* SECCION DE JHON FINALIZADA *************************************/

/******************* SECCION AGREGADA POR CATALINA *************************************/

const guardarusurarios = () => {
    let datos = JSON.stringify(listaUsuarios);
    fs.writeFile('listadoUsuarios.json', datos, (err) => {
        if (err) throw (err);
    })
}



const crearusuario = (cedula, nombre, rol, telefono, correo, password) => {
        
        listarUsuariosInscritos();
        let usu = {
            cedula: cedula,
            nombre: nombre,
            telefono: telefono,
            correo: correo,
            password: password,
            rol: rol
        };
        

        let encontrado = listaUsuarios.find(buscar => buscar.cedula == cedula)

        if (!encontrado) {
        listaUsuarios.push(usu);
        guardarusurarios();

        return "El usuario se a registrado con exito";
        
        }else{

            return "Ya hay un usuario registrado con el número de cedula ";
       } 

}

const listarUsuariosInscritos = () => {
    try {
        listaUsuarios = JSON.parse(fs.readFileSync('listadoUsuarios.json'));
    } catch (error) {
        listaUsuarios = [];
    }
}


const mostrarregistrados = () => {

    listarUsuariosInscritos();
    listaUsuarios = require('../listadoUsuarios.json')   
    let texto = "<table class='table table-striped table-hover'> \
                <thead class='thead-dark'> \
                <th>CEDULA</th>\
                <th>NOMBRE</th>\
                <th>ROL</th>\
                <th>TELEFONO</th>\
                <th>CORREO</th>\
                <th>PASSWORD</th>\
                </thead>\
                <tbody>";


    listaUsuarios.forEach(usuarios =>{
  
      texto = texto +
             '<tr>' +
             '<td>' + usuarios.cedula + '</td>' +
             '<td>' + usuarios.nombre + '</td>' +
             '<td>' + usuarios.rol + '</td>' +
             '<td>' + usuarios.telefono + '</td>' +
             '<td>' + usuarios.correo + '</td>' +
             '<td>' + usuarios.password + '</td></tr>'
    
    })

    texto = texto + '</tbody></table>';
    return texto;

}

const listarCursosDisponibles = () => {
    
    listaCursos = require('../listadoCursos.json')   
    let texto = "<table class='table table-striped table-hover'> \
                <thead class='thead-dark'> \
                <th>ID</th>\
                <th>NOMBRE</th>\
                <th>DESCRIPCION</th>\
                <th>VALOR</th>\
                <th>MODALIDAD</th>\
                <th>INTENSIDAD</th>\
                <th>ESTADO</th>\
                </thead>\
                <tbody>";


    listaCursos.forEach(cursos =>{

    if(cursos.estado=="Disponible"){    
      
      texto = texto +
             '<tr>' +
             '<td>' + cursos.id + '</td>' +
             '<td>' + cursos.nombre + '</td>' +
             '<td>' + cursos.descripción + '</td>' +
             '<td>' + cursos.valor + '</td>' +
             '<td>' + cursos.modalidad + '</td>' +
             '<td>' + cursos.intensidad + '</td>' +
             '<td>' + cursos.estado + '</td></tr>'
    
    }  
    
    })

    texto = texto + '</tbody></table>';
    return texto;

}


const inicioSesion = (correo, password) => {

        listaUsuarios = require('../listadoUsuarios.json')
        listaInicio = require('../listadoInicio.json')
        
        let usu = { 
            
            correo: correo,
            password: password
        };
        
        let buscarUsuCo = listaUsuarios.find(buscar => buscar.correo == correo);
        let buscarUsuPas = listaUsuarios.find(buscar => buscar.password == password);
        if (buscarUsuCo == buscarUsuPas) {
            listaInicio = [];
            listaInicio.push(buscarUsuCo);
            guardarinicio();
            return "Bienvenid@ " + buscarUsuCo.nombre + " usted a iniciado sesión"; 
            
        }else{

            return "Usted a ingresado un dato errado";
        }           
}



/******************* SECCION DE CATALINA FINALIZADA *************************************/


/******************* SECCION DE INICIO DE SESION *************************************/

const usuarioInicioExiste = (correo) =>
{
    listarUsuariosInscritos();
    var usuario = listaUsuarios.find(usuario => usuario.correo == correo);
    if(usuario) return usuario;
    else return null;
}

const guardarinicio = (usuario) => {
    let datos = JSON.stringify(usuario);
    fs.writeFile('listadoInicio.json', datos, (err) => {
        if (err) throw (err);
    })
}

const iniciarSesion = (correo, contrasena) =>
{
    var usuario = usuarioInicioExiste(correo);
    if(usuario)
    {
        if(correo == usuario.correo && contrasena == usuario.password)
        {
            guardarinicio(usuario);

            var rol = usuario.rol;
            if(rol == "Aspirante")
                return "vistaAspirante";
            else if(rol == "Coordinador")
                return "vistaCoordinador"; //CAMBIAR POR EL NOMBRE DE LA VISTA DEL COORDINADOR
        }
        else
        {
            return "datosInicioErroneos";
        }
    }
    else
        return "usuarioInicioInexistente";
}

/******************* SECCION DE INICIO DE SESION FINALIZADA *************************************/


module.exports = {
    crear,
    mostrar,
    mostrarEst,
    mostrarMat,
    mostrarPro,
    actualizar,
    eliminar,
    mostrarCursosTotalesAspirante,
    mostrarCursosDetalles,
    mostrarCursosAspirante,
    crearusuario,
    mostrarregistrados,
    listarCursosDisponibles,
    inicioSesion,
    listarCursosCoordinador,
    cambiarEstado,
    agregarCurso,
    eliminarEstudiante,
    inscribirCurso,
    eliminarCursoPreinscripto, 
    iniciarSesion
}