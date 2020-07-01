var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var {schemaName} = new Schema({fields});

{schemaName}.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('{modelName}', {schemaName});
