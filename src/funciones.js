const fs = require('fs');
listaEstudiantes = [];
listaUsuarios = [];
listaCursos = [];


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

const guardar = () => {
    let datos = JSON.stringify(listaEstudiantes);
    fs.writeFile('listado.json', datos, (err) => {
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

const obtenerCursosPorAspirante = () =>
{
    listarCursos();
    listarCursosAspirantes();
    var ident = '1234567';
    var cursosAspirante = [];

    let duplasCursosAspirante = listaCursosAspirantes.filter(dupla => dupla.usu_id == ident);

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


/******************* SECCION DE MARCELA FINALIZADA *************************************/

/******************* SECCION AGREGADA POR JHON *************************************/

const mostrarCursosDetalles = (nom, curso) =>
{
    listarCursos();

    let encontrado = listaEstudiantes.find(buscar => buscar.nombre == nom)
    if(!encontrado){
        console.log('No existe este estudiante');
    } else if(encontrado[curso]) {
        let cursosDisponibles = listaCursos.filter(cur => cur.estado == "Disponible");

        let cabecera = obtenerCabecera();
        let cuerpo = obtenerCuerpo(cursosDisponibles);
        let pie = obtenerPie();
        let tabla = cabecera + cuerpo + pie;
        return tabla;
    } else {
        console.log('No existe este curso');
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

/******************* SECCION DE CATALINA FINALIZADA *************************************/


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
    listarCursosDisponibles
}