const Provider = require('../models/Provider');

//@desc Get list of providers
//@route GET /api/v1/providers 
//@access Public
exports.getProviders= async(req, res, next) => {
    try{

        const providers = await Provider.find();

        res.status(200).json({
            success : true,
            count : providers.length,
            data : providers
        })

    }catch(err){
        console.log(err);
        res.status(400).json({
            success: false,
            msg : 'Error has occured'
        });
    }
}

//@desc Create new provider
//@route POST /api/v1/providers
//@access PRIVATE
exports.createProvider = async (req,res,next) => {
    try{

        const provider = await Provider.create(req.body);

        res.status(201).json({
            success : true,
            data : provider
        })

    }catch(err){
        console.log(err);
        res.status(400).json({
            success : false,
            msg: 'Error has occured'
        })
    }
}

//@desc Update existing provider
//@route PUT /api/v1/providers/:id
//@access PRIVATE
exports.updateProvider = async (req,res,next) =>{
    try{

        const provider = await Provider.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators : true
        });

        if(!provider){
            res.status(400).json({
                success : false,
                msg: "Cannot find provider with specified ID"
            })
        }

        res.status(200).json({
            success: true,
            msg : `Updated Provider ${req.params.id}`,
            data: provider
        })



    }catch(err){
        console.log(err);
        res.status(400).json({
            success : false,
            msg : 'Error has occured'
        })
    }
}

