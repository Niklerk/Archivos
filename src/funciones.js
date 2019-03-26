const fs = require('fs');
listaEstudiantes = [];

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
    texto += "<table class='table'> \
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
    let texto = '<br/>';
    
    texto += "<tr>";
    texto += "<td>" + estudiante.nombre + "</td>";
    if (mat) texto += "<td>" + 'Matematicas ' + estudiante.matematicas + "</td>";
    if (ing) texto += "<td>" + ' Ingles ' + estudiante.ingles + "</td>";
    if (prog) texto += "<td>" + ' Programacion ' + estudiante.programacion + "</td>";
    if (prom) texto += "<td>" + ' Promedio ' + promedio(estudiante) + "</td>";
    texto += '<tr/>';
    return texto;
}

let duplicado = (_nombre) => {
    return listaEstudiantes.find(e => e.nombre == _nombre);
}

let promedio = (estudiante) => {
    return (estudiante.matematicas + estudiante.ingles + estudiante.programacion) / 3
}

module.exports = {
    crear,
    mostrar,
    mostrarEst,
    mostrarMat,
    mostrarPro,
    actualizar,
    eliminar
}