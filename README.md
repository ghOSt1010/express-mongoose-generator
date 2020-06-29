[![Build Status](https://travis-ci.org/DamienP33/express-mongoose-generator.svg?branch=master)](https://travis-ci.org/DamienP33/express-mongoose-generator)
# express-mongoose-generator

It’s a mongoose model, REST controller and Express router code generator for Express.js 4 application.

## Installation
```bash
$ npm install -g express-mongoose-generator
```

## Usage
### Non-Interactive mode
Generates a Mongoose model, a REST controller and Express router :
```bash
$ mongoose-gen -m car -f carDoor:number,color -r
        create: ./models/cardModel.js
        create: ./routes/cardRoutes.js
        create: ./controllers/cardController.js
        create: ./client/API/car/carRoutes.js
        create: ./client/API/car/carRoutes.js
        create: ./client/API/car/carRoutes.js
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
        create: ./client/API/car/carRoutes.js
        create: ./client/API/car/carRoutes.js
        create: ./client/API/car/carRoutes.js
```

## Rendering
### Model
models/carModel.js :
```javascript
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var carSchema = new Schema({
	"color" : String,
	"door" : Number,
    "owner" : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('car', carSchema);
```

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
 * carController.js
 *
 * @description :: Server-side logic for managing cars.
 */
module.exports = {

    /**
     * carController.list()
     */
    list: function(req, res) {
        carModel.find(function(err, cars){
            if(err) {
                return res.status(500).json({
                    message: 'Error getting car.'
                });
            }
            return res.json(cars);
        });
    },

    /**
     * carController.show()
     */
    show: function(req, res) {
        var id = req.params.id;
        carModel.findOne({_id: id}, function(err, car){
            if(err) {
                return res.status(500).json({
                    message: 'Error getting car.'
                });
            }
            if(!car) {
                return res.status(404).json({
                    message: 'No such car'
                });
            }
            return res.json(car);
        });
    },

    /**
     * carController.create()
     */
    create: function(req, res) {
        var car = new carModel({
			color : req.body.color,
			door : req.body.door
        });

        car.save(function(err, car){
            if(err) {
                return res.status(500).json({
                    message: 'Error saving car',
                    error: err
                });
            }
            return res.json({
                message: 'saved',
                _id: car._id
            });
        });
    },

    /**
     * carController.update()
     */
    update: function(req, res) {
        var id = req.params.id;
        carModel.findOne({_id: id}, function(err, car){
            if(err) {
                return res.status(500).json({
                    message: 'Error saving car',
                    error: err
                });
            }
            if(!car) {
                return res.status(404).json({
                    message: 'No such car'
                });
            }

            car.color =  req.body.color ? req.body.color : car.color;
			car.door =  req.body.door ? req.body.door : car.door;
			
            car.save(function(err, car){
                if(err) {
                    return res.status(500).json({
                        message: 'Error getting car.'
                    });
                }
                if(!car) {
                    return res.status(404).json({
                        message: 'No such car'
                    });
                }
                return res.json(car);
            });
        });
    },

    /**
     * carController.remove()
     */
    remove: function(req, res) {
        var id = req.params.id;
        carModel.findByIdAndRemove(id, function(err, car){
            if(err) {
                return res.status(500).json({
                    message: 'Error getting car.'
                });
            }
            return res.json(car);
        });
    }
};
```
### Client DTO Object
client/API/carDTO.js :
```javascript
export default class car {
   constructor(color, door, owner) {
		 this.color = color;
		 this.door = door;
		 this.owner = owner;
   }

   getEmployeeDTO() {
      return {
			color: this.color,
			door: this.door,
			owner: this.owner
      }
   };
}
```

### Client API Routes 
client/API/carRoutes.js :
```javascript
const MAIN_PATH = '/api/car';

export default class cars {
   static GET = MAIN_PATH + '/';
   static GET_BY_ID = MAIN_PATH + '/id/';
   static QUERY = MAIN_PATH + '?'   
   static CREATE = MAIN_PATH + '/';
   static UPDATE = MAIN_PATH + '/';
   static DELETE_BY_ID = MAIN_PATH + '/';
}
```

### Client API Service 
client/API/carService.js :
```javascript
import car_DTO from './carDTO.js';
import ROUTES from './carsRoutes.js';
import Request from '../../Requests/Request';

export default class carService {
   static async createDTO(color, door, owner) {
      return new car_DTO(
         color, door, owner
      ).getEmployeeDTO();
   }

   static async getList() {
      return await Request.get(ROUTES.GET)
         .then(result => {
            return result;
         })
         .catch(err => {
            throw err;
         });
   }
   static async getById(id) {
      return await Request.get(ROUTES.GET_BY_ID + id)
         .then(result => {
            return result;
         })
         .catch(err => {
            throw err;
         });
   }

    static async query(color = null, door = null, owner = null) {
       
      let ask = '';

      for (let i = 0; i < arguments.length; i++) {
         if (arguments[i] !== null) {
            ask += i + '&';
         }
      }
      ask = ask.slice(0, ask.length - 1);

      return await Request.get(ROUTES.QUERY + ask)
         .then(result => {
            return result;
         })
         .catch(err => {
            throw err;
         });
   }

   static async create(car) {
      return await Request.post(ROUTES.CREATE, car)
         .then(result => {
            return result;
         })
         .catch(err => {
            throw err;
         });
   }

   static async updateEmployee(car) {
      return await Request.put(ROUTES.UPDATE, car)
         .then(result => {
            return result;
         })
         .catch(err => {
            throw err;
         });
   }

   static async deleteById(id) {
      return await Request.delete(
         ROUTES.DELETE_BY_ID + id
      )
         .then(result => {
            return result;
         })
         .catch(err => {
            throw err;
         });
   }
}
```

### With files tree generation by module
```bash
Files tree generation grouped by Type or by Module (t/m) ? [t] : m
        create: ./car
        create: ./car/carModel.js
        create: ./car/carController.js
        create: ./car/carRoutes.js
        create: ./client/API/car/carRoutes.js
        create: ./client/API/car/carRoutes.js
        create: ./client/API/car/carRoutes.js
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

Client side can be implemented additionally.

## Licence

Copyright (c) 2017 Damien Perrier
Licensed under the [MIT license](LICENSE).
