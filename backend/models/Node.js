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
        notes: {type: String}, // Additional notes or description for the node
        pathId: {type : mongoose.Schema.Types.ObjectId, ref: 'Path'  }, // Reference to the Path document
        isCompleted: { type: Boolean, default: false }, // Indicates if the node is completed
    },
    measured:{
        height: { type: Number, default: 0 }, // Height of the node for layout purposes
        width: { type: Number, default: 0 } // Width of the node for layout purposes
    },
    imageUrl: { type: String , default: ''},
    summary: { type: String, default: '' },  
    createdAt: { type: Date, default: Date.now },
    // content: mongoose.Schema.Types.Mixed, // Can store different types of content

});

// async function updatePathProgress(doc) {
//     const pathId = doc.pathId;
//     if (!pathId) return;
  
//     // Find all nodes for the given path
//     const nodes = await mongoose.model('Node').find({ pathId: pathId });
//     if (nodes.length === 0) {
//       await Path.findByIdAndUpdate(pathId, { progress: 0 });
//       return;
//     }
  
//     // Calculate progress
//     const completedNodes = nodes.filter(node => node.isCompleted).length;
//     const progress = Math.round((completedNodes / nodes.length) * 100);
  
//     // Update the parent Path document
//     await Path.findByIdAndUpdate(pathId, { progress: progress });
//   }
  
//   // Attach the middleware to 'save' and 'remove' events
//   NodeSchema.post('save', async function() {
//     await updatePathProgress(this);
//   });
  
//   // We need a special hook for findByIdAndUpdate
//   NodeSchema.post('findOneAndUpdate', async function(doc) {
//     if (doc) {
//       await updatePathProgress(doc);
//     }
//   });

const Node = mongoose.model('Node', nodeSchema);
module.exports = Node;