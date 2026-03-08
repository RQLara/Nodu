const express = require('express');
const router = express.Router();
const { getIdeas, getIdeaById, createIdea, updateIdea, deleteIdea } = require('../controllers/ideasController');

// Rutas de ideas
router.get('/', getIdeas);
router.get('/:id', getIdeaById);
router.post('/', createIdea);
router.put('/:id', updateIdea);
router.delete('/:id', deleteIdea);

module.exports = router;