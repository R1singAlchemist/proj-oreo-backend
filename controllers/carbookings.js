const Carbooking = require("../models/Carbooking");
const Provider = require("../models/Provider");

//@desc Get all carbookings
//@route GET /api/v1/carbookings
//@access Public
exports.getCarbookings=async (req,res,next)=>{

    try{
        const carbookings = await Carbooking.find();

        res.status(200).json({
            success:true,
            count:carbookings.length,
            data:carbookings
        });
    }
    catch(err){
        res.status(400).json({
            success:false
        })
    }
};

//@desc Get single carbooking
//@route Get /api/v1/carbookings/:id
//@access Public
exports.getCarbooking=async(req,res,next)=>{

    try{
        const carbooking = await Carbooking.findById(req.params.id);

        if(!carbooking){
            return res.status(400).json({
                success:false,
                msg:"No Carbooking with specified ID"
            })
        }

        res.status(200).json({
            success:true,
            data:carbooking
        });

    }
    catch(err){
        console.log(err);
        res.status(400).json({
            success:false,
            msg:"Error occured"
        })
    }
};

//@desc Creat new Carbooking
//@route POST /api/v1/carbookings
//@access Private
exports.createCarbooking= async (req,res,next)=>{

    const provider = Provider.find({
        name : `${req.body.provider}`
    });

    if(!provider){
        res.status(400).json({
            success : false,
            msg: "No Provider with specified name"
        })
    }else{
        req.body.provider = provider._id;
    }
    
    
    //const carbooking = await Carbooking.create(req.body);

    res.status(201).json({
        success: true,
        msg : `${req.body.provider}`
        //data:carbooking
    })

};

//@desc Update carbooking
//@route PUT /api/v1/carbookings/:id
//@access Private
exports.updateCarbooking=async(req,res,next)=>{
    //res.status(200).json({success:true, msg:'Update hospital '+req.params.id});
    try{
        const carbooking = await Carbooking.findByIdAndUpdate(req.params.id, req.body, {
            new : true,
            runValidators:true
        });

        if(!carbooking){
            return res.status(400).json({
                success:false
            })
        }

        res.status(200).json({
            success:true,
            data:carbooking
        });
    }catch(err){
        res.status(400).json({
            success:false
        });
    }
};

//@desc delete carbooking
//@route DELETE /api/v1/carbookings/:id
//@access Private
exports.deleteCarbookings=async(req,res,next)=>{
    //res.status(200).json({success:true, msg : 'Delete hospital '+req.params.id});
    try{
        const carbooking = await Carbooking.findByIdAndDelete(req.params.id);

        if(!carbooking){
            return res.status(400).json({
                success:false
            })
        }

        res.status(200).json({
            success:true,
            data:{}
        })
    }catch(err){
        res.status(400).json({
            success:false
        })
    }
};

