const express = require('express');
const router = express.Router();
const { getProyectos, getProyectoById, createProyecto, updateProyecto, deleteProyecto } = require('../controllers/proyectosController');

// Rutas de proyectos
router.get('/', getProyectos);
router.get('/:id', getProyectoById);
router.post('/', createProyecto);
router.put('/:id', updateProyecto);
router.delete('/:id', deleteProyecto);

module.exports = router;