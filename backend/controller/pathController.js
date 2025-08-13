const Path = require('../models/path');
const Node = require('../models/Node');
const Edge = require('../models/Edge');
const { default: mongoose } = require('mongoose');

const getAllPaths = async (req, res) => {
    try {
        const paths = await Path.find();
        res.status(200).json(paths);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching paths', error });
    }
}

const createPath = async (req, res) => {
    const {title,nodes,edges,userId} = req.body;
    try {
        
        const newPath = await Path.create({title:title, userId:userId}); 
        
        // Create nodes and edges associated with the path
        let savedNodes = [];
        if (nodes && nodes.length > 0) {
            const nodePromises = nodes.map(node => {
                const newNode = {
                    nodeId: node.id, 
                    type: node.type,
                    position: {
                        x: node.position.x,
                        y: node.position.y
                    }, 
                    data:{
                        label: node.data.label,
                        type: node.data.type, 
                        url: node.data.url, 
                        description: node.data.notes , 
                        pathId: new mongoose.Types.ObjectId(newPath._id), 
                    },
                    measured:{
                        height: node.measured.height,
                        width: node.measured.width 
                    },
                }

                return new Node(newNode).save();
            });
            savedNodes = await Promise.all(nodePromises);
        }


        if (edges && edges.length > 0) {
            const edgePromises = edges.map(edge => {
                savedNodes.map(node => {
                    if (node.nodeId === edge.source) {
                        edge.source = node._id; 
                    }
                    if (node.nodeId === edge.target) {
                        edge.target = node._id; 
                    }
                })
                const newEdge = {
                    edgeId: edge.id, 
                    source: new mongoose.Types.ObjectId(edge.source), 
                    target: new mongoose.Types.ObjectId(edge.target), 
                    type: edge.type,
                    animated: edge.animated,
                    style: {
                        stroke: edge.style.stroke
                    },
                    pathId: new mongoose.Types.ObjectId(newPath._id), 
                }
                return new Edge(newEdge).save();
            });
            await Promise.all(edgePromises);
        }
        
        res.status(201).json(newPath);
    } catch (error) {
        console.error("Error creating path:", error);
        res.status(500).json({ message: 'Error creating path', error });
    }
}

const getPathById = async (req, res) => {
    try {
        const path = await Path.findById({_id :new mongoose.Types.ObjectId( req.params.id)});
        if (!path) {
            return res.status(404).json({ message: 'Path not found' });
        }
        // Fetch associated nodes and edges
        const nodes = await Node.find({ 'data.pathId': req.params.id });
        const edges = await Edge.find({ 'pathId': req.params.id });

        res.status(200).json({path, nodes, edges});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching path', error });
    }
}

const updatePath = async (req, res) => {
    try {
        const path = await Path.findById(req.params.id);
        if(!path){
            return res.status(404).json({ message: 'Path not found' });
        }
        Object.assign(path, req.body);
        await path.save();
        res.status(200).json({path,msg:'Path updated successfully'});
    } catch (error) {
        res.status(500).json({ message: 'Error updating path', error });        
    }
}


const deletePath = async (req, res) => {
    try {
        const path = await Path.findByIdAndDelete(req.params.id);
        if (!path) {
            return res.status(404).json({ message: 'Path not found' });
        }

        // Also delete all nodes associated with this path
        await Node.deleteMany({ pathId: req.params.id });
        res.status(200).json({ message: 'Path deleted successfully' });
    
    } catch (error) {
        res.status(500).json({ message: 'Error deleting path', error });
        
    }
}

module.exports = {
    getAllPaths,
    getPathById,
    createPath,
    updatePath,
    deletePath
}