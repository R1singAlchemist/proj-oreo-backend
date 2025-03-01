const mongoose = require('mongoose');

const CarbookingSchema = new mongoose.Schema({
 

    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    provider: {
        type : mongoose.Schema.Types.ObjectId,
        ref:"Provider",
        required: [true, 'Please specify a provider']
    },
    bookingDate: {
        type:Date,
        required:[true, 'Please specify a Date']
    }
    
});




module.exports=mongoose.model('Carbooking', CarbookingSchema);