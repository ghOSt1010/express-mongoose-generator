var os = require('os');

var objectId = {
    name: '{' + os.EOL +
    '\t \ttype: mongoose.Schema.Types.ObjectId,' + os.EOL +
    '\t \tref: \'{ref}\''+ ',' + os.EOL +
    '\t \tautopopulate: { maxDepth: 2 },' + os.EOL +
    '\t \trequired: true' + os.EOL +
    '\t}'
};

module.exports = objectId;
