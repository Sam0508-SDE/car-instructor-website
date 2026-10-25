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


// ---- Scroll reveal (hidden state only applied when JS runs) ----
(function () {
  const sel = '.section > .container > *, .card, .price-card, details, .about > *, .hero-grid > *';
  const els = document.querySelectorAll(sel);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
  els.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.setProperty('--d', ((i % 4) * 70) + 'ms');
    io.observe(el);
  });
  // safety net: never leave content hidden
  setTimeout(() => els.forEach((el) => el.classList.add('in')), 4000);
})();

// ---- Header shadow + active nav link ----
(function () {
  const header = document.querySelector('.site-header');
  const links = [...document.querySelectorAll('#nav a[href^="#"]')].filter((a) => !a.classList.contains('btn'));
  const secs = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  function update() {
    header.classList.toggle('scrolled', window.scrollY > 8);
    const y = window.scrollY + 120;
    let cur = null;
    secs.forEach((s) => { if (s.offsetTop <= y) cur = s.id; });
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4 && secs.length) cur = secs[secs.length - 1].id;
    links.forEach((a) => {
      const on = a.getAttribute('href') === '#' + cur;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// ---- Mobile sticky action bar ----
(function () {
  const bar = document.createElement('div');
  bar.className = 'mobile-bar';
  bar.innerHTML = '<a class="mb-call" href="tel:+61470380859">Call</a><a class="mb-book" href="#contact">Book a lesson</a>';
  document.body.appendChild(bar);
  document.body.classList.add('has-mobile-bar');
})();

// ---- Contact form ----
// No backend yet: build a mailto link from the form.
const EMAIL = 'info@veesdrivingschool.com.au';
const form = document.getElementById('contact-form');
const msg = form.querySelector('.form-msg');
const submitBtn = form.querySelector('button[type="submit"]');

function setMsg(text, kind) {
  msg.textContent = text;
  msg.classList.remove('is-error', 'is-success');
  if (kind) msg.classList.add('is-' + kind);
}
function checkField(input) {
  const bad = input.required && !input.value.trim();
  input.classList.toggle('invalid', bad);
  if (bad) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
  return !bad;
}
form.querySelectorAll('input[required]').forEach((inp) => {
  inp.addEventListener('blur', () => checkField(inp));
  inp.addEventListener('input', () => { if (inp.classList.contains('invalid')) checkField(inp); });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (submitBtn.disabled) return;
  const fields = [...form.querySelectorAll('input[required]')];
  const results = fields.map(checkField);
  if (results.includes(false)) {
    setMsg('Please enter your name and phone number.', 'error');
    fields[results.indexOf(false)].focus();
    return;
  }
  const data = new FormData(form);
  const body = `Name: ${data.get('name')}\nPhone: ${data.get('phone')}\nLesson: ${data.get('type')}\n\n${data.get('message')}`;
  submitBtn.disabled = true;
  const label = submitBtn.textContent;
  submitBtn.textContent = 'Opening email...';
  setMsg('Opening your email app. If nothing happens, call 0470 380 859.', 'success');
  window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Lesson enquiry')}&body=${encodeURIComponent(body)}`;
  setTimeout(() => { submitBtn.disabled = false; submitBtn.textContent = label; }, 4000);
});
