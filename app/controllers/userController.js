const { pick } = require('lodash')
const { validationResult } = require('express-validator')
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userCltr = {}

userCltr.register = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const body = pick(req.body, ['username', 'email', 'password'])
        if (body.email === 'javaliamaresh@gmail.com') {
            body.role = 'admin'
        } 
        const user = new User(body)
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(user.password, salt)
        user.password = hashedPassword
        const userDoc = await user.save()
        res.status(200).json(userDoc)
    } catch (e) {
        res.status(500).json({ e: 'internal server error' })
    }
}

userCltr.login = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const body = pick(req.body, ['email', 'password'])
        const user = await User.findOne({ email: body.email })
        if (!user) {
            return res.json({ error: 'invalid credentials' })
        }
        const result = await bcrypt.compare(body.password, user.password)
        if (!result) {
            return res.json({ error: 'invalid credentials' })
        }
        const tokenData = { _id: user._id }
        const token = jwt.sign(tokenData, process.env.JWT_SECRET)
        res.json({ token: `Bearer ${token}` })
    } catch (error) {
        res.status(500).json({ error: 'internal server error' })
    }
}

userCltr.account = async(req, res) =>{
    try{
        const user = await User.findById(req.user._id)
        res.json(pick(user, ['id','username', 'email', 'role']))
    }catch(e) {
        res.status(500).json({e: 'internal server error'})
    }
}



module.exports = userCltr