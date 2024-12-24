import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    userid:{
        type:String,
        required: true,
    },
    orderID:{
        type: String,
        required: true,
        unique: true,
        default: function() {
            return 'ORD' + Math.random().toString(36).substr(2, 9); // Generate unique order ID
        }
    }
}, {timestamps: true});

const orderModel = mongoose.model('Order', orderSchema);

export default orderModel;