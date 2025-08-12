const mongoose = require('mongoose');

const pathSchema = new mongoose.Schema({
    title: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the User document
});

const Path = mongoose.model('Path', pathSchema);
module.exports = Path;