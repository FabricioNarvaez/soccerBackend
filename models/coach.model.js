const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = require('./common.model');

const coachSchema = new Schema(userSchema);

module.exports = mongoose.model('coaches', coachSchema);
