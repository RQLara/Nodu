const supabase = require('../config/supabase');

// Obtener todas las ideas
const getIdeas = async (req, res) => {
  console.log('GET /api/ideas - Obteniendo todas las ideas');
  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.log('Error al obtener ideas:', error.message);
    return res.status(500).json({ error: error.message });
  }
  console.log('Ideas obtenidas:', data.length);
  res.json(data);
};

// Obtener una idea por id
const getIdeaById = async (req, res) => {
  const { id } = req.params;
  console.log('GET /api/ideas/:id - Buscando idea con id:', id);
  const { data, error } = await supabase
    .from('ideas')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.log('Error al buscar idea:', error.message);
    return res.status(404).json({ error: 'Idea no encontrada' });
  }
  console.log('Idea encontrada:', data);
  res.json(data);
};

// Enviar una idea nueva
const createIdea = async (req, res) => {
  console.log('POST /api/ideas - Datos recibidos:', req.body);
  const { nombre_negocio, tipo_actividad, ubicacion, formato, precio_medio, publico_objetivo, estado_proyecto, descripcion, nombre_contacto, email_contacto } = req.body;

  const { data, error } = await supabase
    .from('ideas')
    .insert([{ nombre_negocio, tipo_actividad, ubicacion, formato, precio_medio, publico_objetivo, estado_proyecto, descripcion, nombre_contacto, email_contacto }])
    .select();

  if (error) {
    console.log('Error al crear idea:', error.message);
    return res.status(500).json({ error: error.message });
  }
  console.log('Idea creada correctamente:', data[0]);
  res.status(201).json(data[0]);
};

// Cambiar el estado de una idea
const updateIdea = async (req, res) => {
  const { id } = req.params;
  console.log('PUT /api/ideas/:id - Actualizando idea con id:', id, 'Datos:', req.body);
  const { estado } = req.body;

  const { data, error } = await supabase
    .from('ideas')
    .update({ estado })
    .eq('id', id)
    .select();

  if (error) {
    console.log('Error al actualizar idea:', error.message);
    return res.status(500).json({ error: error.message });
  }
  console.log('Idea actualizada:', data[0]);
  res.json(data[0]);
};

// Borrar una idea
const deleteIdea = async (req, res) => {
  const { id } = req.params;
  console.log('DELETE /api/ideas/:id - Borrando idea con id:', id);

  const { error } = await supabase
    .from('ideas')
    .delete()
    .eq('id', id);

  if (error) {
    console.log('Error al borrar idea:', error.message);
    return res.status(500).json({ error: error.message });
  }
  console.log('Idea borrada correctamente');
  res.json({ mensaje: 'Idea eliminada' });
};

module.exports = { getIdeas, getIdeaById, createIdea, updateIdea, deleteIdea };