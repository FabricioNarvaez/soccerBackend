const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = require('./common.model');

const adminSchema = new Schema(userSchema);

module.exports = mongoose.model('admins', adminSchema);
