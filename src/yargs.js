const nombre = {
    demand: true,
    alias: 'n'
}
const matematicas = {
    demand: true,
    alias: 'm'
}
const ingles = {
    demand: true,
    alias: 'i'
}
const programacion = {
    demand: true,
    alias: 'p'
}
const asignatura = {
    demand: true,
    alias: 'a'
}
const calificacion = {
    demand: true,
    alias: 'c'
}

const creacion = {
    nombre,
    matematicas,
    ingles,
    programacion
}
const mostrar = {
    nombre
}
const eliminar = {
    nombre
}
const actualizar = {
    nombre,
    asignatura,
    calificacion
}

const argv = require('yargs')
            .command('crear', 'crear estudiante',creacion)
            .command('actualizar', 'actualizar estudiante',actualizar)
            .command('mostrar', 'Mostrar todos los estudiante')
            .command('mostrarpro', 'Mostrar todos los estudiante que estan con un promedio mayor a 3')
            .command('mostrarest', 'Mostrar un estudiante',mostrar)
            .command('eliminar', 'Eliminar un estudiante',eliminar)
            .argv;

module.exports={
    argv
};
