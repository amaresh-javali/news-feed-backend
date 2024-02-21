const User = require('../models/userModel')

const usernameSchema = {
    notEmpty: {
        errorMessage: 'username is required'
    }
}
const passwordSchema = {
    notEmpty: {
        errorMessage: 'password is required'
    },
    isStrongPassword: {
        options: { min: 8, max: 128, minUppercase: 1, minNumbers: 1 },
        errorMessage: "Password must include at least one uppercase, number"

    }
}
const emailRegisterdSchema = {
    notEmpty: {
        errorMessage: 'email is required'
    },
    isEmail: {
        errorMessage: 'invalid email formate'
    },
    custom: {
        options: async (value) => {
            const user = await User.findOne({ email: value })
            if (user) {
                throw new Error('email is already present')
            } else {
                return true
            }
        }
    }
}
const emailLoginSchema = {
    notEmpty: {
        errorMessage: 'email is required'
    },
    isEmail: {
        errorMessage: 'invalid email formate'
    }
}

const userRegisterValidationSchema = {
    username: usernameSchema,
    email: emailRegisterdSchema,
    password: passwordSchema
}

const userLoginValidationSchema = {
    email: emailLoginSchema,
    password: passwordSchema
}

module.exports={
    userRegisterValidationSchema,
    userLoginValidationSchema
}