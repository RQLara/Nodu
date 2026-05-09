import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://ocrkxrbcuhqcinjmgxtj.supabase.co',
  'sb_publishable_s3hu3sD73X-nCNK4v8NkrQ_zar6ijJq'
);

const { data: { session } } = await supabase.auth.getSession();
if (!session) window.location.href = 'login.html';

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('visible');
  setTimeout(() => t.classList.remove('visible'), 3000);
}

function fecha(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

function badge(estado) {
  const mapa = {
    pendiente:   'badge-pendiente',
    confirmada:  'badge-confirmada',
    cancelada:   'badge-cancelada',
    aceptada:    'badge-aceptada',
    'no encaja': 'badge-no-encaja',
    publicado:   'badge-publicado',
    borrador:    'badge-borrador',
  };
  return `<span class="badge ${mapa[estado] || ''}">${estado || '—'}</span>`;
}

function grupo(titulo, items, renderFn) {
  if (!items.length) return '';
  return `
    <div class="grupo">
      <div class="grupo-titulo">${titulo} <span class="grupo-count">${items.length}</span></div>
      ${items.map(renderFn).join('')}
    </div>
  `;
}

function botonesEstado(id, estadoActual, opciones, fnCambio) {
  return `
    <div class="estado-botones">
      ${opciones.map(op => `
        <button class="btn-estado ${estadoActual === op.valor ? 'activo' : ''}" onclick="${fnCambio}(${id}, '${op.valor}')">${op.texto}</button>
      `).join('')}
    </div>
  `;
}

let _confirmResolve = null;

function confirmar(msg) {
  return new Promise(resolve => {
    _confirmResolve = resolve;
    document.getElementById('confirm-msg').textContent = msg;
    document.getElementById('modal-confirm').classList.add('visible');
  });
}

window.confirmRespuesta = function(valor) {
  document.getElementById('modal-confirm').classList.remove('visible');
  if (_confirmResolve) _confirmResolve(valor);
};

window.ir = function(el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('activo'));
  document.querySelectorAll('.sec').forEach(s => s.classList.remove('activa'));
  el.classList.add('activo');
  const id = el.dataset.sec;
  document.getElementById('sec-' + id).classList.add('activa');
  if (id === 'citas')     cargarCitas();
  if (id === 'ideas')     cargarIdeas();
  if (id === 'proyectos') cargarProyectos();
  if (id === 'blog')      cargarBlog();
};

window.cerrarSesion = async function() {
  const ok = await confirmar('¿Seguro que quieres cerrar sesión?');
  if (!ok) return;
  await supabase.auth.signOut();
  window.location.href = 'login.html';
};

window.abrirModal = function(tipo) {
  if (tipo === 'proyectos') {
    document.getElementById('tit-proyectos').textContent = 'Nuevo proyecto';
    document.getElementById('p-id').value = '';
    document.getElementById('p-nombre').value = '';
    document.getElementById('p-desc').value = '';
    document.getElementById('p-tipo').value = '';
    document.getElementById('p-imagen').value = '';
    document.getElementById('p-estado').value = 'publicado';
  } else {
    document.getElementById('tit-blog').textContent = 'Nuevo artículo';
    document.getElementById('b-id').value = '';
    document.getElementById('b-titulo').value = '';
    document.getElementById('b-extracto').value = '';
    document.getElementById('b-contenido').value = '';
    document.getElementById('b-imagen').value = '';
    document.getElementById('b-estado').value = 'publicado';
  }
  document.getElementById('modal-' + tipo).classList.add('visible');
};

window.cerrarModal = function(tipo) {
  document.getElementById('modal-' + tipo).classList.remove('visible');
};

