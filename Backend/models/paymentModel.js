import mongoose from "mongoose";

const paymentSchema = mongoose.Schema({
    orderID:{
        type:String,
        required: true,
    },
    price:{
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'Online'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending'
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true});

const paymentModel = mongoose.model('payment', paymentSchema);

export default paymentModel;