import parcelModel from "../models/parcelModel.js";

const createParcel = async (req, res) => {
    const parcel = req.body;
    try {
        await parcelModel.create(parcel);
        res.status(201).send({ message: "Parcel created successfully" });
    }
    catch (err) {
        console.log(err);
        return { message: "Some problem" };
    }
}

const getParcels = async (req, res) => {
    try {
        const orderID = req.body.orderID;
        const parcels = await parcelModel.find({ orderID: orderID });
        res.status(200).send(parcels);
    }
    catch (err) {
        console.log(err);
        return { message: "Some problem" };
    }
}

export  {createParcel, getParcels};