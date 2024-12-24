import express from 'express';
import cors from 'cors';
import connectDB from './dbConnection.js';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import typeDefs from './graphql/schema.js';
import resolvers from './graphql/resolver.js';

import userRouter from './routes/userRoute.js';
import orderRouter from './routes/orderRoute.js';
import addressRouter from './routes/addressRoute.js';
import parcelRouter from './routes/parcelRoute.js';
import paymentRouter from './routes/paymentRoute.js';

connectDB()
const app = express()
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers
});


app.use(cors());
app.use(express.json())

await apolloServer.start();

app.use('/user', userRouter);
app.use('/order', orderRouter);
app.use('/address', addressRouter);
app.use('/parcel', parcelRouter);
app.use('/payment', paymentRouter);

app.use('/graphql', expressMiddleware(apolloServer));

app.listen(8000, () => {
  console.log('Server is running on port 8000')
})