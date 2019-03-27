const hbs = require('hbs');
const funciones = require('../funciones');

hbs.registerHelper('mostrarPro', (nota1, nota2, nota3)=>{
    return (nota1+nota2+nota3)/3;   
})
hbs.registerHelper('listar',()=>{
    return funciones.mostrar();
})

hbs.registerHelper('listado_total_cursos_aspirante', () =>
{
	return funciones.mostrarCursosTotalesAspirante();
})

