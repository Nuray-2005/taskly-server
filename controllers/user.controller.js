import { db } from '../lib/dbConnect.js';
const collection = db.collection('users');


import { ObjectId } from 'mongodb';
export const getUser = async (req, res, next) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        const user = await collection.findOne(query);
        if (!user) {
            return next({ status: 404, message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        next({ status: 500, error });
    }
};

import bcrypt from 'bcrypt';
export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id){
        return next ({
            status: 401,
            message: 'You can only update your own account',
        });
    }
    try {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        const query = { _id: new ObjectId(req.params.id) };
        const data = {
            $set: {
                ...req.body,
                updateAt: new Date().toISOString(),
            },
        };
        const options = {
            returnDocument: 'after',
        };
        const updatedUser = await collection.findOneAndUpdate(query, data,
            options);
        const { password: pass, updatedAt, createdAt, ...rest } = updatedUser;
        res.status(200).json(updatedUser);
    } catch (error) {
        next({ status: 500, error });
    }
};
export const deleteUser = async (req, res, next) => {
    if (req,user.id !== req.params.id){
        return next({
            status: 401,
            message: 'You can only update your own account',
        });
    }
    try {
        const query = { _id: new ObjectId(req.params.id) };
        await collection.deleteOne(query);
        res.status(200).json({ message: 'User has been deleted!' });
    } catch (error) {
        next({ status: 500, error });
    }
};

