const mongoose = require('mongoose');

const edgeSchema = new mongoose.Schema({
    edgeId: { type: String, required: true }, // Unique identifier for the edge
    source: { type: mongoose.Schema.Types.ObjectId, ref: 'Node', required: true }, // Reference to the source Node
    target: { type: mongoose.Schema.Types.ObjectId, ref: 'Node', required: true }, // Reference to the target Node
    animated: { type: Boolean, default: false }, // Whether the edge is animated
    style: { 
        stroke: { type: String, default: '#334155' }, // Color of the edge
    },
    pathId: { type: mongoose.Schema.Types.ObjectId, ref: 'Path', required: true }, 
});

const edgeModel = mongoose.model('Edge', edgeSchema);
module.exports = edgeModel;