import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';


const createOrder = async ( req,res) => {

    const order = req.body;
    try{
        await orderModel.create(order);
        res.status(201).send({message: "Order created successfully"});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: "Some problem", error: err.message});
    }
}

const getOrder = async (req, res) => {
    try{
        const userid = req.body.userid;
        const order = await orderModel.find({userid: userid});
        console.log(order);
        res.status(200).send(order);
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: "Some problem", error: err.message});
    }
}

const getOrderByOrderID = async (req, res) => {
    try{
        const orderID = req.body.orderID;
        if (!orderID) {
            return res.status(400).json({ message: "orderID is required" });
        }
        const order = await orderModel.findOne({ orderID: orderID });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: "Some problem"});
    }
}

const cancelOrder = async (req, res) => {
    try {
        const { orderID } = req.body;
        if (!orderID) {
            return res.status(400).json({ message: "orderID is required" });
        }
        const order = await orderModel.findOne({ orderID: orderID });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (order.status === 'delivered' || order.status === 'cancelled') {
            return res.status(400).json({ message: `Cannot cancel order with status: ${order.status}` });
        }
        const cancelled = await orderModel.findOneAndUpdate(
            { orderID: orderID },
            { $set: { status: 'cancelled' } },
            { new: true }
        );
        res.status(200).json({ message: "Order cancelled successfully", order: cancelled });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Some problem" });
    }
}

export  {createOrder, getOrder, getOrderByOrderID, cancelOrder};