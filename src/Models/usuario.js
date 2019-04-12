const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schema = mongoose.Schema;

const usuarioSchema = new schema({
    cedula: {
        type: Number,
        require : true,
        message: 'Usuario invalido'
    },
    nombre: {
        type: String,
        required : true,
        trim : true,

    },
    telefono :{ 
        type: Number,
        required : true
    },
    correo: {
        type: String,
        required : true,
        uniqueCaseInsensitive: true
    },
    password: {
        type: String,
        required : true
    },
    rol: {
        type: String,
        required : true
    }
});

usuarioSchema.plugin(uniqueValidator);
const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;