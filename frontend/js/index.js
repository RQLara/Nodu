async function cargarProyectosHome() {
  var grid = document.getElementById('proyectos-grid');
  var res = await supabaseClient.from('proyectos').select('*').eq('estado', 'publicado').order('created_at', { ascending: false }).limit(3);
  if (res.error || !res.data || res.data.length === 0) return;
  var html = '';
  res.data.forEach(function(p) {
    html += '<div class="proyecto-card">';
    html += '<div class="proyecto-card__img"><img src="' + p.imagen_url + '" alt="' + p.nombre + '" style="width:100%;height:100%;object-fit:cover;" /></div>';
    html += '<div class="proyecto-card__info">';
    html += '<span class="proyecto-card__cat">' + p.tipo + '</span>';
    html += '<h3 class="proyecto-card__title">' + p.nombre + '</h3>';
    html += '<p class="proyecto-card__desc">' + (p.descripcion || '').substring(0, 100) + '...</p>';
    html += '</div></div>';
  });
  grid.innerHTML = html;
}

async function cargarBlogHome() {
  var grid = document.getElementById('blog-grid');
  var res = await supabaseClient.from('blog').select('*').eq('publicado', true).order('created_at', { ascending: false }).limit(3);
  if (res.error || !res.data || res.data.length === 0) return;
  var html = '';
  res.data.forEach(function(a) {
    html += '<div class="blog-card">';
    html += '<div class="blog-card__img">';
    if (a.imagen_url) html += '<img src="' + a.imagen_url + '" alt="' + a.titulo + '" style="width:100%;height:100%;object-fit:cover;" />';
    html += '</div>';
    html += '<div class="blog-card__info">';
    html += '<span class="blog-card__cat">Blog</span>';
    html += '<h3 class="blog-card__title">' + a.titulo + '</h3>';
    html += '<p class="blog-card__desc">' + (a.extracto || a.contenido || '').substring(0, 100) + '...</p>';
    html += '</div></div>';
  });
  grid.innerHTML = html;
}

window.onload = function() {
  cargarProyectosHome();
  cargarBlogHome();
};