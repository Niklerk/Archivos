const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schema = mongoose.Schema;

const cursoSchema = new schema({
    nombre : {
        type: String,
        require : true,
        minlenght: 3,
        maxlenght: 60,
        message: 'Nombre no válido.'
    },
    descripcion: {
        type: String,
        require : true,
        minlenght: 3,
        maxlenght: 300,
        message: 'Descripción no válida.'
    },
    valor :{ 
        type: Number,
        require : true,
        default: 0,
        min: 0,
        message: 'Valor no válido.'
    },
    modalidad: {
        type: String,
        default: "No especifica",
        minlenght: 7,
        maxlenght: 13,
        message: 'Modalidad no válida.'
    },
    intensidad: {
        type: String,
        default: "No especifica",
        minlenght: 1,
        maxlenght: 40,
        message: 'Intensidad no válida.'
    },
    estado: {
        type: String,
        default: "Disponible",
        minlenght: 7,
        maxlenght: 10,
        message: 'Estado no válido.'
    },
    CursoDocente : {
        type : mongoose.Schema.Types.ObjectId, ref : "CursoDocente"
    }


});

cursoSchema.plugin(uniqueValidator);
const Curso = mongoose.model('Curso', cursoSchema);
module.exports = Curso;