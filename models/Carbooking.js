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
    phone: { type: String, required: true, unique: true },
    cars: [
        {
            model: String,
            brand: String,
            pricePerDay: Number,
            availability: { type: Boolean, default: true }
        }
    ]
});

module.exports=mongoose.model('Carbooking', CarbookingSchema);