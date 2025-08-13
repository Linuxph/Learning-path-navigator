const axios = require('axios');
const cheerio = require('cheerio');
const Path = require("../models/path");
const Node = require("../models/Node");
const Edge = require("../models/edge");
const { default: mongoose } = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const getAllPaths = async (req, res) => {
  try {
    const paths = await Path.find();
    res.status(200).json(paths);
  } catch (error) {
    res.status(500).json({ message: "Error fetching paths", error });
  }
};

async function fetchMetadata(url) {
    if (!url || !url.startsWith('http')) {
      return { detectedType: 'note', summary: '', imageUrl: '' };
    }
    try {
      const { data, headers } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const contentType = headers['content-type'];
  
      if (contentType && contentType.startsWith('image/')) {
        return { detectedType: 'image', imageUrl: url, summary: '' };
      }
  
      const $ = cheerio.load(data);
      const ogType = $('meta[property="og:type"]').attr('content') || 'article';
      const imageUrl = $('meta[property="og:image"]').attr('content') || '';
      const summary = $('meta[property="og:description"]').attr('content') || $('p').first().text() || '';
  
      let detectedType = 'article';
      if (ogType.includes('video')) detectedType = 'video';
      if (ogType.includes('image')) detectedType = 'image';
  
      return { detectedType, imageUrl, summary: summary.substring(0, 200) }; // Limit summary length
    } catch (error) {
      console.error(`Could not fetch metadata for ${url}:`, error.message);
      return { detectedType: 'article', imageUrl: '', summary: 'Could not load preview.' };
    }
  }

const createPath = async (req, res) => {
  const { title, nodes, edges, userId } = req.body;
  try {
    const alreadyExists = await Path.findOne({ title: title, userId: userId });
    
    if( alreadyExists ) {
        return res.status(400).json({ message: "Path with this title already exists for this user" });
    }

    const newPath = await Path.create({ title: title, userId: userId });

    // Create nodes and edges associated with the path
    const savedNodes = await Promise.all(nodes.map(async (node) => {
        const metadata = await fetchMetadata(node.data.url);  

        const newNode = {
          nodeId: node.id,
          type: node.type,
          position: {
            x: node.position.x,
            y: node.position.y,
          },
          data: {
            label: node.data.label,
            type: metadata.type,
            url: node.data.url,
            notes: node.data.notes,
            pathId: new mongoose.Types.ObjectId(newPath._id),
          },
          measured: {
            height: node.measured.height,
            width: node.measured.width,
          },
          summary: metadata.summary,
          imageUrl: metadata.imageUrl,
        };

        return new Node(newNode).save();
      }));
    

    if (edges && edges.length > 0) {
      const edgePromises = edges.map((edge) => {
        savedNodes.map((node) => {
          if (node.nodeId === edge.source) {
            edge.source = node._id;
          }
          if (node.nodeId === edge.target) {
            edge.target = node._id;
          }
        });
        const newEdge = {
          edgeId: edge.id,
          source: new mongoose.Types.ObjectId(edge.source),
          target: new mongoose.Types.ObjectId(edge.target),
          type: edge.type,
          animated: edge.animated,
          style: {
            stroke: edge.style.stroke,
          },
          sourceHandle: edge.sourceHandle, 
          targetHandle: edge.targetHandle,
          pathId: new mongoose.Types.ObjectId(newPath._id),
        };
        return new Edge(newEdge).save();
      });
      await Promise.all(edgePromises);
    }

    res.status(201).json(newPath);
  } catch (error) {
    res.status(500).json({ message: "Error creating path", error });
  }
};

const getPathById = async (req, res) => {
  try {
    const path = await Path.findById({
      _id: new mongoose.Types.ObjectId(req.params.id),
    });
    if (!path) {
      return res.status(404).json({ message: "Path not found" });
    }
    // Fetch associated nodes and edges
    const nodes = await Node.find({ "data.pathId": req.params.id });
    const edges = await Edge.find({ pathId: req.params.id });

    res.status(200).json({ path, nodes, edges });
  } catch (error) {
    res.status(500).json({ message: "Error fetching path", error });
  }
};

const generateQuiz = async (req, res) => {
    try {
      // 1. Initialize the AI client
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
      // 2. Fetch the path and its nodes
      const path = await Path.findById(req.params.pathId);
      const nodes = await Node.find({ pathId: req.params.pathId });
  
      if (!path || nodes.length === 0) {
        return res.status(404).json({ message: "Path or nodes not found" });
      }
  
      // 3. Construct a detailed prompt for the AI
      const topics = nodes.map(n => `- ${n.data.label}: ${n.summary}`).join('\n');
      const prompt = `
        You are an expert tutor creating a quiz. Based on the learning roadmap titled "${path.title}" and its topics below, generate 10 multiple-choice questions.
  
        TOPICS:
        ${topics}
  
        IMPORTANT: Respond with ONLY a valid JSON array. Do not include any text before or after the array. The format must be:
        [
          {
            "question": "Your question here?",
            "options": {
              "A": "Option A",
              "B": "Option B",
              "C": "Option C",
              "D": "Option D"
            },
            "answer": "C"
          }
        ]
      `;
  
      // 4. Call the AI and get the response
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
  
      // 5. Clean and parse the JSON response
      const jsonResponse = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, ''));
  
      res.status(200).json(jsonResponse);
    } catch (error) {
      console.error("AI quiz generation error:", error);
      res.status(500).json({ message: "Failed to generate quiz", error: error.message });
    }
  };

// const updatePath = async (req, res) => {
//   try {
//     const path = await Path.findById(req.params.id);
//     if (!path) {
//       return res.status(404).json({ message: "Path not found" });
//     }
//     Object.assign(path, req.body);
//     await path.save();
//     res.status(200).json({ path, msg: "Path updated successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating path", error });
//   }
// };

// const deletePath = async (req, res) => {
//   try {
//     const path = await Path.findByIdAndDelete(req.params.id);
//     if (!path) {
//       return res.status(404).json({ message: "Path not found" });
//     }

//     // Also delete all nodes associated with this path
//     await Node.deleteMany({ pathId: req.params.id });
//     res.status(200).json({ message: "Path deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting path", error });
//   }
// };

module.exports = {
  getAllPaths,
  getPathById,
  createPath,
  generateQuiz,
};
