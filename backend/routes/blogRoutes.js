const express = require('express');
const router = express.Router();
const { getArticulos, getArticuloById, createArticulo, updateArticulo, deleteArticulo } = require('../controllers/blogController');

// Rutas del blog
router.get('/', getArticulos);
router.get('/:id', getArticuloById);
router.post('/', createArticulo);
router.put('/:id', updateArticulo);
router.delete('/:id', deleteArticulo);

module.exports = router;
