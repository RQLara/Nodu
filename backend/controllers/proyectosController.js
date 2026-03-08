const supabase = require('../config/supabase');

// Obtener todos los proyectos
const getProyectos = async (req, res) => {
  console.log('GET /api/proyectos - Obteniendo todos los proyectos');
  const { data, error } = await supabase
    .from('proyectos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.log('Error al obtener proyectos:', error.message);
    return res.status(500).json({ error: error.message });
  }
  console.log('Proyectos obtenidos:', data.length);
  res.json(data);
};

// Obtener un proyecto por id
const getProyectoById = async (req, res) => {
  const { id } = req.params;
  console.log('GET /api/proyectos/:id - Buscando proyecto con id:', id);
  const { data, error } = await supabase
    .from('proyectos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.log('Error al buscar proyecto:', error.message);
    return res.status(404).json({ error: 'Proyecto no encontrado' });
  }
  console.log('Proyecto encontrado:', data);
  res.json(data);
};

// Crear un proyecto nuevo
const createProyecto = async (req, res) => {
  console.log('POST /api/proyectos - Datos recibidos:', req.body);
  const { nombre, problema, solucion, resultados, imagen_url, publicado } = req.body;

  const { data, error } = await supabase
    .from('proyectos')
    .insert([{ nombre, problema, solucion, resultados, imagen_url, publicado }])
    .select();

  if (error) {
    console.log('Error al crear proyecto:', error.message);
    return res.status(500).json({ error: error.message });
  }
  console.log('Proyecto creado correctamente:', data[0]);
  res.status(201).json(data[0]);
};

// Editar un proyecto
const updateProyecto = async (req, res) => {
  const { id } = req.params;
  console.log('PUT /api/proyectos/:id - Actualizando proyecto con id:', id, 'Datos:', req.body);
  const { nombre, problema, solucion, resultados, imagen_url, publicado } = req.body;

  const { data, error } = await supabase
    .from('proyectos')
    .update({ nombre, problema, solucion, resultados, imagen_url, publicado })
    .eq('id', id)
    .select();

  if (error) {
    console.log('Error al actualizar proyecto:', error.message);
    return res.status(500).json({ error: error.message });
  }
  console.log('Proyecto actualizado:', data[0]);
  res.json(data[0]);
};

// Borrar un proyecto
const deleteProyecto = async (req, res) => {
  const { id } = req.params;
  console.log('DELETE /api/proyectos/:id - Borrando proyecto con id:', id);

  const { error } = await supabase
    .from('proyectos')
    .delete()
    .eq('id', id);

  if (error) {
    console.log('Error al borrar proyecto:', error.message);
    return res.status(500).json({ error: error.message });
  }
  console.log('Proyecto borrado correctamente');
  res.json({ mensaje: 'Proyecto eliminado' });
};

module.exports = { getProyectos, getProyectoById, createProyecto, updateProyecto, deleteProyecto };