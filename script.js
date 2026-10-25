const toggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('nav');

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
nav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

document.getElementById('year').textContent = new Date().getFullYear();

// No backend yet: build a mailto link from the form.
const EMAIL = 'hello@example.com';
const form = document.getElementById('contact-form');
const msg = form.querySelector('.form-msg');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  if (!data.get('name').trim() || !data.get('phone').trim()) {
    msg.textContent = 'Please enter your name and phone number.';
    return;
  }
  const body = `Name: ${data.get('name')}\nPhone: ${data.get('phone')}\nLesson: ${data.get('type')}\n\n${data.get('message')}`;
  window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Lesson enquiry')}&body=${encodeURIComponent(body)}`;
  msg.textContent = 'Opening your email app...';
});
