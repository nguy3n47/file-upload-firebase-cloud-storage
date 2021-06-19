const express = require('express');
const movieController = require('../controllers/movie.controller');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();

router.get('/status', (req, res) => res.json({ status: 200 }));
router.post('/movies', upload.single('poster'), movieController.create);

module.exports = router;
