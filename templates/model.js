var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var { schemaName } = new Schema({ fields });

EmployeesSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('{modelName}', { schemaName });
