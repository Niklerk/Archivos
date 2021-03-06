//require('./config/config');
const fs = require('fs');
const Curso = require('./Models/curso');
const CursoDocente = require('./Models/cursoDocente');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


listaEstudiantes = [];
listaUsuarios = [];
listaCursos = [];
listaCursosDocente = [];
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
    listarCursosDocente();
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
            "<td style='display: none'>" + cursos._id + '</td>' +
            '<td>' + crearDetalleUsuarios(cursos) + '</td>' +
            '<td>' + cursos.descripcion + '</td>' +
            '<td>' + cursos.valor + '</td>' +
            '<td>' + cursos.modalidad + '</td>' +
            '<td>' + cursos.intensidad + '</td>' +
            '<td>' + cursos.estado + '</td>' +
            `<td> <form class='form' action="/cursosCoordinador" method="POST"><button class="btn btn-outline-danger" name='id' value="${cursos._id}">Cambiar</form> </td>` +
            "<td> <a href= '/agregarCurso'><i class='fas fa-address-book fa-w-14 fa-3x'></i></a></td>" +
            '</tr>'
    })

    texto = texto + '</tbody></table>';
    return texto;

}

const listarCursosDocentes = (mostrarCursoDocente) => {
    listarCursos();
    listarCursosDocente();
    obtenerUsuarioConectado();
    let duplasCursosDocente = listaCursosDocente.filter(dupla => dupla.usu_id == usuarioConectado._id);

    texto = "<table class='table table-striped table-hover'> \
                <thead class='thead-dark'> \
                <th style='display: none' >ID</th>\
                <th>NOMBRE</th>\
                <th>DESCRIPCION</th>\
                <th>VALOR</th>\
                <th>MODALIDAD</th>\
                <th>INTENSIDAD</th>\
                <th>ESTADO</th>\
                </thead>\
                <tbody>";
    let cursosFiltrados = listaCursos.filter(fil =>{
        let res = duplasCursosDocente.find((fild)=>{
            return fil._id == fild.cur_id;
        });
        return res != undefined;
    });

    cursosFiltrados.forEach(cursos =>{
    texto +='<tr>' +
            "<td style='display: none'>" + cursos._id + '</td>' +
            '<td>' + crearDetalleUsuarios(cursos,false) + '</td>' +
            '<td>' + cursos.descripcion + '</td>' +
            '<td>' + cursos.valor + '</td>' +
            '<td>' + cursos.modalidad + '</td>' +
            '<td>' + cursos.intensidad + '</td>' +
            '<td>' + cursos.estado + '</td>' +
            '</tr>'
    })

    texto = texto + '</tbody></table>';
    return texto;
}

const listarUsuariosRol = () => {
    listarUsuariosInscritos();
    let texto = "<table class='table table-striped table-hover'> \
                <thead class='thead-dark'> \
                <th style='display: none' >ID</th>\
                <th>CEDULA</th>\
                <th>NOMBRE</th>\
                <th>CORREO</th>\
                <th>TELEFONO</th>\
                <th>ROL</th>\
                <th>CAMBIAR ROL</th>\
                </thead>\
                <tbody>";
    listaUsuarios.forEach(_usuarios =>{
    texto +='<tr>' +
            "<td>" + _usuarios.cedula + '</td>' +
            '<td>' + _usuarios.nombre + '</td>' +
            '<td>' + _usuarios.correo + '</td>' +
            '<td>' + _usuarios.telefono + '</td>' +
            '<td>' + _usuarios.rol + '</td>' +
            `<td> <form class='form' action="/usuariosRol" method="POST"><button class="btn btn-outline-danger" name='cedula' value="${_usuarios.cedula}">Cambiar</form> </td>` +
            '</tr>'
    });
    texto = texto + '</tbody></table>';
    return texto;
}


let crearDetalleUsuarios = (_curso, esCoordinador = true)=>{
    let html = '';
    listarCursosAspirantes();
    listarUsuariosInscritos();
    html += obtenerCabeceraCoordinador(_curso);
    html += obtenerCuerpoCoordinador(_curso, esCoordinador);
    html += obtenerPie();
    return html;
}

