/**
 * Module dependencies
 */
var ft = require('./fileTools');
var formatTools = require('./formatTools');
var os = require('os');

/**
 * Generate a Mongoose model
 * @param {string} path
 * @param {string} modelName
 * @param {array} modelFields
 * @param {string} generateMethod
 * @param {function} cb
 */
function generateModel(path, modelName, modelFields, generateMethod, cb) {
   var fields = formatTools.getFieldsForModelTemplate(modelFields);
   var schemaName = modelName + 'Schema';

   var model = ft.loadTemplateSync('model.js');
   model = model.replace(/{modelName}/, modelName);
   model = model.replace(/{schemaName}/g, schemaName);
   model = model.replace(/{fields}/, fields);

   if (generateMethod === 't') {
      ft.createDirIfIsNotDefined(path, 'models', function () {
         ft.writeFile(
            path + '/models/' + modelName + 'Model.js',
            model,
            null,
            cb
         );
      });
   } else {
      ft.createDirIfIsNotDefined(path, modelName, function () {
         ft.writeFile(
            path + '/' + modelName + '/' + modelName + 'Model.js',
            model,
            null,
            cb
         );
      });
   }
}

/**
 * Generate a Express router
 * @param {string} path
 * @param {string} modelName
 * @param {string} generateMethod
 * @param {function} cb
 */
function generateRouter(path, modelName, generateMethod, cb) {
   var router = ft.loadTemplateSync('router.js');
   router = router.replace(/{controllerName}/g, modelName + 'Controller');

   if (generateMethod === 't') {
      ft.createDirIfIsNotDefined(path, 'routes', function () {
         router = router.replace(
            /{controllerPath}/g,
            "'../../controllers/" + modelName + "Controller.js'"
         );
         ft.writeFile(
            path + '/routes/' + modelName + 'Routes.js',
            router,
            null,
            cb
         );
      });
   } else {
      ft.createDirIfIsNotDefined(path, modelName, function () {
         router = router.replace(
            /{controllerPath}/g,
            "'./" + modelName + "Controller.js'"
         );
         ft.writeFile(
            path + '/' + modelName + '/' + modelName + 'Routes.js',
            router,
            null,
            cb
         );
      });
   }
}

/**
 * Generate Controller
 * @param {string} path
 * @param {string} modelName
 * @param {array} modelFields
 * @param {string} generateMethod
 * @param {function} cb
 */
function generateController(path, modelName, modelFields, generateMethod, cb) {
   var controller = ft.loadTemplateSync('controller.js');

   var updateFields = '';
   var createFields = os.EOL;

   modelFields.forEach(function (f, index, fields) {
      var field = f.name;

      updateFields +=
         modelName +
         '.' +
         field +
         ' = req.body.' +
         field +
         ' ? req.body.' +
         field +
         ' : ' +
         modelName +
         '.' +
         field +
         ';';
      updateFields += os.EOL + '\t\t\t';

      createFields += '\t\t\t' + field + ' : req.body.' + field;
      createFields += fields.length - 1 > index ? ',' + os.EOL : os.EOL;
   });
   // GhOSt update
   controller = controller.replace(
      /{modelNameController}/g,
      modelName + 'Controller'
   );
   controller = controller.replace(
      /{modelNameService}/g,
      modelName + 'Service'
   );
   controller = controller.replace(
      /{modelServicePath}/g,
      "'../services/" + modelName + "Service.js'"
   );
   // update - end
   controller = controller.replace(/{modelName}/g, modelName + 'Model');
   controller = controller.replace(/{name}/g, modelName);
   controller = controller.replace(
      /{pluralName}/g,
      formatTools.pluralize(modelName)
   );
   controller = controller.replace(
      /{controllerName}/g,
      modelName + 'Controller'
   );
   controller = controller.replace(/{createFields}/g, createFields);
   controller = controller.replace(/{updateFields}/g, updateFields);

   if (generateMethod === 't') {
      ft.createDirIfIsNotDefined(path, 'controllers', function () {
         controller = controller.replace(
            /{modelPath}/g,
            "'../models/" + modelName + "Model.js'"
         );
         ft.writeFile(
            path + '/controllers/' + modelName + 'Controller.js',
            controller,
            null,
            cb
         );
      });
   } else {
      ft.createDirIfIsNotDefined(path, modelName, function () {
         controller = controller.replace(
            /{modelPath}/g,
            "'./" + modelName + "Model.js'"
         );
         ft.writeFile(
            path + '/' + modelName + '/' + modelName + 'Controller.js',
            controller,
            null,
            cb
         );
      });
   }
}

