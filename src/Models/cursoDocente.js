const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schema = mongoose.Schema;

const cursoDocenteSchema = new schema({
    cur_id: {
        type: String,
        require : true
    },
    usu_id: {
        type: String,
        required : true
    },
    cedula :{ 
        type: String,
        required : true
    },
    estado :{ 
        type: String,
        required : true
    },
    CursoAspirante : {
        type : mongoose.Schema.Types.ObjectId, ref : "cursoAspirante"
    }
});

cursoDocenteSchema.plugin(uniqueValidator);
const CursoDocente = mongoose.model('CursoDocente', cursoDocenteSchema);
module.exports = CursoDocente;
    
