import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://ocrkxrbcuhqcinjmgxtj.supabase.co',
  'sb_publishable_s3hu3sD73X-nCNK4v8NkrQ_zar6ijJq'
);

async function cargarProyectos() {
  const grid = document.getElementById('proyectos-grid');

  const { data, error } = await supabase
    .from('proyectos')
    .select('*')
    .eq('publicado', true)
    .order('created_at', { ascending: false });

  if (error || !data?.length) return;

  var html = '';
  data.forEach(function(p) {
    html += '<section class="proyecto-destacado">';
    html += '<div class="proyecto-destacado__img"><img src="' + p.imagen_url + '" alt="' + p.nombre + '" /></div>';
    html += '<div class="proyecto-destacado__info">';
    html += '<span class="label">' + p.tipo + '</span>';
    html += '<h2>' + p.nombre + '</h2>';
    html += '<p>' + p.descripcion + '</p>';
 if (p.problema) html += '<p>' + p.problema + '</p>';
if (p.solucion) html += '<p>' + p.solucion + '</p>';
if (p.resultados) html += '<p>' + p.resultados + '</p>';
    html += '</div></section>';
  });
  grid.innerHTML = html;
}

cargarProyectos();