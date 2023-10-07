const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    url: process.env.MONGODB_URL,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
};