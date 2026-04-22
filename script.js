// ── Navbar scroll effect ──
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Fade-in on scroll ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.skill-card, .project-card, .fact-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(el);
});

// ── COMMENT SYSTEM ──
const STORAGE_KEY = 'portfolio_comments_riyadh';

function getComments() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch { return []; }
}

function saveComment(comment) {
  const comments = getComments();
  comments.unshift(comment);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getInitials(name) {
  return name.trim().split(' ').slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderComments() {
  const list = document.getElementById('commentsList');
  const loading = document.getElementById('commentsLoading');
  const comments = getComments();

  if (loading) loading.remove();

  const existing = list.querySelectorAll('.comment-item');
  existing.forEach(el => el.remove());

  if (comments.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'comments-empty';
    empty.id = 'commentsEmpty';
    empty.textContent = 'Belum ada komentar. Jadilah yang pertama!';
    list.appendChild(empty);
    return;
  }

  const emptyEl = document.getElementById('commentsEmpty');
  if (emptyEl) emptyEl.remove();

  comments.forEach(c => {
    const item = document.createElement('div');
    item.className = 'comment-item';
    item.innerHTML = `
      <div class="comment-avatar">${getInitials(c.name)}</div>
      <div class="comment-body">
        <div class="comment-meta">
          <span class="comment-name">${escapeHtml(c.name)}</span>
          <span class="comment-date">${formatDate(c.date)}</span>
        </div>
        <p class="comment-text">${escapeHtml(c.message)}</p>
      </div>`;
    list.appendChild(item);
  });
}

function submitComment(e) {
  e.preventDefault();
  const name = document.getElementById('c-name').value.trim();
  const message = document.getElementById('c-msg').value.trim();
  const status = document.getElementById('formStatus');
  const btn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');

  if (!name || !message) return;

  btn.disabled = true;
  btnText.textContent = 'Mengirim...';

  setTimeout(() => {
    saveComment({ name, message, date: new Date().toISOString() });
    renderComments();
    document.getElementById('commentForm').reset();
    status.textContent = '✦ Pesan terkirim! Terima kasih.';
    status.className = 'form-status success';
    btn.disabled = false;
    btnText.textContent = 'Kirim Pesan';
    setTimeout(() => {
      status.textContent = '';
      status.className = 'form-status';
    }, 4000);
  }, 600);
}

// ── Init ──
renderComments();
