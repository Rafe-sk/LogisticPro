import userModel from "../models/userModel.js";

export async function createUser(req, res){
    let user = req.body;

    try {
        await userModel.create(user);
        res.status(201).send({message:"User created successfully"});
    }
    catch(err){
        console.log(err);
        res.status(500).send({message:"Some Problem"});
    }
}