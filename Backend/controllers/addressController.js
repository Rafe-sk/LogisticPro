import pickupAddressModel from "../models/pickupAddressModel.js";
import deliveryAddressModel from "../models/deliveryAddressModel.js";

const createPickupAddress = async (req, res) => {
    const pickupAddress = req.body;
    try {
        await pickupAddressModel.create(pickupAddress);
        res.status(201).send({ message: "Pickup Address created successfully" });
    }
    catch (err) {
        console.log(err);
        return { message: "Some problem" };
    }
}

const createDeliveryAddress = async (req, res) => {
    const deliveryAddress = req.body;
    try {
        await deliveryAddressModel.create(deliveryAddress);
        res.status(201).send({ message: "Delivery Address created successfully" });
    }
    catch (err) {
        console.log(err);
        return { message: "Some problem" };
    }
}

const getPickupAddress = async (req, res) => {
    try {
        const orderID = req.body.orderID;
        console.log(req.body);
        const pickupAddress = await pickupAddressModel.findOne({ orderID: orderID });
        res.status(200).json(pickupAddress);
    }
    catch (err) {
        console.log(err);
        return { message: "Some problem" };
    }
}

const getDeliveryAddress = async (req, res) => {
    try {
        const orderID = req.body.orderID;
        console.log(req.body);
        const deliveryAddress = await deliveryAddressModel.findOne({ orderID: orderID });
        res.status(200).json(deliveryAddress);
    }
    catch (err) {
        console.log(err);
        return { message: "Some problem" };
    }
}


export { createPickupAddress, createDeliveryAddress, getPickupAddress, getDeliveryAddress };