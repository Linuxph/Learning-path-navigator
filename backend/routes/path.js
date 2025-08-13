const router = require('express').Router();
const { getAllPaths, getPathById, createPath, generateQuiz } = require('../controller/pathController');

router.get('/paths', getAllPaths);
router.post('/path', createPath);
router.get('/path/:id', getPathById);
router.post('/:pathId/generate-quiz', generateQuiz);
// router.put('/path/:id', updatePath);
// router.delete('/path/:id', deletePath);


module.exports = router;