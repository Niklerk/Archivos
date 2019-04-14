const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schema = mongoose.Schema;
const Curso = require('./curso');


const cursoDocenteSchema = new schema({
    
    cur_id: {
        type: Object,
        require : true,
    },
    usu_id: {
        type: Number,
        required : true,

    },
    estado :{ 
        type: String,
        required : true
    },
    
    Curso :{
        type : mongoose.Schema.Types.ObjectId, ref : "Cursos"
    },
    
    Usuario :{
        type : mongoose.Schema.Types.ObjectId, ref : "Usuarios"
    }
});

cursoDocenteSchema.plugin(uniqueValidator);
const CursoDocente = mongoose.model('CursoDocente', cursoDocenteSchema);
module.exports = CursoDocente;
    
