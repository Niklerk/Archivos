const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schema = mongoose.Schema;

const cursoDocenteSchema = new schema({
    
    cur_id: {
        type: mongoose.Schema.Types.ObjectId,
        require : true,
    },
    usu_id: {
        type: Object,
        required : true,

    },
    estado :{ 
        type: String,
        required : true
    },
});

cursoDocenteSchema.plugin(uniqueValidator);
const CursoDocente = mongoose.model('CursoDocente', cursoDocenteSchema);
module.exports = CursoDocente;
    
