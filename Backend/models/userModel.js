import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userid:{
        type: String,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,       // bcrypt hash — only set on register, not on profileSetup
    },
    phone: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'delivery agent'],
    },
    address:{
        type: String,
    },
    city:{
        type: String,
    },
    pincode:{
        type: String,
    },
    state:{
        type: String,
    },
    profilePic:{
        type: String,
        default: 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI='
    },
    resetToken: {
        type: String,
        default: null
    },
    resetTokenExpiry: {
        type: Date,
        default: null
    }
}, {timestamps: true});

const userModel = mongoose.model('user', userSchema);
export default userModel;