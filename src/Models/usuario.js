const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schema = mongoose.Schema;

const usuarioSchema = new schema({
    cedula : {
        type: Number,
        require : true,
        minlenght: 1,
        maxlenght: 12,
        message: 'Cedula no válida.'
    },
    nombre: {
        type: String,
        require : true,
        minlenght: 3,
        maxlenght: 60,
        message: 'Nombre no válido.'
    },
    telefono :{ 
        type: Number,
        require : true,
        default: 0,
        minlenght: 7,
        maxlenght : 15,
        message: 'Número no válido.'
    },
    correo: {
        type: String,
        require : true,
        default: "Ej: usuario@servidor.com",
        minlenght: 7,
        maxlenght: 13,
        message: 'Modalidad no válida.'
    },
    password: {
        type: String,
        require : true,
        minlenght: 1,
        maxlenght: 30,
        message: 'Password no válida.'
    },
    rol: {
        type: String
        require : true
    }
});

usuarioSchema.plugin(uniqueValidator);
const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;