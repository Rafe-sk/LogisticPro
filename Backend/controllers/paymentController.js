import paymentModel from "../models/paymentModel.js";

const createPayment = async (req, res) => {
    const payment = req.body;
    try {
        await paymentModel.create(payment);
        res.status(201).send({ message: "Payment created successfully" });
    }
    catch (err) {
        console.log(err);
        return { message: "Some problem" };
    }
}

const getPayment = async (req, res) => {
    try {
        const orderID = req.body.orderID
        const payment = await paymentModel.find();
        res.status(200).send(payment);
    }
    catch (err) {
        console.log(err);
        return { message: "Some problem" };
    }
}

export  {createPayment, getPayment};