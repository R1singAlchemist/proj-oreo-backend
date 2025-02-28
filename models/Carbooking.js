const mongoose = require('mongoose');

const CarbookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique:true,
        trim:true,
        maxlength:[50, 'Name can not be more than 50 characters']
    },
    address: { type: String, required: true },
    phone: { 
        type: String, 
        required: true, 
        unique: true,
        match: [/^\d{10}$/, 'Please enter a valid phone number (10 digits)']
    },   
    cars: {
        type: [
            {
                model: String,
                brand: String,
                pricePerDay: Number,
                availability: { type: Boolean, default: true }
            }
        ],
        default: [],
        validate: [arrayLimit, 'A user can book up to 3 cars only']
    }
}, { timestamps: true });


function arrayLimit(val) {
    return val.length <= 3; 
}


module.exports=mongoose.model('Carbooking', CarbookingSchema);