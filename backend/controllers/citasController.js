const supabase = require('../config/supabase');

// Obtener todas las citas
const getCitas = async (req, res) => {
  console.log('GET /api/citas - Obteniendo todas las citas');
  const { data, error } = await supabase
    .from('citas')
    .select('*')
    .order('fecha', { ascending: true });

  if (error) {
    console.log('Error al obtener citas:', error.message);
    return res.status(500).json({ error: error.message });
  }
  console.log('Citas obtenidas:', data.length);
  res.json(data);
};

// Obtener una cita por id
const getCitaById = async (req, res) => {
  const { id } = req.params;
  console.log('GET /api/citas/:id - Buscando cita con id:', id);
  const { data, error } = await supabase
    .from('citas')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.log('Error al buscar cita:', error.message);
    return res.status(404).json({ error: 'Cita no encontrada' });
  }
  console.log('Cita encontrada:', data);
  res.json(data);
};

// Crear una cita nueva
const createCita = async (req, res) => {
  console.log('POST /api/citas - Datos recibidos:', req.body);
  const { nombre, email, telefono, fecha, hora, mensaje } = req.body;

  const { data, error } = await supabase
    .from('citas')
    .insert([{ nombre, email, telefono, fecha, hora, mensaje }])
    .select();

  if (error) {
    console.log('Error al crear cita:', error.message);
    return res.status(500).json({ error: error.message });
  }
  console.log('Cita creada correctamente:', data[0]);
  res.status(201).json(data[0]);
};

// Cambiar el estado de una cita
const updateCita = async (req, res) => {
  const { id } = req.params;
  console.log('PUT /api/citas/:id - Actualizando cita con id:', id, 'Datos:', req.body);
  const { estado } = req.body;

  const { data, error } = await supabase
    .from('citas')
    .update({ estado })
    .eq('id', id)
    .select();

  if (error) {
    console.log('Error al actualizar cita:', error.message);
    return res.status(500).json({ error: error.message });
  }
  console.log('Cita actualizada:', data[0]);
  res.json(data[0]);
};

// Borrar una cita
const deleteCita = async (req, res) => {
  const { id } = req.params;
  console.log('DELETE /api/citas/:id - Borrando cita con id:', id);

  const { error } = await supabase
    .from('citas')
    .delete()
    .eq('id', id);

  if (error) {
    console.log('Error al borrar cita:', error.message);
    return res.status(500).json({ error: error.message });
  }
  console.log('Cita borrada correctamente');
  res.json({ mensaje: 'Cita eliminada' });
};

module.exports = { getCitas, getCitaById, createCita, updateCita, deleteCita };