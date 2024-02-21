const mongoose = require('mongoose')

const configureDB = async () => {
    try {
        const db = await mongoose.connect('mongodb://127.0.0.1:27017/times-of-india-task')
        console.log('connected to db')
    } catch (e) {
        console.log('errors to connect db')
    }
} 

module.exports = configureDB