import User from '../models/userModel.js';
import Order from '../models/orderModel.js';
import Parcel from '../models/parcelModel.js';
import Payment from '../models/paymentModel.js';

const resolvers = {
    Query: {
        getUser: async () => {
            return await User.find();
        },
        getUserByEmail: async (_, { email }) => {
            return await User.findOne({ email });
        },
        getOrder: async (_, { userid }) => {
            return await Order.findOne({ userid });
        },
        getOrdersByUser: async (_, { userid }) => {
            const orders = await Order.find({ userid }).sort({ createdAt: -1 });
            // For each order, find the associated payment to get price/status
            const orderDetails = await Promise.all(
                orders.map(async (order) => {
                    const payment = await Payment.findOne({ orderID: order.orderID });
                    return {
                        orderId: order.orderID,
                        date: order.createdAt ? order.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                        status: payment?.paymentStatus || 'Pending',
                        totalAmount: payment?.price || 0,
                    };
                })
            );
            return orderDetails;
        },
        getParcel: async (_, { orderID }) => {
            return await Parcel.findOne({ orderID: orderID });
        },
        getPayment: async (_, { orderID }) => {
            return await Payment.findOne({ orderID: orderID });
        }
    }
};

export default resolvers;