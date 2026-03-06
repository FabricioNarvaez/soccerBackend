const mongoose = require('mongoose');

beforeAll(async () => {
    await mongoose.connect(process.env.URL_MONGODB_DEV);
});

afterAll(async () => {
    await mongoose.disconnect();
});