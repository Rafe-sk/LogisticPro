import mongoose from "mongoose";

const pickupAddressSchema = mongoose.Schema({
    orderID:{
        type:String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    contact:{
        type: String,
        required: true,
    },
    city:{
        type: String,
        required: true,
    },
    pincode:{
        type: Number,
        required: true,
    },
    state:{
        type: String,
        required: true,
    },
    saveAddress:{
        type: Boolean,
        default: false
    },
    addressType:{
        type: String,
        default: 'home'
    }
}, {timestamps: true});

const pickupAddressModel = mongoose.model('pickupAddress', pickupAddressSchema);

export default pickupAddressModel;