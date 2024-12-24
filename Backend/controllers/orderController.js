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
        return {message: "Some problem"};
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
        return {message: "Some problem"};
    }
}

export  {createOrder, getOrder};