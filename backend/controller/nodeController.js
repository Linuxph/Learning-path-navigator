const e = require('express');
const Node = require('../models/Node');

exports.getNodeById = async (req, res) => {
    try {
        const nodeId  = req.params.id;
        const node = await Node.findById({_id: nodeId});
        
        if (!node) {
          return res.status(404).json({ message: 'Node not found' });
        }

        res.status(200).json({ node });
      } catch (error) {
        res.status(500).json({ message: 'Error fetching node', error: error.message });
      }
};

// Create a new node
exports.createNode = async (req, res) => {
    const node = new Node(req.body);
    try {
        const savedNode = await node.save();
        res.status(201).json(savedNode);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a node
exports.updateNode = async (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    try {
        const updatedNode = await Node.findOneAndUpdate({ _id: id }, { $set: {"data.isCompleted":Object.values(newData)[0]} });

        if (updatedNode.modifiedCount === 0) {
            return res.status(404).json({ message: 'Node not found or no changes made' });
        }

        res.status(200).json(updatedNode);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Delete a node
exports.deleteNode = async (req, res) => {
    const { id } = req.params;
    try {
        await Node.deleteOne({ _id: id });
        res.status(200).json({ message: 'Node deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};