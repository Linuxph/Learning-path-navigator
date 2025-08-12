const e = require('express');
const Node = require('../models/Node');

// Get all nodes
exports.getAllNodes = async (req, res) => {
    try {
        const nodes = await Node.find();
        res.status(200).json(nodes);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
        const updatedNode = await Node.updateOne({ _id: id }, { $set: newData });
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