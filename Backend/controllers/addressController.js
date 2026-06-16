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
        return res.status(500).json({ message: "Some problem", error: err.message });
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
        return res.status(500).json({ message: "Some problem", error: err.message });
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
        return res.status(500).json({ message: "Some problem", error: err.message });
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
        return res.status(500).json({ message: "Some problem", error: err.message });
    }
}

const updatePickupAddress = async (req, res) => {
    try {
        const { addressId, ...updateData } = req.body;
        if (!addressId) {
            return res.status(400).json({ message: "Address ID is required" });
        }
        const updated = await pickupAddressModel.findByIdAndUpdate(
            addressId,
            { $set: updateData },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ message: "Pickup address not found" });
        }
        res.status(200).json({ message: "Pickup address updated successfully", address: updated });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Some problem" });
    }
}

const deletePickupAddress = async (req, res) => {
    try {
        const addressId = req.body.addressId;
        if (!addressId) {
            return res.status(400).json({ message: "Address ID is required" });
        }
        const deleted = await pickupAddressModel.findByIdAndDelete(addressId);
        if (!deleted) {
            return res.status(404).json({ message: "Pickup address not found" });
        }
        res.status(200).json({ message: "Pickup address deleted successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Some problem" });
    }
}

const updateDeliveryAddress = async (req, res) => {
    try {
        const { addressId, ...updateData } = req.body;
        if (!addressId) {
            return res.status(400).json({ message: "Address ID is required" });
        }
        const updated = await deliveryAddressModel.findByIdAndUpdate(
            addressId,
            { $set: updateData },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ message: "Delivery address not found" });
        }
        res.status(200).json({ message: "Delivery address updated successfully", address: updated });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Some problem" });
    }
}

const deleteDeliveryAddress = async (req, res) => {
    try {
        const addressId = req.body.addressId;
        if (!addressId) {
            return res.status(400).json({ message: "Address ID is required" });
        }
        const deleted = await deliveryAddressModel.findByIdAndDelete(addressId);
        if (!deleted) {
            return res.status(404).json({ message: "Delivery address not found" });
        }
        res.status(200).json({ message: "Delivery address deleted successfully" });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Some problem" });
    }
}

export { createPickupAddress, createDeliveryAddress, getPickupAddress, getDeliveryAddress, updatePickupAddress, deletePickupAddress, updateDeliveryAddress, deleteDeliveryAddress };