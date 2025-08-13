const mongoose = require('mongoose');

const pathSchema = new mongoose.Schema({
    title: String,
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the User document
    }, { timestamps: true });

const Path = mongoose.model('Path', pathSchema);
module.exports = Path;