const router = require('express').Router();
const{ getNodeById, createNode, updateNode, deleteNode } = require('../controller/nodeController');

router.get('/:id', getNodeById);
router.patch('/update/:id', updateNode);
// router.delete('/node/:id', deleteNode);

module.exports = router;