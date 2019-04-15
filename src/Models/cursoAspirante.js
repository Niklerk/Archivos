const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schema = mongoose.Schema;

const cursoAspiranteSchema = new schema({
    cur_id: {
        type: String,
        require : true
    },
    usu_id: {
        type: String,
        required : true

    },
    estado :{ 
        type: String,
        required : true
    }
});

cursoAspiranteSchema.plugin(uniqueValidator);
const CursoAspirante = mongoose.model('CursoAspirante', cursoAspiranteSchema);
module.exports = CursoAspirante;