const obtenerCuerpoCoordinador = (_curso, esCoordinador) =>
{
    let texto = '';
    texto += `<div class="card">
                <div class="card-header" id="heading${_curso._id}">
                        <div class="col-sm-12 text-justify">
                            <h5 class="mb-0">
                                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${_curso._id}" aria-expanded="true" aria-controls="collapse${_curso._id}">
                                    ${_curso.nombre}
                                </button>
                            </h5>
                        </div>
                    </div>
                </div>`;
                if(esCoordinador == false || _curso.estado == 'Disponible'){
                    let aspirante = listaCursosAspirantes.filter(dupla => dupla.cur_id == _curso._id);
                    if (aspirante.length > 0) {
                        texto +=  `<div id="collapse${_curso._id}" class="collapse" aria-labelledby="heading${_curso._id}" data-parent="#Curso${_curso._id}">
                            <div class="card-body" style="padding-left: 60px">`;
                            aspirante.forEach(e => {
                                let encontrado = listaUsuarios.find(buscar => buscar._id == e.usu_id);
                                if(!encontrado){
                                    texto += 'no hay usuario';
                                }else{
                                    texto += mostrarUsuarioCurso(encontrado,_curso._id, esCoordinador);
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
                    "<div class='accordion' id='Curso"+ curso._id+"'>";
    return texto;
}


const mostrarUsuarioCurso = (_Usuarios, id, esCoordinador) => {

    let texto = "<table class='table table-striped table-hover'> \
                <thead class='thead-dark'> \
                <th>CEDULA</th>\
                <th>NOMBRE</th>\
                <th>TELEFONO</th>"
    if (esCoordinador){ 
        texto += "<th>ELIMINAR</th>"
    }
    texto += "</thead>\
                <tbody>";
      texto +='<tr>' +
             '<td>' + _Usuarios.cedula + '</td>' +
             '<td>' + _Usuarios.nombre + '</td>' +
             '<td>' + _Usuarios.telefono + '</td>' 
    if (esCoordinador){ 
        texto += `<td><form class='form' action="/eliminarEstudiante" method="POST"><button class="btn btn-danger" name='cedula' value="${_Usuarios.cedula}&${id}">Eliminar</form> </td>` 
    }
    texto += '</tbody></table>';
    return texto;

}

let cambiarEstado = (cursoId)=>{
    if(cursoId > 0);
    {
        listarCursos();
        listarCursosDocente();

        let encontrado = listaCursos.find(e => e._id == cursoId);

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

let cambiarEstadoRol = (cedula)=>{
    if(cedula > 0);
    {
        listarUsuariosInscritos();
        let encontrado = listaUsuarios.find(e => e.cedula == cedula);
        if (encontrado.length != listaUsuarios.length ) {
            if (encontrado.rol == 'Aspirante') {
                encontrado["rol"] = 'Coordinador';
            } else {
                encontrado["rol"] = 'Aspirante';
            }
        }
        guardar('listadoUsuarios',listaUsuarios);
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
        listarCursosDocente();

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
    let texto = "<form action='/resultadoInscripcion' method='post'>" + 
                    "<div class='container'>" +
                        "<div class='accordion' id='accordionExample'>";
    return texto;
}

const obtenerHorariosCurso = (horarios) =>
{
    horarios = JSON.parse( JSON.stringify(horarios) );
    let horariosCurso = horarios.map(horario => horario.clase);

    if(horariosCurso.length > 0)
    {
        let texto = '';
        for (var i = 0; i < horariosCurso.length; i++)
        {
            texto = texto + horariosCurso[i] + "<br>"
        };
        return texto;
    }
    else
        return "Sin horarios";
}

const obtenerCuerpoTotales = (cursos) =>
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
                                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}" style="color: #076633;">
                                    <b>Curso ${i}: ${curso.nombre}</b>
                                </button>
                            </h5>
                        </div>
                    </div>
                    <div class="row justify-content-between">
                        <div class="col-sm-10 text-justify" style="padding-left: 50px">
                            Descripción: ${curso.descripcion}
                            <br>
                            Valor: ${curso.valor} pesos.
                        </div>
                        <div class="col-sm-2 text-justify" >
                            <button class="btn" name="codigo" value="${curso._id}" style="background-color: #338B57; color: white;">Inscribir</button>
                        </div>
                    </div>
                </div>

                <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                  <div class="card-body" style="padding-left: 60px">
                        <h6 style="color: #076633;"> Información Detallada:</h6>
                        Modalidad: ${curso.modalidad}
                        <br>
                        Intensidad: ${curso.intensidad}
                        <br>
                        Horarios: ${obtenerHorariosCurso(curso.horarios)}
                  </div>
                </div>
              </div>`; 
        i = i+1;           
    });
    return texto;
}

const obtenerPie = () =>
{
    let texto =         "</div>" + 
                    "</div>" +
                "</form>";
    return texto;
}

const eliminadoExito = () =>
{
    let texto = "<div class='container'>" + "Eliminado con éxito" +
                    "<div class='accordion' id='accordionExample'>";
    return texto;
}

const mostrarCursoNoEncontrado = () =>
{
    let texto = "";
    texto = texto +
        `<div class="container">
            <h5>Lo sentimos, no se encontró ningun curso con el nombre.</h5>
            <h5><a class="nav-link" href="/vistaAspirante"> >>Ver cursos disponibles</a></h5>
        </div>`;
    return texto;  
}

const mostrarCursosTotalesAspirante = (cursosDisponibles) =>
{
    if(cursosDisponibles.length == 0)
    {
        return mostrarCursoNoEncontrado();
    }
    let cabecera = obtenerCabecera();
    let cuerpo = obtenerCuerpoTotales(cursosDisponibles);
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

const listarCursosDocente = ()=>{
    try 
    {
        listaCursosDocente = require('../listadoCursosDocente.json');
    } catch (error) {
        listaCursosDocente = [];
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
    listarCursosDocente();
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

const obtenerCabeceraInscritos = () =>
{
    let texto = "<form action='/eliminarInscripcion' method='post'>" + 
                    "<div class='container'>" +
                        "<div class='accordion' id='accordionExample'>";
    return texto;
}

const obtenerCuerpoInscritos = (cursos) =>
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
                                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}" style="color: #076633;">
                                    <b>Curso ${i}: ${curso.nombre}</b>
                                </button>
                            </h5>
                        </div>
                    </div>
                    <div class="row justify-content-between">
                        <div class="col-sm-9 text-justify" style="padding-left: 50px">
                            Descripción: ${curso.descripcion}
                            <br>
                            Valor: ${curso.valor} pesos.
                        </div>
                        <div class="col-sm-3 text-justify" >
                            <button class="btn btn-danger" name="codigo" value="${curso._id}">Eliminar Inscripción</button>
                        </div>
                    </div>
                </div>

                <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                  <div class="card-body" style="padding-left: 60px">
                        <h6 style="color: #076633;"> Información Detallada:</h6>
                        Modalidad: ${curso.modalidad}
                        <br>
                        Intensidad: ${curso.intensidad}
                        <br>
                        Horarios: ${obtenerHorariosCurso(curso.horarios)}
                  </div>
                </div>
              </div>`; 
        i = i+1;           
    });
    return texto;
}

const mostrarCursosAspirante = (listado_cursos_aspirante) =>
{
    //let cursosAspirante = obtenerCursosPorAspirante();

    if(listado_cursos_aspirante.length != 0)
    {
        let cabecera = obtenerCabeceraInscritos();
        let cuerpo = obtenerCuerpoInscritos(listado_cursos_aspirante);
        let pie = obtenerPie();
        let tabla = cabecera + cuerpo + pie;
        return tabla;
    }
    else
    {
        return mostrarAspiranteSinCursos();
    }
}

const mostrarAspiranteSinCursos = () =>
{
    var texto = '';
    texto = texto + 
        `<div class="container">
            <h5>Hasta el momento usted no se encuentra inscrito(a) en ningún curso.</h5>
            <h5>Anímate a inscribir uno de ellos en el siguiente enlace: 
                <a class="nav-link" href="/vistaAspirante"> >>Cursos disponibles</a>
            </h5>
        </div>`;
    return texto; 
}

const cursoExiste = (codCurso) =>
{
    listarCursosDocente();
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

const mostrarInscripcionExitosa = (curso, usuario) =>
{  
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

const mostrarCruceCurso = (cursoInscribir, cursoInscrito) =>
{
    var texto = '';
    texto = texto + 
        `<div class="container">
            <h3 style="color: #076633;">Inscripción Fallida</h3>
            <h5>Lo sentimos, los horarios del curso <b>${cursoInscribir.nombre}</b> se cruzan con los 
            horarios del curso <b>${cursoInscrito.nombre}:</b></h5>
            <br>
            <h5 style="color: #076633;">${cursoInscribir.nombre}</h5>
            <h5>${obtenerHorariosCurso(cursoInscribir.horarios)}</h5>
            <br>
            <h5 style="color: #076633;">${cursoInscrito.nombre}</h5>
            <h5>${obtenerHorariosCurso(cursoInscrito.horarios)}</h5>
            <h5><a class="nav-link" href="/vistaAspirante"> >>Ver cursos disponibles</a></h5>
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
            <h5><a class="nav-link" href="/vistaAspirante"> >>Ver cursos disponibles</a></h5>
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
                usu_id: usuarioConectado.cedula,
                estado: true
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

const mostrarEliminacionInscripcionExitosa = (curso) =>
{  
    var texto = '';
    texto = texto +  
        `<div class="container">
            <h3 style="color: #076633;">Eliminación de Inscripción a curso exitosa</h3>
            <br>
            <h5>Te confirmamos los datos del curso que eliminaste su inscripción: </h5>
            <br>
            <div style="margin-left: 30px">
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

const obtenerColorRandom = () =>
{
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const obtenerCurso = (horarioFila, cursosPresenciales) =>
{
    for (var i = 0; i < cursosPresenciales.length; i++) 
    {
        let curso = cursosPresenciales[i];
        let horarios = curso.horarios;

        horarios = JSON.parse( JSON.stringify(horarios) );

        let horariosCurso = horarios.map(horario => horario.clase);

        for (var j = 0; j < horariosCurso.length; j++) 
        {
            let horario = horariosCurso[j];
            if(horario == horarioFila)
            {
                var texto = '';
                texto = texto + 
                    `<div style="background-color: ${obtenerColorRandom()};">
                        ${curso.nombre}
                    </div>
                    `
                return texto;
            }
        };
    };
    return '';
}

const obtenerTablaHorario = (cursosPresenciales) =>
{
    var texto = '';
    texto = texto +
    `<div class='container table-responsive'>
        <table class="table table-bordered text-center" style="background-color: white">
            <thead>
                <tr>
                  <th scope="col" class="table-active">Horario</th>
                  <th scope="col" class="table-active">Lunes</th>
                  <th scope="col" class="table-active">Martes</th>
                  <th scope="col" class="table-active">Miercoles</th>
                  <th scope="col" class="table-active">Jueves</th>
                  <th scope="col" class="table-active">Viernes</th>
                  <th scope="col" class="table-active">Sábado</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row" class="table-active">7 am - 9 am</th>
                    <td>${obtenerCurso("Lunes 7 am - 9 am", cursosPresenciales)}</td>
                    <td>${obtenerCurso("Martes 7 am - 9 am", cursosPresenciales)}</td>
                    <td>${obtenerCurso("Miercoles 7 am - 9 am", cursosPresenciales)}</td>
                    <td>${obtenerCurso("Jueves 7 am - 9 am", cursosPresenciales)}</td>
                    <td>${obtenerCurso("Viernes 7 am - 9 am", cursosPresenciales)}</td>
                    <td>${obtenerCurso("Sabado 7 am - 9 am", cursosPresenciales)}</td>
                </tr>
                <tr>
                    <th scope="row" class="table-active">9 am - 11 am</th>
                    <td>${obtenerCurso("Lunes 9 am - 11 am", cursosPresenciales)}</td>
                    <td>${obtenerCurso("Martes 9 am - 11 am", cursosPresenciales)}</td>
                    <td>${obtenerCurso("Miercoles 9 am - 11 am", cursosPresenciales)}</td>
                    <td>${obtenerCurso("Jueves 9 am - 11 am", cursosPresenciales)}</td>
                    <td>${obtenerCurso("Viernes 9 am - 11 am", cursosPresenciales)}</td>
                    <td>${obtenerCurso("Sabado 9 am - 11 am", cursosPresenciales)}</td>
                </tr>
                <tr>
                    <th scope="row" class="table-active">11 am - 1 pm</th>
                    <td>${obtenerCurso("Lunes 11 am - 1 pm", cursosPresenciales)}</td>
                    <td>${obtenerCurso("Martes 11 am - 1 pm", cursosPresenciales)}</td>
                    <td>${obtenerCurso("Miercoles 11 am - 1 pm", cursosPresenciales)}</td>
                    <td>${obtenerCurso("Jueves 11 am - 1 pm", cursosPresenciales)}</td>
                    <td>${obtenerCurso("Viernes 11 am - 1 pm", cursosPresenciales)}</td>
                    <td>${obtenerCurso("Sabado 11 am - 1 pm", cursosPresenciales)}</td>
                </tr>
                <tr>
                    <th scope="row" class="table-active">2 pm - 4 pm</th>
                    <td>${obtenerCurso("Lunes 2 pm - 4 pm", cursosPresenciales)}</td>
                    <td>${obtenerCurso("Martes 2 pm - 4 pm", cursosPresenciales)}</td>
                    <td>${obtenerCurso("Miercoles 2 pm - 4 pm", cursosPresenciales)}</td>
                    <td>${obtenerCurso("Jueves 2 pm - 4 pm", cursosPresenciales)}</td>
                    <td>${obtenerCurso("Viernes 2 pm - 4 pm", cursosPresenciales)}</td>
                    <td>${obtenerCurso("Sabado 2 pm - 4 pm", cursosPresenciales)}</td>
                </tr>
                <tr>
                    <th scope="row" class="table-active">4 pm - 6 pm</th>
                    <td>${obtenerCurso("Lunes 4 pm - 6 pm", cursosPresenciales)}</td>
                    <td>${obtenerCurso("Martes 4 pm - 6 pm", cursosPresenciales)}</td>
                    <td>${obtenerCurso("Miercoles 4 pm - 6 pm", cursosPresenciales)}</td>
                    <td>${obtenerCurso("Jueves 4 pm - 6 pm", cursosPresenciales)}</td>
                    <td>${obtenerCurso("Viernes 4 pm - 6 pm", cursosPresenciales)}</td>
                    <td>${obtenerCurso("Sabado 4 pm - 6 pm", cursosPresenciales)}</td>
                </tr>
            </tbody>
        </table>
    </div>`
    return texto;
}

const mostrarSinCursosPresenciales = () =>
{
    var texto = '';
    texto = texto + 
        `<div class="container">
            <h5>Hasta el momento usted no se encuentra inscrito(a) en ningún curso presencial.</h5>
            <h5>Anímate a inscribir uno de ellos en el siguiente enlace: 
                <a class="nav-link" href="/vistaAspirante"> >>Cursos disponibles</a>
            </h5>
        </div>`;
    return texto; 
}

const mostrarHorarioAspirante = (cursosAspirante) =>
{
     if(cursosAspirante.length != 0)
    {
        let cursosPresenciales = cursosAspirante.filter(curso => curso.modalidad == "Presencial");
        
        if(cursosPresenciales.length > 0)
            return obtenerTablaHorario(cursosAspirante);
        else
            return mostrarSinCursosPresenciales();
    }
    else
    {
        return mostrarAspiranteSinCursos();
    }
}

const guardarCursosDisponibles = (listaDisponibles) =>
{
    let datos = JSON.stringify(listaDisponibles);
    fs.writeFile('listadoCursosDisponibles.json', datos, (err) => {
        if (err) throw (err);
    })
}


/******************* SECCION DE MARCELA FINALIZADA *************************************/


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

const listarCursosDisponibles = () => 
{
    listarCursos();
    listarCursosDocente();
    let texto = "<div class='container'>" +
                    "<div class='accordion' id='accordionExample'>";
    var i = 1;
    listaCursos.forEach(curso =>
    {
     if(curso.estado=="Disponible"){ 
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
                                Valor: ${curso.valor} pesos.
                                <br>
                                Estado: ${curso.estado}
                            </div>
                        </div>
                    </div>

                    <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                      <div class="card-body" style="padding-left: 60px">
                            <h6 style="color: blue"> Información Detallada:</h6>
                            Modalidad: ${curso.modalidad}
                            <br>
                            Intensidad: ${curso.intensidad}
                            <br>
                            Descripción: ${curso.descripcion}
                      </div>
                    </div>
                  </div>`; 
        i = i+1;           
      }   
    });
    
    texto = texto  + "</div>";
            
    return texto;

}

const cursosDisponibledb = (listadoCursosdb) =>
{
      
  let texto = "<div class='container'>" +
                    "<div class='accordion' id='accordionExample'>";
    var i = 1;
    listadoCursosdb.forEach(curso =>
    {
     if(curso.estado=="Disponible"){ 
        texto = texto +

                `<div class="card">
                <div class="card-header" id="heading${i}">
                    <div class="row">
                        <div class="col-sm-12 text-justify">
                            <h5 class="mb-0">
                                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}" style="color: #076633;">
                                    <b>Curso ${i}: ${curso.nombre}</b>
                                </button>
                            </h5>
                        </div>
                    </div>
                    <div class="row justify-content-between">
                        <div class="col-sm-9 text-justify" style="padding-left: 50px">
                            Valor: ${curso.valor} pesos.
                            <br>
                            Estado: ${curso.estado}
                        </div>
                    </div>
                </div>

                <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                  <div class="card-body" style="padding-left: 60px">
                        <h6 style="color: #076633;"> Información Detallada:</h6>
                           Modalidad: ${curso.modalidad}
                           <br>
                           Intensidad: ${curso.intensidad}
                           <br>
                           Descripción: ${curso.descripcion}
                  </div>
                </div>
              </div>`; 
        i = i+1;           
      }   
    });
    
    texto = texto  + "</div>";
            
    return texto;

}

const cursosDocentedb = (mostrarCursoDocente) =>
{
   

    let texto = "<div class='container'>" +
                    "<div class='accordion' id='accordionExample'>";
    var i = 1;
    mostrarCursoDocente.forEach(docente =>
    {
    
        texto = texto +
                `<div class="card">
                    <div class="card-header" id="heading${i}">
                        <div class="row">
                            <div class="col-sm-12 text-justify">
                                <h5 class="mb-0">
                                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                                        Curso: ${docente.cur_id.nombre}
                                    </button>
                                </h5>
                            </div>
                            <div class="col-sm-12 text-justify" style="padding-left: 50px">
                                Modalidad: ${docente.cur_id.modalidad}
                                <br>
                                Intensidad: ${docente.cur_id.intensidad}
                                <br>
                                Estado: ${docente.cur_id.estado}    
                            </div>
                        </div>
                    </div>

                    <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                      <div class="card-body" style="padding-left: 60px">
                            <h6 style="color: blue"> Listado Estudiantes:</h6>
                            Usuario_Id: ${docente.usu_id}
                            <br>
                            Cedula: ${docente.cedula}
                            
                                                        
                      </div>
                    </div>
                  </div>`; 
        i = i+1;           
      
    });
    
    texto = texto  + "</div>";
            
    return texto;

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
                return "cursosCoordinador"; //CAMBIAR POR EL NOMBRE DE LA VISTA DEL COORDINADOR
            else
                return "cursosDocente";
        }
        else
        {
            return "datosInicioErroneos";
        }
    }
    else
        return "usuarioInicioInexistente";
}

const cerrarSesion = () =>
{
    fs.unlinkSync('listadoInicio.json');
}


/******************* SECCION DE INICIO DE SESION FINALIZADA *************************************/

/******************* SECCION DE ENVIO DE CORREO *************************************/

const enviarConfirmacionRegistro = (correoDestino) =>
{
    console.log(correoDestino);
    const correo = 
    {
        to: correoDestino,
        from: "educontinuatdea@gmail.com",
        subject: 'Registro exitoso',
        html: 'Gracias por inscribirte en nuestra plataforma.'
    };

    sgMail.send(correo);
}

/******************* SECCION DE ENVIO DE CORREO FINALIZADA *************************************/


module.exports = {
    crear,
    mostrar,
    mostrarEst,
    mostrarMat,
    mostrarPro,
    actualizar,
    eliminar,
    mostrarCursosTotalesAspirante,
    mostrarCursosAspirante,
    crearusuario,
    mostrarregistrados,
    listarCursosDisponibles,
    listarCursosCoordinador,
    cambiarEstado,
    agregarCurso,
    eliminarEstudiante,
    inscribirCurso,
    iniciarSesion,
    listarUsuariosRol,
    cambiarEstadoRol,
    cerrarSesion,
    listarCursosDocentes,
    mostrarCursoInexistente,
    mostrarUsuarioInscrito,
    mostrarInscripcionExitosa,
    cursosDisponibledb,
    cursosDocentedb,
    mostrarAspiranteSinCursos,
    mostrarEliminacionInscripcionExitosa,
    guardar,
    guardarinicio,
    enviarConfirmacionRegistro,
    mostrarHorarioAspirante,
    mostrarCruceCurso,
    guardarCursosDisponibles
}