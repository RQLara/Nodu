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
    .eq('estado', 'publicado')
    .order('created_at', { ascending: false });

  if (error || !data?.length) return;

  grid.innerHTML = data.map(p => `
    <div class="proyecto-card">
      <div class="proyecto-card__img">
        ${p.imagen_url ? `<img src="${p.imagen_url}" alt="${p.nombre}" />` : ''}
      </div>
      <div class="proyecto-card__info">
        <span class="proyecto-card__tipo">${p.tipo || 'Proyecto'}</span>
        <h3 class="proyecto-card__titulo">${p.nombre}</h3>
        <p class="proyecto-card__desc">${(p.descripcion || '').substring(0, 140)}${p.descripcion?.length > 140 ? '...' : ''}</p>
      </div>
    </div>
  `).join('');
}

cargarProyectos();