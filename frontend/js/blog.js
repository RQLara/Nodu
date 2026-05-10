// Cargar artículos del blog desde Supabase
async function cargarArticulos() {
  const grid = document.getElementById('blog-grid');

  const { data: articulos, error } = await supabaseClient
    .from('blog')
    .select('*')
    .eq('publicado', true)
    .order('created_at', { ascending: false });

  if (error) {
    grid.innerHTML = '<p class="blog-cargando">No se pudieron cargar los artículos.</p>';
    return;
  }

  if (!articulos || articulos.length === 0) {
    grid.innerHTML = '<p class="blog-cargando">Próximamente.</p>';
    return;
  }

  grid.innerHTML = articulos.map(articulo => `
    <div class="blog-card" onclick="verArticulo(${articulo.id})">
      <div class="blog-card__img">
        ${articulo.imagen_url ? `<img src="${articulo.imagen_url}" alt="${articulo.titulo}" />` : ''}
      </div>
      <span class="blog-card__cat">Blog</span>
      <h3 class="blog-card__title">${articulo.titulo}</h3>
      <p class="blog-card__desc">${(articulo.extracto || articulo.contenido || '').substring(0, 120)}...</p>
      <span class="blog-card__fecha">${formatearFecha(articulo.created_at)}</span>
    </div>
  `).join('');
}

// Ver artículo individual
async function verArticulo(id) {
  const { data: articulo, error } = await supabaseClient
    .from('blog')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !articulo) return;

  document.querySelector('.cabecera-blog').style.display = 'none';
  document.querySelector('.blog-lista').style.display = 'none';

  const contenedor = document.getElementById('articulo-contenedor');
  contenedor.innerHTML = `
    <div class="articulo visible">
      <span class="articulo__volver" onclick="volverAlBlog()">← Volver al blog</span>
      <span class="articulo__cat">Blog</span>
      <h1 class="articulo__titulo">${articulo.titulo}</h1>
      <span class="articulo__fecha">${formatearFecha(articulo.created_at)}</span>
      <div class="articulo__linea"></div>
      <div class="articulo__contenido">${articulo.contenido}</div>
    </div>
  `;
}

// Volver al listado
function volverAlBlog() {
  document.querySelector('.cabecera-blog').style.display = '';
  document.querySelector('.blog-lista').style.display = '';
  document.getElementById('articulo-contenedor').innerHTML = '';
}

// Formatear fecha
function formatearFecha(fecha) {
  const d = new Date(fecha);
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Iniciar
cargarArticulos();