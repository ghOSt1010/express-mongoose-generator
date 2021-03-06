//var {pluralName} = require({modelPath});
var {modelNameService} = require({modelServicePath})

class {modelNameController} {
    
    static async list(req, res, err){

        try {
            const {id} = req.query
            const data = await {modelNameService}.getAll(id)
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
            var data =  await {modelNameService}.getByID(id)
            return await res.status(200).json(data);
        }catch(err){
            return await res.satus(500).json(err)
        }
        
    }

    static async create(req, res, err){

        var {name} = req.body;

        if (!{name}) {
            return await res.status(402).json({
                message: 'MISSING_ARGUMENT'
            });
        }

        try{
            var data =  await {modelNameService}.create({name})
            return await res.status(201).json(data);
        }catch(err){
            return await res.satus(500).json(err)
        }
    }

    static async update(req, res, err){

        var {name} = req.body;

        if (!{name}) {
            return await res.status(402).json({
                message: 'MISSING_ARGUMENT'
            });
        }

        try{
            var data =  await {modelNameService}.update({name})
            return await res.status(200).json(data);
        }catch(err){
            return await res.satus(500).json(err)
        }

    }

    static async remove(req, res, err){
        if (!req.params.id) {
         return await res.status(402).json({
            message: 'MISSING_ARGUMENT',
         });
        }

        var id = req.params.id;

        try {
            var data = await {modelNameService}.delete(id);
            return await res.status(200).json(data);
        } catch (err) {
            return await res.status(500).json(err);
        }
    }
}

module.exports = {modelNameController} 