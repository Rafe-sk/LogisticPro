import { gql } from 'graphql-tag';

const typeDefs = gql`
    type User {
        name: String!
        email: String!
        phone: String!
        address: String!
        city: String!
        pincode: String!
        state: String!
    }

    type Order {
        userid: String!
        orderID: String!
    }

    enum ParcelType {
        document
        Box
        Suitcase
        Backpack
        Other
    }

    type Parcel {
        id: ID!
        orderID: String!
        parcelType: ParcelType!
        weight: Float!
        length: Float
        breadth: Float
        height: Float
        fragile: Boolean
        description: String
    }

    type Payment {
        orderID: String!
        price: Float!
        paymentMethod: String!
        paymentStatus: String!
        date: String!
    }

    type Query {
        getUser: [User]
        getUserByEmail(email: String!): User
        getOrder(userid: String!): Order
        getParcel(orderID: String!): Parcel
        getPayment(orderID: String!): Payment
    }
`;

export default typeDefs;
