const hbs = require('hbs');
const funciones = require('../funciones');

hbs.registerHelper('mostrarPro', (nota1, nota2, nota3)=>{
    return (nota1+nota2+nota3)/3;   
})
hbs.registerHelper('listar',()=>{
    return funciones.mostrar();
})

