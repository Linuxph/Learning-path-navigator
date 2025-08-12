const router = require('express').Router();
const { getAllPaths, getPathById, createPath, updatePath, deletePath } = require('../controller/pathController');

router.get('/paths', getAllPaths);
router.post('/path', createPath);
router.get('/path/:id', getPathById);
// router.put('/path/:id', updatePath);
// router.delete('/path/:id', deletePath);


module.exports = router;