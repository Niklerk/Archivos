const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schema = mongoose.Schema;

const estudianteSchema = new schema({
    nombre : {
        type: String,
        require : true,
        trim: true,
        message: 'estudiante invalido'
    },
    password: {
        type: String,
        required : true
    },
    matematicas :{ 
        type: Number,
        default: 0,
        min: 0,
        max: 0
    },
    ingles: {
        type: Number,
        default: 0,
        min: 0,
        max: 0
    },
    programacion: {type: Number,
        default: 0,
        min: 0,
        max: 0
    }
});
estudianteSchema.plugin(uniqueValidator);
const Estudiante = mongoose.model('Estudiante', estudianteSchema);
module.exports = Estudiante;