/**
 * Generate Service
 * @author GhOSt @ 26/06/2020
 * @param {string} path
 * @param {string} modelName
 * @param {array} modelFields
 * @param {string} generateMethod
 * @param {function} cb
 */
function generateService(path, modelName, modelFields, generateMethod, cb) {
   var service = ft.loadTemplateSync('service.js');

   var updateFields = '';
   var createFields = os.EOL;

   modelFields.forEach(function (f, index, fields) {
      var field = f.name;

      updateFields +=
         modelName +
         '.' +
         field +
         ' = ' +
         modelName +
         'ToUpdate.' +
         field +
         ' ? ' +
         modelName +
         'ToUpdate.' +
         field +
         ' : ' +
         modelName +
         '.' +
         field +
         ';';
      updateFields += os.EOL + '\t\t\t';

      createFields += '\t\t\t' + field + ' : req.body.' + field;
      createFields += fields.length - 1 > index ? ',' + os.EOL : os.EOL;
   });

   service = service.replace(/{modelNameService}/g, modelName + 'Service');
   service = service.replace(/{modelName}/g, modelName);
   service = service.replace(/{name}/g, modelName);
   service = service.replace(/{tmpModelName}/g, '_' + modelName);
   service = service.replace(/{pluralName}/g, formatTools.pluralize(modelName));
   service = service.replace(/{modelNameToUpdate}/g, modelName + 'ToUpdate');
   service = service.replace(/{createFields}/g, createFields);
   service = service.replace(/{updateFields}/g, updateFields);

   if (generateMethod === 't') {
      ft.createDirIfIsNotDefined(path, 'services', function () {
         service = service.replace(
            /{modelPath}/g,
            "'../models/" + modelName + "Model.js'"
         );
         ft.writeFile(
            path + '/services/' + modelName + 'Service.js',
            service,
            null,
            cb
         );
      });
   } else {
      ft.createDirIfIsNotDefined(path, modelName, function () {
         service = service.replace(
            /{modelPath}/g,
            "'./" + modelName + "Model.js'"
         );
         ft.writeFile(
            path + '/' + modelName + '/' + modelName + 'Service.js',
            service,
            null,
            cb
         );
      });
   }
}

/**
 * Generate Client API
 * @author GhOSt
 * @param {string} path
 * @param {string} modelName
 * @param {string} generateMethod
 * @param {function} cb
 */
function generateClientAPI(path, modelName, modelFields, generateMethod, cb) {
   const fs = require('fs');
   fs.mkdirSync(path + '/client/API/', { recursive: true });
   cb();
}

/**
 * Generate a API Client Routes
 * @author GhOSt
 * @param {string} path
 * @param {string} modelName
 * @param {string} generateMethod
 * @param {function} cb
 */
function generateClientRoutes(
   path,
   modelName,
   modelFields,
   generateMethod,
   cb
) {
   var routes = ft.loadTemplateSync('clientRoute.js');
   routes = routes.replace(/{name}/g, modelName);
   routes = routes.replace(/{pluralName}/g, modelName + 's');

   if (generateMethod === 't') {
      ft.createDirIfIsNotDefined(path, 'client/api/' + modelName, function () {
         ft.writeFile(
            path + '/client/api/' + modelName + '/' + modelName + 'Routes.js',
            routes,
            null,
            cb
         );
      });
   } else {
      ft.createDirIfIsNotDefined(path, modelName, function () {
         ft.writeFile(
            path + '/client/api/' + modelName + '/' + modelName + 'Routes.js',
            routes,
            null,
            cb
         );
      });
   }
}

