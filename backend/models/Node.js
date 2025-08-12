const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
    nodeId: { type: String, required: true }, 
    type: { type: String, required: true }, // 'text', 'image', 'video', etc.
    position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true }
    }, // Position of the node in the graph
    data:{
        label:{ type: String},
        type: { type: String}, // 'text', 'image', 'video', etc.
        url: { type: String}, // URL for media content if applicable
        description: {type: String}, // Additional notes or description for the node
        pathId: {type : mongoose.Schema.Types.ObjectId, ref: 'Path'  }, // Reference to the Path document
        isCompleted: { type: Boolean, default: false }, // Indicates if the node is completed
    },
    measured:{
        height: { type: Number, default: 0 }, // Height of the node for layout purposes
        width: { type: Number, default: 0 } // Width of the node for layout purposes
    },
    createdAt: { type: Date, default: Date.now },
    // content: mongoose.Schema.Types.Mixed, // Can store different types of content

});

const Node = mongoose.model('Node', nodeSchema);
module.exports = Node;