// Configuración Supabase
var SUPABASE_URL = 'https://ocrkxrbcuhqcinjmgxtj.supabase.co';
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jcmt4cmJjdWhxY2luam1neHRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4Njc5MjMsImV4cCI6MjA4ODQ0MzkyM30.FDOfw22e1SxZg_SXIU9Zy0dtRvu-TLGODTSaPi3xUs4';

// Nav scroll
window.addEventListener('scroll', function() {
  var nav = document.getElementById('nav');
  if (window.scrollY > 20) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Hamburger
document.getElementById('hamburger').addEventListener('click', function() {
  this.classList.toggle('open');
  document.getElementById('menu').classList.toggle('open');
});

// Contadores de caracteres
document.getElementById('concepto').addEventListener('input', function() {
  document.getElementById('contadorConcepto').textContent = this.value.length + ' / 500';
});

document.getElementById('diferencial').addEventListener('input', function() {
  document.getElementById('contadorDiferencial').textContent = this.value.length + ' / 500';
});

// Validar formulario
function validarFormulario() {
  var valido = true;

  var campos = [
    { id: 'nombre-idea',      errorId: 'errorNombreIdea',      check: function(v) { return v.trim().length >= 2; } },
    { id: 'concepto',         errorId: 'errorConcepto',         check: function(v) { return v.trim().length >= 10; } },
    { id: 'diferencial',      errorId: 'errorDiferencial',      check: function(v) { return v.trim().length >= 10; } },
    { id: 'competencia',      errorId: 'errorCompetencia',      check: function(v) { return v.trim().length >= 2; } },
    { id: 'tipo-comida',      errorId: 'errorTipoComida',       check: function(v) { return v !== ''; } },
    { id: 'ticket',           errorId: 'errorTicket',           check: function(v) { return v !== ''; } },
    { id: 'formato',          errorId: 'errorFormato',          check: function(v) { return v !== ''; } },
    { id: 'estado',           errorId: 'errorEstado',           check: function(v) { return v !== ''; } },
    { id: 'publico',          errorId: 'errorPublico',          check: function(v) { return v.trim().length >= 2; } },
    { id: 'nombre-contacto',  errorId: 'errorNombreContacto',   check: function(v) { return v.trim().length >= 2; } },
  ];

  campos.forEach(function(campo) {
    var el = document.getElementById(campo.id);
    var err = document.getElementById(campo.errorId);
    if (!campo.check(el.value)) {
      el.classList.add('campo-error');
      err.classList.add('visible');
      valido = false;
    } else {
      el.classList.remove('campo-error');
      err.classList.remove('visible');
    }
  });

  // Email
  var email = document.getElementById('email-contacto');
  var errorEmail = document.getElementById('errorEmailContacto');
  var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email.value.trim())) {
    email.classList.add('campo-error');
    errorEmail.classList.add('visible');
    valido = false;
  } else {
    email.classList.remove('campo-error');
    errorEmail.classList.remove('visible');
  }

  return valido;
}

// Enviar a Supabase
document.getElementById('formularioIdeas').addEventListener('submit', async function(e) {
  e.preventDefault();

  if (!validarFormulario()) return;

  var boton = document.getElementById('botonEnviar');
  boton.disabled = true;
  boton.textContent = 'Enviando...';

  var datos = {
    nombre_negocio:   document.getElementById('nombre-idea').value.trim(),
    descripcion:      document.getElementById('concepto').value.trim(),
    diferencial:      document.getElementById('diferencial').value.trim(),
    competencia:      document.getElementById('competencia').value.trim(),
    tipo_comida:      document.getElementById('tipo-comida').value,
    precio_medio:     document.getElementById('ticket').value,
    formato:          document.getElementById('formato').value,
    estado_proyecto:  document.getElementById('estado').value,
    publico_objetivo: document.getElementById('publico').value.trim(),
    ubicacion:        document.getElementById('ubicacion').value.trim(),
    nombre_contacto:  document.getElementById('nombre-contacto').value.trim(),
    email_contacto:   document.getElementById('email-contacto').value.trim()
  };

  try {
    var respuesta = await fetch(SUPABASE_URL + '/rest/v1/ideas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
      throw new Error('Error al enviar');
    }

    document.getElementById('campos').classList.add('oculto');
    document.getElementById('exito').classList.add('visible');

  } catch (error) {
    alert('Ha ocurrido un error. Por favor, inténtalo de nuevo.');
    boton.disabled = false;
    boton.textContent = 'Enviar mi idea';
  }
});

// Reiniciar formulario
function reiniciarFormulario() {
  document.getElementById('formularioIdeas').reset();
  document.getElementById('contadorConcepto').textContent = '0 / 500';
  document.getElementById('contadorDiferencial').textContent = '0 / 500';

  document.querySelectorAll('.campo-error').forEach(function(el) {
    el.classList.remove('campo-error');
  });
  document.querySelectorAll('.mensaje-error').forEach(function(el) {
    el.classList.remove('visible');
  });

  document.getElementById('botonEnviar').disabled = false;
  document.getElementById('botonEnviar').textContent = 'Enviar mi idea';
  document.getElementById('campos').classList.remove('oculto');
  document.getElementById('exito').classList.remove('visible');
}