window.guardar = async function(tipo) {
  let error;

  if (tipo === 'proyectos') {
    const id = document.getElementById('p-id').value;
    const nombre = document.getElementById('p-nombre').value.trim();
    if (!nombre) { toast('El nombre es obligatorio'); return; }
    const ok = await confirmar(id ? '¿Confirmas editar este proyecto?' : '¿Confirmas crear este proyecto?');
    if (!ok) return;
    const datos = {
      nombre,
      descripcion: document.getElementById('p-desc').value,
      tipo:        document.getElementById('p-tipo').value,
      imagen_url:  document.getElementById('p-imagen').value,
      estado:      document.getElementById('p-estado').value,
    };
    if (id) {
      ({ error } = await supabase.from('proyectos').update(datos).eq('id', id));
    } else {
      ({ error } = await supabase.from('proyectos').insert([datos]));
    }
    if (!error) { cerrarModal('proyectos'); cargarProyectos(); cargarDashboard(); }

  } else {
    const id = document.getElementById('b-id').value;
    const titulo = document.getElementById('b-titulo').value.trim();
    if (!titulo) { toast('El título es obligatorio'); return; }
    const ok = await confirmar(id ? '¿Confirmas editar este artículo?' : '¿Confirmas crear este artículo?');
    if (!ok) return;
    const datos = {
      titulo,
      extracto:   document.getElementById('b-extracto').value,
      contenido:  document.getElementById('b-contenido').value,
      imagen_url: document.getElementById('b-imagen').value,
      estado:     document.getElementById('b-estado').value,
    };
    if (id) {
      ({ error } = await supabase.from('blog').update(datos).eq('id', id));
    } else {
      ({ error } = await supabase.from('blog').insert([datos]));
    }
    if (!error) { cerrarModal('blog'); cargarBlog(); cargarDashboard(); }
  }

  toast(error ? 'Error al guardar' : 'Guardado correctamente');
};

async function cargarDashboard() {
  const [c, i, p, b] = await Promise.all([
    supabase.from('citas').select('id', { count: 'exact' }).eq('estado', 'pendiente'),
    supabase.from('ideas').select('id', { count: 'exact' }).eq('estado', 'pendiente'),
    supabase.from('proyectos').select('id', { count: 'exact' }),
    supabase.from('blog').select('id', { count: 'exact' }),
  ]);
  document.getElementById('n-citas').textContent     = c.count ?? 0;
  document.getElementById('n-ideas').textContent     = i.count ?? 0;
  document.getElementById('n-proyectos').textContent = p.count ?? 0;
  document.getElementById('n-blog').textContent      = b.count ?? 0;
}
cargarDashboard();

function citaHTML(c) {
  return `
    <div class="tarjeta">
      <div class="tarjeta-header">
        <div>
          <div class="tarjeta-titulo">${c.nombre || '—'}</div>
          <div class="tarjeta-meta">${c.email || ''} ${c.telefono ? '· ' + c.telefono : ''}</div>
          <div class="tarjeta-meta">Fecha: ${c.fecha || '—'} · Hora: ${c.hora || '—'}</div>
          ${c.mensaje ? `<div class="tarjeta-texto">"${c.mensaje}"</div>` : ''}
        </div>
        ${badge(c.estado || 'pendiente')}
      </div>
      <div class="tarjeta-acciones">
        ${botonesEstado(c.id, c.estado || 'pendiente', [
          { valor: 'pendiente',  texto: 'Pendiente' },
          { valor: 'confirmada', texto: 'Confirmada' },
          { valor: 'cancelada',  texto: 'Cancelada' },
        ], 'cambiarEstadoCita')}
        <button class="btn-rojo" onclick="eliminarCita(${c.id})">Eliminar</button>
      </div>
    </div>
  `;
}

async function cargarCitas() {
  const el = document.getElementById('lista-citas');
  el.innerHTML = '<div class="vacio">Cargando...</div>';
  const { data } = await supabase.from('citas').select('*').order('created_at', { ascending: false });
  if (!data?.length) { el.innerHTML = '<div class="vacio">No hay citas todavía.</div>'; return; }
  el.innerHTML =
    grupo('Pendientes', data.filter(c => c.estado === 'pendiente' || !c.estado), citaHTML) +
    grupo('Confirmadas', data.filter(c => c.estado === 'confirmada'), citaHTML) +
    grupo('Canceladas', data.filter(c => c.estado === 'cancelada'), citaHTML);
}

window.cambiarEstadoCita = async function(id, estado) {
  const ok = await confirmar(`¿Cambiar esta cita a "${estado}"?`);
  if (!ok) return;
  const { error } = await supabase.from('citas').update({ estado }).eq('id', id);
  toast(error ? 'Error al actualizar' : 'Estado actualizado');
  cargarCitas();
  cargarDashboard();
};

