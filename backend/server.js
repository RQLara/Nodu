const express = require('express');
const cors = require('cors');
require('dotenv').config();

const citasRoutes = require('./routes/citasRoutes');
const ideasRoutes = require('./routes/ideasRoutes');
const proyectosRoutes = require('./routes/proyectosRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/citas', citasRoutes);
app.use('/api/ideas', ideasRoutes);
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/blog', blogRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});