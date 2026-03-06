const dotenv = require('dotenv');

dotenv.config();

const config = {
  mongodbURL: process.env.NODE_ENV && process.env.NODE_ENV === 'development' ?  setULR(process.env.URL_MONGODB_DEV) : setULR(process.env.URL_MONGODB_PROD)
};

function setULR(env){
    console.log(`Service: ${process.env.NODE_ENV}`);
    return env;
}

module.exports = config;