window.eliminarCita = async function(id) {
  const ok = await confirmar('¿Seguro que quieres eliminar esta cita? No se puede deshacer.');
  if (!ok) return;
  const { error } = await supabase.from('citas').delete().eq('id', id);
  toast(error ? 'Error al eliminar' : 'Cita eliminada');
  cargarCitas();
  cargarDashboard();
};

function ideaHTML(i) {
  return `
    <div class="tarjeta">
      <div class="tarjeta-header">
        <div>
          <div class="tarjeta-titulo">${i.nombre_idea || i.nombre_negocio || '(Sin nombre)'}</div>
          <div class="tarjeta-meta">${i.nombre_contacto || ''} ${i.email ? '· ' + i.email : ''}</div>
          ${i.tipo_actividad ? `<div class="tarjeta-meta">Tipo: ${i.tipo_actividad}</div>` : ''}
          ${i.ubicacion      ? `<div class="tarjeta-meta">Ubicación: ${i.ubicacion}</div>` : ''}
          ${i.formato        ? `<div class="tarjeta-meta">Formato: ${i.formato}</div>` : ''}
          ${i.ticket_medio   ? `<div class="tarjeta-meta">Ticket medio: ${i.ticket_medio}</div>` : ''}
          ${i.publico        ? `<div class="tarjeta-meta">Público: ${i.publico}</div>` : ''}
          ${i.punto_proyecto ? `<div class="tarjeta-meta">Estado del proyecto: ${i.punto_proyecto}</div>` : ''}
          ${i.descripcion    ? `<div class="tarjeta-texto">${i.descripcion}</div>` : ''}
        </div>
        ${badge(i.estado || 'pendiente')}
      </div>
      <div class="tarjeta-acciones">
        ${botonesEstado(i.id, i.estado || 'pendiente', [
          { valor: 'pendiente',  texto: 'Pendiente' },
          { valor: 'aceptada',   texto: 'Aceptada' },
          { valor: 'no encaja',  texto: 'No encaja' },
        ], 'cambiarEstadoIdea')}
        <button class="btn-rojo" onclick="eliminarIdea(${i.id})">Eliminar</button>
      </div>
    </div>
  `;
}

async function cargarIdeas() {
  const el = document.getElementById('lista-ideas');
  el.innerHTML = '<div class="vacio">Cargando...</div>';
  const { data } = await supabase.from('ideas').select('*').order('created_at', { ascending: false });
  if (!data?.length) { el.innerHTML = '<div class="vacio">No hay ideas todavía.</div>'; return; }
  el.innerHTML =
    grupo('Pendientes', data.filter(i => i.estado === 'pendiente' || !i.estado), ideaHTML) +
    grupo('Aceptadas', data.filter(i => i.estado === 'aceptada'), ideaHTML) +
    grupo('No encajan', data.filter(i => i.estado === 'no encaja'), ideaHTML);
}

window.cambiarEstadoIdea = async function(id, estado) {
  const ok = await confirmar(`¿Cambiar esta idea a "${estado}"?`);
  if (!ok) return;
  const { error } = await supabase.from('ideas').update({ estado }).eq('id', id);
  toast(error ? 'Error al actualizar' : 'Estado actualizado');
  cargarIdeas();
  cargarDashboard();
};

window.eliminarIdea = async function(id) {
  const ok = await confirmar('¿Seguro que quieres eliminar esta idea? No se puede deshacer.');
  if (!ok) return;
  const { error } = await supabase.from('ideas').delete().eq('id', id);
  toast(error ? 'Error al eliminar' : 'Idea eliminada');
  cargarIdeas();
  cargarDashboard();
};

function proyectoHTML(p) {
  return `
    <div class="tarjeta">
      <div class="tarjeta-header">
        <div>
          <div class="tarjeta-titulo">${p.nombre || '—'}</div>
          <div class="tarjeta-meta">${p.tipo || ''} · ${fecha(p.created_at)}</div>
          ${p.descripcion ? `<div class="tarjeta-texto">${p.descripcion.substring(0,180)}${p.descripcion.length > 180 ? '...' : ''}</div>` : ''}
        </div>
        ${badge(p.estado || 'borrador')}
      </div>
      <div class="tarjeta-acciones">
        <button class="btn-gris" onclick="editarProyecto(${p.id})">Editar</button>
        <button class="btn-rojo" onclick="eliminarProyecto(${p.id})">Eliminar</button>
      </div>
    </div>
  `;
}

