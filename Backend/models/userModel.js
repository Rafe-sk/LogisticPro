import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userid:{
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'delivery agent'],
    },
    address:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    pincode:{
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    },
    profilePic:{
        type: String,
        default: 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI='
    }
}, {timestamps: true});

const userModel = mongoose.model('user', userSchema);
export default userModel;