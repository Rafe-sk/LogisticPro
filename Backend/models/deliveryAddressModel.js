import mongoose from "mongoose";

const deliveryAddressSchema = mongoose.Schema({
    orderID: {
        type: String,
        required: true,
    },
    recipientName: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        required: true,
    },
    landmark: {
        type: String,
        default: ''
    },
    contact: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    pincode: {
        type: Number,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    addressType: {
        type: String,
        enum: ['home', 'office'],
        default: 'home'
    },
    deliveryInstructions: {
        type: String,
        default: ''
    },
    saveAddress: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const deliveryAddressModel = mongoose.model('deliveryAddress', deliveryAddressSchema);

export default deliveryAddressModel;