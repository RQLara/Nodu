// Nav scroll
window.addEventListener('scroll', function() {
  var nav = document.getElementById('nav');
  if (window.scrollY > 20) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});
 
// Menú hamburguesa
document.getElementById('hamburger').addEventListener('click', function() {
  this.classList.toggle('open');
  document.getElementById('menu').classList.toggle('open');
});
 
// Animaciones al hacer scroll
var elementos = document.querySelectorAll('.reveal');
 
var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
 
elementos.forEach(function(el) {
  observer.observe(el);
});