async function cargarProyectos() {
  const el = document.getElementById('lista-proyectos');
  el.innerHTML = '<div class="vacio">Cargando...</div>';
  const { data } = await supabase.from('proyectos').select('*').order('created_at', { ascending: false });
  if (!data?.length) { el.innerHTML = '<div class="vacio">No hay proyectos todavía.</div>'; return; }
  window._proyectos = data;
  el.innerHTML =
    grupo('Publicados', data.filter(p => p.estado === 'publicado'), proyectoHTML) +
    grupo('Borradores', data.filter(p => p.estado === 'borrador' || !p.estado), proyectoHTML);
}

window.editarProyecto = async function(id) {
  const p = window._proyectos.find(x => x.id === id);
  if (!p) return;
  const ok = await confirmar(`¿Quieres editar "${p.nombre}"?`);
  if (!ok) return;
  document.getElementById('tit-proyectos').textContent = 'Editar proyecto';
  document.getElementById('p-id').value     = p.id;
  document.getElementById('p-nombre').value = p.nombre || '';
  document.getElementById('p-desc').value   = p.descripcion || '';
  document.getElementById('p-tipo').value   = p.tipo || '';
  document.getElementById('p-imagen').value = p.imagen_url || '';
  document.getElementById('p-estado').value = p.estado || 'publicado';
  document.getElementById('modal-proyectos').classList.add('visible');
};

window.eliminarProyecto = async function(id) {
  const p = window._proyectos?.find(x => x.id === id);
  const ok = await confirmar(`¿Eliminar "${p?.nombre || 'este proyecto'}"? No se puede deshacer.`);
  if (!ok) return;
  const { error } = await supabase.from('proyectos').delete().eq('id', id);
  toast(error ? 'Error al eliminar' : 'Proyecto eliminado');
  cargarProyectos();
  cargarDashboard();
};

function blogHTML(b) {
  return `
    <div class="tarjeta">
      <div class="tarjeta-header">
        <div>
          <div class="tarjeta-titulo">${b.titulo || '—'}</div>
          <div class="tarjeta-meta">${fecha(b.created_at)}</div>
          ${b.extracto ? `<div class="tarjeta-texto">${b.extracto}</div>` : ''}
        </div>
        ${badge(b.estado || 'borrador')}
      </div>
      <div class="tarjeta-acciones">
        <button class="btn-gris" onclick="editarBlog(${b.id})">Editar</button>
        <button class="btn-rojo" onclick="eliminarBlog(${b.id})">Eliminar</button>
      </div>
    </div>
  `;
}

async function cargarBlog() {
  const el = document.getElementById('lista-blog');
  el.innerHTML = '<div class="vacio">Cargando...</div>';
  const { data } = await supabase.from('blog').select('*').order('created_at', { ascending: false });
  if (!data?.length) { el.innerHTML = '<div class="vacio">No hay artículos todavía.</div>'; return; }
  window._blog = data;
  el.innerHTML =
    grupo('Publicados', data.filter(b => b.estado === 'publicado'), blogHTML) +
    grupo('Borradores', data.filter(b => b.estado === 'borrador' || !b.estado), blogHTML);
}

window.editarBlog = async function(id) {
  const b = window._blog.find(x => x.id === id);
  if (!b) return;
  const ok = await confirmar(`¿Quieres editar "${b.titulo}"?`);
  if (!ok) return;
  document.getElementById('tit-blog').textContent  = 'Editar artículo';
  document.getElementById('b-id').value            = b.id;
  document.getElementById('b-titulo').value        = b.titulo || '';
  document.getElementById('b-extracto').value      = b.extracto || '';
  document.getElementById('b-contenido').value     = b.contenido || '';
  document.getElementById('b-imagen').value        = b.imagen_url || '';
  document.getElementById('b-estado').value        = b.estado || 'publicado';
  document.getElementById('modal-blog').classList.add('visible');
};

window.eliminarBlog = async function(id) {
  const b = window._blog?.find(x => x.id === id);
  const ok = await confirmar(`¿Eliminar "${b?.titulo || 'este artículo'}"? No se puede deshacer.`);
  if (!ok) return;
  const { error } = await supabase.from('blog').delete().eq('id', id);
  toast(error ? 'Error al eliminar' : 'Artículo eliminado');
  cargarBlog();
  cargarDashboard();
};