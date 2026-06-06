import mongoose from "mongoose";

const deliveryAddressSchema = mongoose.Schema({
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
        default: 'work'
    }
}, {timestamps: true});

const deliveryAddressModel = mongoose.model('deliveryAddress', deliveryAddressSchema);

export default deliveryAddressModel;