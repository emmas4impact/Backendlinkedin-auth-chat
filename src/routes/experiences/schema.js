const { model, Schema } = require("mongoose");


const experiencesSchema = new Schema({

        role: {type:String, required:true},
        company: {type:String, required:true},
        startDate: {type:Date, required:true},
        endDate: {type:Date}, //could be null
        description: {type:String, required:true},
        area: {type:String, required:true},
        username: {type: Schema.Types.String,ref:"profiles", required:true},// this should be an profile ID
        image: {type:String, required:true}, //server generated on upload, set a default here
    
},{timestamps:true});

const expModel = model('experiences', experiencesSchema);


module.exports = expModel;