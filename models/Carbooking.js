const mongoose = require('mongoose');

const CarbookingSchema = new mongoose.Schema({
 

    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true},


    provider: {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            unique:true,
            trim:true,
            maxlength:[50, 'Name can not be more than 50 characters']
        },
        address: { type: String, required: true },
        phone: { type: String, required: true, match: [/^\d{10}$/, 'Invalid phone number'] }
    },
    
    
    cars: {
        type: [
            {
                model: String,
                brand: String,
                pricePerDay: Number
            }
        ],
        default: [],
        required: true
    }
});




module.exports=mongoose.model('Carbooking', CarbookingSchema);