[![Build Status](https://travis-ci.org/DamienP33/express-mongoose-generator.svg?branch=master)](https://travis-ci.org/DamienP33/express-mongoose-generator)
# express-mongoose-generator

It’s a mongoose model, REST controller and Express router code generator for Express.js 4 application.

## Installation
Download and copy this package as in gloabal npm node-modules package


## Usage
### Non-Interactive mode
Generates a Mongoose model, a REST controller and Express router :
```bash
$ mongoose-gen -m car -f carDoor:number,color -r
        create: ./models/cardModel.js
        create: ./routes/cardRoutes.js
        create: ./controllers/cardController.js
        create: ./services/cardService.js
```

##### Options

  - `-m, --model <modelName>` - the model name.
  - `-f, --fields  <fields>` - the fields (name1:type,name2:type).
  - `-r, --rest` - enable generation REST.
  - `-t, --tree <tree>`        files tree generation grouped by (t)ype or by (m)odule

##### Available types
  - string
  - number
  - date
  - boolean
  - array
  - objectId

### Interactive mode

Generates a Mongoose model, a REST controller and Express router :
```bash
$ mongoose-gen
Model Name : car
Available types : string, number, date, boolean, array
Field Name (press <return> to stop adding fields) : door
Field Type [string] : number
Field Name (press <return> to stop adding fields) : color
Field Type [string] : 
Field Name (press <return> to stop adding fields) : owner
Field Type [string] : objectId
Reference (model name referred by the objectId field) : User
Field Name (press <return> to stop adding fields) : 
Generate Rest (yes/no) ? [yes] : 
Files tree generation grouped by Type or by Module (t/m) ? [t] : 
        create: ./models/carModel.js
        create: ./routes/carsRoutes.js
        create: ./controllers/carController.js
        create: ./services/carService.js
```

## Rendering
### Model
models/carModel.js :
```javascript
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var CarSchema = new Schema({
	'Brand' : String,
	'Color' : String,
	'Owner' : {
	 	type: mongoose.Schema.Types.ObjectId,
	 	ref: 'User',
	 	autopopulate: { maxDepth: 2 },
	 	required: true
	}
});

CarSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Car', CarSchema);

```
@dependency
Models are using mongoose-autopopulate plugin - dependency

### Router
routes/carRoutes.js :
```javascript
var express = require('express');
var router = express.Router();
var carController = require('../controllers/carController.js');

/*
 * GET
 */
router.get('/', carController.list);

/*
 * GET
 */
router.get('/:id', carController.show);

/*
 * POST
 */
router.post('/', carController.create);

/*
 * PUT
 */
router.put('/:id', carController.update);

/*
 * DELETE
 */
router.delete('/:id', carController.remove);

module.exports = router;

```

### Controller
controllers/carController.js :
```javascript
var carModel = require('../models/carModel.js');

/**
 * CarController.js
 *
 * @description :: Server-side logic for managing cars.
 */
var CarService = require('../services/CarService.js')

class CarController {
    
    static async list(req, res, err){

        try {
            const {id} = req.query
            const data = await CarService.getAll(id)
            return res.status(200).json(data)
        }
        catch (err) {
            return  res.status(500).jsson(err);
        }
        
    }

    static async show(req, res, err){

        var id = req.params.id;

        if (!id) {
            return await res.status(402).json({
                message: 'MISSING_ARGUMENT'
            });
        }

        try{
            var data =  await CarService.getByID(id)
            return await res.status(200).json(data);
        }catch(err){
            return await res.satus(500).json(err)
        }
        
    }

    static async create(req, res, err){

        var Car = req.body;

        if (!Car) {
            return await res.status(402).json({
                message: 'MISSING_ARGUMENT'
            });
        }

        try{
            var data =  await CarService.create(Car)
            return await res.status(201).json(data);
        }catch(err){
            return await res.satus(500).json(err)
        }
    }

    static async update(req, res, err){

        var Car = req.body;

        if (!Car) {
            return await res.status(402).json({
                message: 'MISSING_ARGUMENT'
            });
        }

        try{
            var data =  await CarService.update(Car)
            return await res.status(200).json(data);
        }catch(err){
            return await res.satus(500).json(err)
        }

    }

    static async remove(req, res, err){
        var id = req.params.id;
        CarModel.findByIdAndRemove(id, function (err, Car) {
            if (err) {
                return await res.status(500).json({
                    message: 'Error when deleting the Car.',
                    error: err
                });
            }
            return await res.status(204).json();
        });
    }
}

module.exports = CarController 
```

/**
 * CarController.js
 *
 * @description :: Server-side logic for managing cars.
 */
 const mongoose = require('mongoose');
var Cars = require('../models/CarModel.js');

class CarService {

   static getByID(id) {
   
      return Cars.findById(id)
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
            return await Cars.find().exec();
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

   static async create(Car) {
      
      if (!Car) {
         throw new Error('MISSING_ARGUMENT');
      }
      const Car = new Cars(Car);

      try {
         const doc = await Car.save();
         return doc;
      } catch {
         throw new Error('CREATE_ERROR Car');
      }
   }

   static async update(CarToUpdate) {
      if (!CarToUpdate || !CarToUpdate._id) {
         throw new Error('MISSING_ARGUMENT');
      }

      Cars.findOne({_id: CarToUpdate._id}, function (err, Car) {
         if (err) {
            return await res.status(500).json({
            message: 'RETRIVE_ERROR: Car',
            error: err
            });
         }
         if (!Car) {
            return await res.status(404).json({
               message: 'MISSING_ERROR: Car'
            });
         }

         Car.Brand = CarToUpdate.Brand ? CarToUpdate.Brand : Car.Brand;
			Car.Color = CarToUpdate.Color ? CarToUpdate.Color : Car.Color;
			
         Car.save(function (err, Car) {
            if (err) {
               return await res.status(500).json({
                  message: 'UPDATE_ERROR: Car.',
                  error: err
                  });
               }
               return await res.json(Car);
            });
        });
   }

   static async delete(id) {
      if (!id) {
         throw new Error('MISSING_ARGUMENT');
      }
      try {
         return await Cars.findOneAndDelete({
            _id: id,
         });
      } catch (err) {
         throw new Error('DB_ERROR');
      }
   }
}

module.exports = CarService;


### With files tree generation by module
```bash
Files tree generation grouped by Type or by Module (t/m) ? [t] : m
        create: ./car
        create: ./car/carModel.js
        create: ./car/carController.js
        create: ./car/carRoutes.js
        create: ./car/carService.js
```

You then only have to add router in app.js file and MongoDB connection whit Mongoose.
app.js :
```javascript
var routes = require('./routes/index');
var cars = require('./routes/carRoutes');
 ...

app.use('/', routes);
app.use('/cars', cars);
 ...
 
```

## Licence
Licensed under the [MIT license](LICENSE).
