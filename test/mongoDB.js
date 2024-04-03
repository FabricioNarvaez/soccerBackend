const mongoose = require('mongoose');

beforeAll(async () => {
    await mongoose.connect(process.env.URL_MONGODB);
});

afterAll(async () => {
    await mongoose.disconnect();
});