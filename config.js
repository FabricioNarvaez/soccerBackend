const dotenv = require('dotenv');

dotenv.config();

const config = {
  mongodbURL: process.env.NODE_ENV === 'production' ? setULR(process.env.URL_MONGODB_PROD) : setULR(process.env.URL_MONGODB_DEV)
};

function setULR(env){
    console.log(`Service: ${process.env.NODE_ENV}`);
    return env;
}

module.exports = config;
