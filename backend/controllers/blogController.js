const supabase = require('../config/supabase');

// Obtener todos los articulos
const getArticulos = async (req, res) => {
  console.log('GET /api/blog - Obteniendo todos los articulos');
  const { data, error } = await supabase
    .from('blog')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.log('Error al obtener articulos:', error.message);
    return res.status(500).json({ error: error.message });
  }
  console.log('Articulos obtenidos:', data.length);
  res.json(data);
};

// Obtener un articulo por id
const getArticuloById = async (req, res) => {
  const { id } = req.params;
  console.log('GET /api/blog/:id - Buscando articulo con id:', id);
  const { data, error } = await supabase
    .from('blog')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.log('Error al buscar articulo:', error.message);
    return res.status(404).json({ error: 'Articulo no encontrado' });
  }
  console.log('Articulo encontrado:', data);
  res.json(data);
};

// Crear un articulo nuevo
const createArticulo = async (req, res) => {
  console.log('POST /api/blog - Datos recibidos:', req.body);
  const { titulo, contenido, imagen_url, publicado } = req.body;

  const { data, error } = await supabase
    .from('blog')
    .insert([{ titulo, contenido, imagen_url, publicado }])
    .select();

  if (error) {
    console.log('Error al crear articulo:', error.message);
    return res.status(500).json({ error: error.message });
  }
  console.log('Articulo creado correctamente:', data[0]);
  res.status(201).json(data[0]);
};

// Editar un articulo
const updateArticulo = async (req, res) => {
  const { id } = req.params;
  console.log('PUT /api/blog/:id - Actualizando articulo con id:', id, 'Datos:', req.body);
  const { titulo, contenido, imagen_url, publicado } = req.body;

  const { data, error } = await supabase
    .from('blog')
    .update({ titulo, contenido, imagen_url, publicado })
    .eq('id', id)
    .select();

  if (error) {
    console.log('Error al actualizar articulo:', error.message);
    return res.status(500).json({ error: error.message });
  }
  console.log('Articulo actualizado:', data[0]);
  res.json(data[0]);
};

// Borrar un articulo
const deleteArticulo = async (req, res) => {
  const { id } = req.params;
  console.log('DELETE /api/blog/:id - Borrando articulo con id:', id);

  const { error } = await supabase
    .from('blog')
    .delete()
    .eq('id', id);

  if (error) {
    console.log('Error al borrar articulo:', error.message);
    return res.status(500).json({ error: error.message });
  }
  console.log('Articulo borrado correctamente');
  res.json({ mensaje: 'Articulo eliminado' });
};

module.exports = { getArticulos, getArticuloById, createArticulo, updateArticulo, deleteArticulo };