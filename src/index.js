const {
    argv
} = require('./yargs');
const funciones = require('./funciones');

let comando = argv._[0];

switch (comando.toLowerCase()) {
    case 'crear':
        funciones.crear(argv);
        break;
    case 'actualizar':
        funciones.actualizar(argv.nombre, argv.asignatura, argv.calificacion);
        break;
    case 'eliminar':
        funciones.eliminar(argv.nombre);
        break;
    case 'mostrar':
        funciones.mostrar();
        break;
    case 'mostrarest':
        funciones.mostrarEst(argv.nombre);
        break;
    case 'mostrarmat':
        funciones.mostrarMat();
        break;
    case 'mostrarpro':
        funciones.mostrarPro();
        break;
    default:
        console.log('no ingreso un comando valido');
        break;
}