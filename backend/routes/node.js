const router = require('express').Router();
const{ getAllNodes, createNode, updateNode, deleteNode } = require('../controller/nodeController');

router.get('/node', getAllNodes);
router.put('/node/:id', updateNode);
router.delete('/node/:id', deleteNode);

module.exports = router;