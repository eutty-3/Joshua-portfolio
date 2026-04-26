  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => observer.observe(el));

  // Stagger reveal children in skills/projects grids
  document.querySelectorAll('.skills-grid .skill-card, .projects-grid .project-card').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 0.12}s`;
  });

  // Form submit
  function handleSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const btn = form.querySelector('.form-btn');

  const data = {
    first_name: form.querySelectorAll('.form-input')[0].value,
    last_name: form.querySelectorAll('.form-input')[1].value,
    email: form.querySelectorAll('.form-input')[2].value,
    subject: form.querySelectorAll('.form-input')[3].value,
    message: form.querySelector('.form-textarea').value
  };
/* ✅ VALIDATION SAFETY (ADD HERE) */
if (
  !data.first_name ||
  !data.last_name ||
  !data.email ||
  !data.subject ||
  !data.message
) {
  alert("⚠️ Please fill in all fields");
  btn.textContent = "Send Message";
  return;
}

/* continue only if valid */
btn.textContent = "Sending...";

  fetch("https://joshua-portfolio-ed1d.onrender.com/api/contact", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
})
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      btn.textContent = "Message Sent ✓";
      btn.style.background = "#2a7a4b";
      form.reset();
    } else {
      throw new Error();
    }
  })
  .catch(() => {
    btn.textContent = "Failed ❌";
    btn.style.background = "#a83232";
  });

  setTimeout(() => {
    btn.textContent = "Send Message";
    btn.style.background = "";
  }, 3000);
}

  // Nav active state on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current
        ? 'var(--gold)' : '';
    });
  });