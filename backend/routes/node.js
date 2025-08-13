const router = require('express').Router();
const{ getNodeById, createNode, updateNode, deleteNode } = require('../controller/nodeController');

router.get('/node/:id', getNodeById);
router.patch('/node/:id', updateNode);
router.delete('/node/:id', deleteNode);

module.exports = router;