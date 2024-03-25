const mongoose = require('mongoose')
require('colors');

const connectDB = async () => {
    mongoose
        .connect(process.env.MONGO_URI)
        .then(() => console.log('[success] MongoDB connected'.green.bold))
        .catch((err) => console.log('[error] ' + err.red.bold))
}

module.exports = connectDB