/**
 * Generate a API Client DTO
 * @author GhOSt
 * @param {string} path
 * @param {string} modelName
 * @param {string} generateMethod
 * @param {function} cb
 */
function generateClienDTO(path, modelName, modelFields, generateMethod, cb) {
   var dto = ft.loadTemplateSync('clientDto.js');

   var props = '';
   var constructorFileds = '';
   var dtoFields = '';

   modelFields.forEach(function (f, index, fields) {
      var field = f.name;
      props += field + ', ';

      constructorFileds += '\t\t this.' + field + ' = ' + field + ';';
      constructorFileds += fields.length - 1 > index ? os.EOL : os.EOL;

      dtoFields += '\t\t\t' + field + ': this.' + field;
      dtoFields += fields.length - 1 > index ? ',' + os.EOL : os.EOL;
   });

   props = props.slice(0, props.length - 2);
   constructorFileds = constructorFileds.slice(0, constructorFileds.length - 2);
   dtoFields = dtoFields.slice(0, dtoFields.length - 2);

   dto = dto.replace(/{dtoName}/g, modelName + 'DTO.js');
   dto = dto.replace(/{name}/g, modelName);
   dto = dto.replace(/{pluralName}/g, modelName + 's');
   dto = dto.replace(/{props}/g, props);
   dto = dto.replace(/{constructorFileds}/g, constructorFileds);
   dto = dto.replace(/{dtoFields}/g, dtoFields);

   if (generateMethod === 't') {
      ft.createDirIfIsNotDefined(path, 'client/api/' + modelName, function () {
         ft.writeFile(
            path + '/client/api/' + modelName + '/' + modelName + 'DTO.js',
            dto,
            null,
            cb
         );
      });
   } else {
      ft.createDirIfIsNotDefined(path, modelName, function () {
         ft.writeFile(
            path + '/client/api/' + modelName + '/' + modelName + 'DTO.js',
            dto,
            null,
            cb
         );
      });
   }
}

/**
 * Generate a API Client Service
 * @author GhOSt
 * @param {string} path
 * @param {string} modelName
 * @param {string} generateMethod
 * @param {function} cb
 */
function generateClienService(
   path,
   modelName,
   modelFields,
   generateMethod,
   cb
) {
   var service = ft.loadTemplateSync('clientService.js');

   var props = '';
   var queryProps = '';

   modelFields.forEach(function (f, index, fields) {
      var field = f.name;

      props += field + ', ';
      queryProps += field + ' = null, ';
   });

   props = props.slice(0, props.length - 2);
   queryProps = queryProps.slice(0, queryProps.length - 2);

   service = service.replace(/{dtoName}/g, modelName + 'DTO.js');
   service = service.replace(/{dto}/g, modelName + '_DTO');
   service = service.replace(/{routesName}/g, modelName + 'sRoutes.js');
   service = service.replace(/{name}/g, modelName);
   service = service.replace(/{pluralName}/g, modelName + 's');
   service = service.replace(/{clientServiceName}/g, modelName + 'Service');
   service = service.replace(/{props}/g, props);
   service = service.replace(/{queryProps}/g, queryProps);

   if (generateMethod === 't') {
      ft.createDirIfIsNotDefined(path, 'client/api/' + modelName, function () {
         ft.writeFile(
            path + '/client/api/' + modelName + '/' + modelName + 'Service.js',
            service,
            null,
            cb
         );
      });
   } else {
      ft.createDirIfIsNotDefined(path, modelName, function () {
         ft.writeFile(
            path + '/client/api/' + modelName + '/' + modelName + 'Service.js',
            service,
            null,
            cb
         );
      });
   }
}

module.exports = {
   generateModel: generateModel,
   generateRouter: generateRouter,
   generateController: generateController,
   generateService: generateService,
   generateClientAPI: generateClientAPI,
   generateClientRoutes: generateClientRoutes,
   generateClienService: generateClienService,
   generateClienDTO: generateClienDTO,
};
