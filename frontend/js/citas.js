// Configuración Supabase
var SUPABASE_URL = 'https://ocrkxrbcuhqcinjmgxtj.supabase.co';
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jcmt4cmJjdWhxY2luam1neHRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4Njc5MjMsImV4cCI6MjA4ODQ0MzkyM30.FDOfw22e1SxZg_SXIU9Zy0dtRvu-TLGODTSaPi3xUs4';

// Horas disponibles (en punto y en media, de 9:00 a 20:00)
var HORAS = [
  '09:00', '09:30',
  '10:00', '10:30',
  '11:00', '11:30',
  '12:00', '12:30',
  '13:00', '13:30',
  '16:00', '16:30',
  '17:00', '17:30',
  '18:00', '18:30',
  '19:00', '19:30',
  '20:00'
];

// Fecha mínima: hoy
var inputFecha = document.getElementById('fecha');
var hoy = new Date();
var dd = String(hoy.getDate()).padStart(2, '0');
var mm = String(hoy.getMonth() + 1).padStart(2, '0');
var yyyy = hoy.getFullYear();
inputFecha.min = yyyy + '-' + mm + '-' + dd;

// Generar opciones de horas en el dropdown
var dropdown = document.getElementById('dropdownHoras');
HORAS.forEach(function(hora) {
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.classList.add('hora-opcion', 'disponible');
  btn.innerHTML = hora + '<span class="hora-badge">Disponible</span>';
  btn.addEventListener('click', function() {
    seleccionarHora(hora);
  });
  dropdown.appendChild(btn);
});

// Abrir y cerrar el selector de horas
var trigger = document.getElementById('triggerHoras');
trigger.addEventListener('click', function() {
  var abierto = dropdown.classList.contains('abierto');
  if (abierto) {
    cerrarSelector();
  } else {
    dropdown.classList.add('abierto');
    trigger.classList.add('abierto');
  }
});

// Cerrar si se hace click fuera
document.addEventListener('click', function(e) {
  var selector = document.getElementById('selectorHoras');
  if (!selector.contains(e.target)) {
    cerrarSelector();
  }
});

function cerrarSelector() {
  dropdown.classList.remove('abierto');
  trigger.classList.remove('abierto');
}

function seleccionarHora(hora) {
  document.getElementById('hora').value = hora;
  trigger.textContent = hora;
  trigger.classList.add('seleccionado', 'abierto');
  // Volver a añadir el svg al trigger
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.5');
  var poly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  poly.setAttribute('points', '6 9 12 15 18 9');
  svg.appendChild(poly);
  trigger.appendChild(svg);
  cerrarSelector();
  // Quitar error si había
  trigger.classList.remove('campo-error');
  document.getElementById('errorHora').classList.remove('visible');
}

// Nav - añade borde al hacer scroll
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

// Contador de caracteres
document.getElementById('mensaje').addEventListener('input', function() {
  document.getElementById('contador').textContent = this.value.length + ' / 300';
});

// Validar formulario
function validarFormulario() {
  var valido = true;

  var nombre = document.getElementById('nombre');
  var errorNombre = document.getElementById('errorNombre');
  if (nombre.value.trim().length < 2) {
    nombre.classList.add('campo-error');
    errorNombre.classList.add('visible');
    valido = false;
  } else {
    nombre.classList.remove('campo-error');
    errorNombre.classList.remove('visible');
  }

  var apellidos = document.getElementById('apellidos');
  var errorApellidos = document.getElementById('errorApellidos');
  if (apellidos.value.trim().length < 2) {
    apellidos.classList.add('campo-error');
    errorApellidos.classList.add('visible');
    valido = false;
  } else {
    apellidos.classList.remove('campo-error');
    errorApellidos.classList.remove('visible');
  }

  var email = document.getElementById('email');
  var errorEmail = document.getElementById('errorEmail');
  var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email.value.trim())) {
    email.classList.add('campo-error');
    errorEmail.classList.add('visible');
    valido = false;
  } else {
    email.classList.remove('campo-error');
    errorEmail.classList.remove('visible');
  }

  var telefono = document.getElementById('telefono');
  var errorTelefono = document.getElementById('errorTelefono');
  var regexTelefono = /^[\d\s\+\-]{9,15}$/;
  if (!regexTelefono.test(telefono.value.trim())) {
    telefono.classList.add('campo-error');
    errorTelefono.classList.add('visible');
    valido = false;
  } else {
    telefono.classList.remove('campo-error');
    errorTelefono.classList.remove('visible');
  }

  var fecha = document.getElementById('fecha');
  var errorFecha = document.getElementById('errorFecha');
  if (!fecha.value) {
    fecha.classList.add('campo-error');
    errorFecha.classList.add('visible');
    valido = false;
  } else {
    fecha.classList.remove('campo-error');
    errorFecha.classList.remove('visible');
  }

  var hora = document.getElementById('hora');
  var errorHora = document.getElementById('errorHora');
  if (!hora.value) {
    trigger.classList.add('campo-error');
    errorHora.classList.add('visible');
    valido = false;
  } else {
    trigger.classList.remove('campo-error');
    errorHora.classList.remove('visible');
  }

  var privacidad = document.getElementById('privacidad');
  var errorPrivacidad = document.getElementById('errorPrivacidad');
  if (!privacidad.checked) {
    errorPrivacidad.classList.add('visible');
    valido = false;
  } else {
    errorPrivacidad.classList.remove('visible');
  }

  return valido;
}

// Envío del formulario
document.getElementById('formularioCitas').addEventListener('submit', async function(e) {
  e.preventDefault();

  if (!validarFormulario()) return;

  var boton = document.getElementById('botonEnviar');
  boton.disabled = true;
  boton.textContent = 'Enviando...';

  var datos = {
    nombre:    document.getElementById('nombre').value.trim(),
    apellidos: document.getElementById('apellidos').value.trim(),
    email:     document.getElementById('email').value.trim(),
    telefono:  document.getElementById('telefono').value.trim(),
    fecha:     document.getElementById('fecha').value,
    hora:      document.getElementById('hora').value,
    mensaje:   document.getElementById('mensaje').value.trim()
  };

  try {
    var respuesta = await fetch(SUPABASE_URL + '/rest/v1/citas', {
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
    boton.textContent = 'Enviar solicitud';
  }
});

// Reiniciar formulario
function reiniciarFormulario() {
  document.getElementById('formularioCitas').reset();
  document.getElementById('contador').textContent = '0 / 300';
  document.getElementById('hora').value = '';
  trigger.textContent = 'Selecciona una hora';
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.5');
  var poly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  poly.setAttribute('points', '6 9 12 15 18 9');
  svg.appendChild(poly);
  trigger.appendChild(svg);
  trigger.classList.remove('seleccionado', 'campo-error');

  document.querySelectorAll('.campo-error').forEach(function(el) {
    el.classList.remove('campo-error');
  });
  document.querySelectorAll('.mensaje-error').forEach(function(el) {
    el.classList.remove('visible');
  });

  document.getElementById('botonEnviar').disabled = false;
  document.getElementById('botonEnviar').textContent = 'Enviar solicitud';
  document.getElementById('campos').classList.remove('oculto');
  document.getElementById('exito').classList.remove('visible');
}