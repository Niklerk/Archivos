const hbs = require('hbs');
const funciones = require('../funciones');
// const socket = require('../../public/js/socket.js');


hbs.registerHelper('mostrarPro', (nota1, nota2, nota3)=>{
    return (nota1+nota2+nota3)/3;   
})
hbs.registerHelper('listar',()=>{
    return funciones.mostrar();
})

hbs.registerHelper('mostrarCursosTotalesAspirante', (cursosDisponibles) =>
{
	return funciones.mostrarCursosTotalesAspirante(cursosDisponibles);
})

hbs.registerHelper('inscribirCurso', (texto)=>
{
    return funciones.inscribirCurso(texto);
})

hbs.registerHelper('mostrarCursosAspirante', (listado_cursos_aspirante) =>
{
	return funciones.mostrarCursosAspirante(listado_cursos_aspirante);
})

hbs.registerHelper('mostrarHorarioAspirante', (cursosAspirante) =>
{
	return funciones.mostrarHorarioAspirante(cursosAspirante);
})

hbs.registerHelper('crearusuario',(cedula, nombre, rol, telefono, correo, password)=>
{
    return funciones.crearusuario(cedula, nombre, rol, telefono, correo, password);
})

hbs.registerHelper('eliminarEstudiante',(cedula, id)=>
{
    return funciones.eliminarEstudiante(cedula, id);
})

hbs.registerHelper('agregarCurso',(id, nombre, descripcion, valor, modalidad, intensidad, estado)=>
{
    return funciones.agregarCurso(id, nombre, descripcion, valor, modalidad, intensidad, estado);
})

hbs.registerHelper('mostrarregistrados', () =>
{
	return funciones.mostrarregistrados();
})

hbs.registerHelper('listarCursosDisponibles', () =>
{
	return funciones.listarCursosDisponibles();
})

hbs.registerHelper('inicioSesion', (correo, password) =>
{
	return funciones.inicioSesion(correo, password);
})

hbs.registerHelper('listarCursosCoordinador', () =>
{
	return funciones.listarCursosCoordinador();
})
hbs.registerHelper('mostrarCursosDetalles', (nombre) => {
	return funciones.mostrarCursosDetalles(nombre);
})

hbs.registerHelper('eliminarCursoPreinscripto', (id) => {
	return funciones.eliminarCursoPreinscripto(id);
})

hbs.registerHelper('listarUsuariosRol', () =>
{
	return funciones.listarUsuariosRol();
})

hbs.registerHelper('listarCursosDocentes', (mostrarCursoDocente) =>
{
	return funciones.listarCursosDocentes(mostrarCursoDocente);
})

hbs.registerHelper('cursosDisponibledb', (listadoCursosdb) =>
{
	return funciones.cursosDisponibledb(listadoCursosdb);
})

hbs.registerHelper('cursosDocentedb', (mostrarCursoDocente) =>
{
	return funciones.cursosDocentedb(mostrarCursoDocente);
})

// hbs.registerHelper('setUsuarioConectado', (usuarioCompleto) =>
// {
// 	console.log("entree " + usuarioCompleto.nombre);
// 	return socket.setUsuarioConectado(usuarioCompleto);
// })