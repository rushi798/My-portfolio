document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('[data-animate]');
  const yearEl = document.getElementById('year');

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const typedEl = document.querySelector('.typed-text');
  if (typedEl) {
    const words = (() => {
      try {
        return JSON.parse(typedEl.dataset.words || '[]');
      } catch {
        return [];
      }
    })();
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      if (!words.length) return;
      const currentWord = words[wordIndex % words.length];
      const nextText = isDeleting
        ? currentWord.substring(0, charIndex--)
        : currentWord.substring(0, charIndex++);

      typedEl.textContent = nextText || '\u00a0';

      if (!isDeleting && nextText === currentWord) {
        isDeleting = true;
        setTimeout(type, 1500);
        return;
      }

      if (isDeleting && nextText === '') {
        isDeleting = false;
        wordIndex++;
      }

      const delay = isDeleting ? 60 : 110;
      setTimeout(type, delay);
    };

    type();
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    animatedElements.forEach(el => observer.observe(el));
  } else {
    animatedElements.forEach(el => el.classList.add('active'));
  }

  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(form);
      const name = formData.get('name') || 'there';

      form.reset();

      const toast = document.createElement('div');
      toast.className = 'toast align-items-center text-bg-dark border-0 show position-fixed top-0 end-0 m-3';
      toast.setAttribute('role', 'alert');
      toast.innerHTML = `
        <div class="d-flex">
          <div class="toast-body">
            Thanks ${name}! Your message has been received.
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      `;

      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 4000);
    });
  }
});

