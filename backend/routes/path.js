const router = require('express').Router();
const { getAllPaths, getPathById, createPath, generateQuiz } = require('../controller/pathController');

router.get('/all', getAllPaths);
router.post('/', createPath);
router.get('/:id', getPathById);
router.post('/:pathId/generate-quiz', generateQuiz);
// router.put('/path/:id', updatePath);
// router.delete('/path/:id', deletePath);


module.exports = router;