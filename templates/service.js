const mongoose = require('mongoose');
var {pluralName} = require({modelPath});

class {modelNameService} {

   static getByID(id) {
   
      return {pluralName}.findById(id)
         .then((doc) => {
            return doc;
         })
         .catch((err) => {
            throw Error('DB_ERROR');
         });
   }

   static isValidId(id) {
      return (
         mongoose.Types.ObjectId.isValid(id) &&
         new mongoose.Types.ObjectId(id) === id
      );
   }

   static async getAll(id = null) {
      if (!id || id === null) {
         try {
            return await {pluralName}.find().exec();
         } catch (err) {
            throw new Error('DB_ERROR');
         }
      }
      if (id) {
         try {
            return await this.getByID(id);
         } catch (err) {
            throw new Error('INVALID_ID');
         }
      }
   }

   static async create({modelName}) {
      
      if (!{modelName}) {
         throw new Error('MISSING_ARGUMENT');
      }
      const {modelName} = new {pluralName}({modelName});

      try {
         const doc = await {modelName}.save();
         return doc;
      } catch {
         throw new Error('CREATE_ERROR {modelName}');
      }
   }

   static async update({modelNameToUpdate}) {
      if (!{modelNameToUpdate} || !{modelNameToUpdate}._id) {
         throw new Error('MISSING_ARGUMENT');
      }

      {pluralName}.findOne({_id: {modelNameToUpdate}._id}, function (err, {name}) {
         if (err) {
            return await res.status(500).json({
            message: 'RETRIVE_ERROR: {name}',
            error: err
            });
         }
         if (!{name}) {
            return await res.status(404).json({
               message: 'MISSING_ERROR: {name}'
            });
         }

         {updateFields}
         {name}.save(function (err, {name}) {
            if (err) {
               return await res.status(500).json({
                  message: 'UPDATE_ERROR: {name}.',
                  error: err
                  });
               }
               return await res.json({name});
            });
        });
   }

   static async delete(id) {
      if (!id) {
         throw new Error('MISSING_ARGUMENT');
      }
      try {
         return await {pluralName}.findOneAndDelete({
            _id: id,
         });
      } catch (err) {
         throw new Error('DB_ERROR');
      }
   }
}

module.exports = {modelNameService};
