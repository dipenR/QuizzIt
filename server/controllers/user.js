import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import jwtDecode from 'jwt-decode'
import User from '../models/User.js'
import { queryBuilder, paginateQuery } from "./util.js";

import { JWT_SECRET } from '../config.js';
import { validateSignUpInput, validateSignInInput, validateEmail } from '../utils/validators.js';

import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId;

export const signin = async (req, res) => {
    const { username, password } = req.body;
    const { errors, valid } = validateSignInInput(username, password);

    if (!valid) {
        return res.status(200).json({ errors: errors });
    }

    try {
        const user = await User.findOne({ username })

        if (!user) {
            errors.noUser = "User does not exist";
            return res.status(200).json({ errors: errors });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            errors.invalidCredentials = "Invalid credentials";
            return res.status(200).json({ errors: errors });
        }

        const token = jwt.sign({ user: { id: user._id, username: user.username, email: user.email, likes: user.likes } }, JWT_SECRET, { expiresIn: 3600 });

        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                likes: user.likes,
                token
            }
        })
    } catch (error) {
        res.status(404).json({ msg: error.message })
    }
}

export const tokenSignin = async (req, res) => {
    const { userToken } = req.body;
    const errors = {}
            
    try {
        const decodedToken= jwtDecode(userToken)
        const user = await User.findById(decodedToken.user.id)

        if (!user) {
            errors.noUser = "User does not exist";
            return res.status(200).json({ errors: errors });
        }

        const token = jwt.sign({ user: { id: user._id, username: user.username, email: user.email, likes: user.likes } }, JWT_SECRET, { expiresIn: 3600 });

        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                likes: user.likes,
                token
            }
        })
    } catch (error) {
        res.status(404).json({ msg: error.message })
    }
}

export const signup = async (req, res) => {
    const { username, email, password } = req.body
    const { errors, valid } = validateSignUpInput(username, email, password);

    if (!valid) {
        return res.status(200).json({ errors: errors });
    }

    try {
        const user = await User.findOne({ username })
        if (user) {
            errors.userExists = "User already exists";
            return res.status(200).json({ errors: errors });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt)

        const newUser = new User({
            username: username,
            email: email,
            password: hash,
        })

        const resUser = await newUser.save();
        if (!resUser) return res.status(404).json({ msg: "Something went wrong with registering the user" });

        const token = jwt.sign({ user: { id: newUser._id, username: newUser.username, email: newUser.email, likes: newUser.likes } }, JWT_SECRET, {
            expiresIn: 3600
        })

        res.status(200).json({
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            }
        })
    } catch (error) {
        res.status(404).json({ msg: error.message })
    }
}

export const editAccount = async (req, res) => {
    const { id, username, email, password, currentPassword } = req.body
    const errors = {}

    try {
        const user = await User.findById(id)
        if (!user) return res.status(404).json({ msg: "User doesn't exist" });

        var newUser;
        if (username != null) {
            if (username.trim() == "") {
                errors.emptyUsername = "Username cannot be empty"
                return res.status(200).json({ errors: errors });
            }

            // check if user with username already exists
            const existingUser = await User.findOne({ username: username })
            if (existingUser) {
                errors.existingUser = "User with username already exists"
                return res.status(200).json({ errors: errors });
            }

            // update user 
            newUser = await User.findByIdAndUpdate(id, { username: username }, { new: true })
        } else if (password != null) {
            if (currentPassword.trim() == "") {
                errors.emptyCurrentPassword = "Fields cannot be empty"
                return res.status(200).json({ errors: errors });
            }
            if (password.trim() == "") {
                errors.emptyNewPassword = "Fields cannot be empty"
                return res.status(200).json({ errors: errors });
            }

            // password confirmation before changing password
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                errors.invalidPassword = "Incorrect Current Password";
                return res.status(200).json({ errors: errors });
            }

            // update user with new password
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt)
            newUser = await User.findByIdAndUpdate(id, { password: hash }, { new: true })
        } else if (email != null) {
            // check if new email is valid 
            if (!validateEmail(email)) {
                errors.invalidEmail = "Invalid Email Address";
                return res.status(200).json({ errors: errors });
            }

            // update user with new email 
            newUser = await User.findByIdAndUpdate(id, { email: email }, { new: true })
        }

        if (!newUser) return res.status(200).json({ success: false })
        return res.status(200).json({
            success: true,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                likes: newUser.likes
            }
        })
    } catch (error) {
        res.status(404).json({ msg: error.message })
    }
}

export const deleteAccount = async (req, res) => {
    const { id, password } = req.body
    const errors = {}

    try {
        const user = await User.findById(id)
        if (!user) return res.status(404).json({ msg: "User doesn't exist" });

        // check if passwords match 
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            errors.invalidPassword = "Incorrect Password";
            return res.status(200).json({ errors: errors });
        }

        // delete the user
        const deletedUser = await User.findByIdAndDelete(id)
        if (!deletedUser) return res.status(404).json({ success: false })

        return res.status(200).json({
            success: true,
            user: {
                id: deletedUser._id,
                username: deletedUser.username,
                email: deletedUser.email,
            }
        })
    } catch (error) {
        res.status(404).json({ msg: error.message })
    }
}

export const getUsersByFilter = async (req, res) => {
    try {
        var query = queryBuilder(null, req.query, User)
        const { q, page, pages, totalCount } = await paginateQuery(query, User, req.query.limit, req.query.offset)

        if (page > pages) 
            return res.status(404).json({ msg: "Page doesn't exist" })
        
        const users = await q

        res.status(200).json({ 
            users,
            page,
            pages,
            totalCount
        });
    } catch (error) {
        res.status(404).json({ msg: error.message })
    }
}

export const getInbox = async (req, res) => {
    console.log("INSIDE INBOX")
    const skip = parseInt(req.query.offset) || 0
    const limit = parseInt(req.query.limit) || 5 

    try {
        const user = await User.findById(req.params.id).slice(`inbox`, [skip,limit])
        const u = await User.findById(req.params.id)

        const inboxTotalCount = u.inbox.length
        const inboxPages = Math.ceil(inboxTotalCount / limit)
        const inboxPage = (skip / limit) + 1

        console.log(inboxPage)
        res.status(200).json({ inbox: user.inbox, inboxPage, inboxPages, inboxTotalCount });
    } catch (error) {
        res.status(404).json({ msg: error.message }) 
    }
}

export const readNotification = async (req, res) => {
    console.log("INSIDE READ NOTIFICATION")
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.id, "inbox._id": req.params.nid },
            { $set: { "inbox.$.read": true } },
            { new: true }
        )
     
        const index = user.inbox.findIndex((i => i._id.toString() === req.params.nid))
        
        res.status(200).json({ 
            updatedNotification: user.inbox[index], 
            index });
    } catch (error) {
        res.status(404).json({ msg: error.message }) 
    }
}

// To change a field, say name, newValue should be
// newValue = {
//  name: "NewName"
// }
export const updateUser = async (req, res) => {
    const { newValue, userId } = req.body
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(200).json({ msg: "User doesn't exist" });

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: newValue },
            { new: true }
        );
        if (!updatedUser) return res.status(200).json({ msg: "Something went wrong with updating user" });

        res.status(200).json(
            {
                user: {
                    id: updatedUser._id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    likes: updatedUser.likes
                }
            });
    } catch (error) {
        res.status(404).json({ msg: error.message })
    }
}