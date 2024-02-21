require('dotenv').config()
const express = require('express')
const cors = require('cors')
const port = 3030
const app = express()
const configureDB = require('./config/db')
const { checkSchema } = require('express-validator')
const { userRegisterValidationSchema, userLoginValidationSchema } = require('./app/helpers/user-validation')
const userCltr = require('./app/controllers/userController')
const authenticationUser = require('./app/middlewares/authentication')
const categoryCltr = require('./app/controllers/categoryController')
const feedCltr = require('./app/controllers/newsfeedController')
const authorization = require('./app/middlewares/authorization')
configureDB()
app.use(express.json())
app.use(cors())


app.post('/api/user/register', checkSchema(userRegisterValidationSchema), userCltr.register)
app.post('/api/user/login', checkSchema(userLoginValidationSchema), userCltr.login)
app.get('/api/user/account', authenticationUser, userCltr.account)

//Category
app.get('/api/getAll', authenticationUser,  categoryCltr.getAll)
app.post('/api/addCategory', authenticationUser, authorization, categoryCltr.addCat)
app.delete('/api/deleteCategory/:id', authenticationUser, authorization, categoryCltr.delete)

//get newsFeed
app.get('/api/feeds/:id', feedCltr.get)
app.listen(port, () => {
    console.log('running port on', port)
})

