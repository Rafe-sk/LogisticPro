import mongoose from "mongoose";

const pickupAddressSchema = mongoose.Schema({
    orderID: {
        type: String,
        required: true,
    },
    senderName: {
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
        enum: ['home', 'office', 'warehouse'],
        default: 'home'
    },
    saveAddress: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const pickupAddressModel = mongoose.model('pickupAddress', pickupAddressSchema);

export default pickupAddressModel;