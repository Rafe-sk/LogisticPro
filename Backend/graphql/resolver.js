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
        getParcel: async (_, { orderID }) => {
            return await Parcel.findOne({ orderID: orderID });
        },
        getPayment: async (_, { orderID }) => {
            return await Payment.findOne({ orderID: orderID });
        }
    }
};

export default resolvers;