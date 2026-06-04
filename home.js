'use strict';

// ===== TOAST =====
function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// ===== MODAL =====
const overlay = document.getElementById('modalOverlay');

function openModal(id) {
  document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
  overlay.classList.remove('hidden');
  document.getElementById(id).classList.remove('hidden');
  requestAnimationFrame(() => {
    overlay.classList.add('visible');
    document.getElementById(id).classList.add('visible');
  });
}

function closeModal() {
  overlay.classList.remove('visible');
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('visible'));
  setTimeout(() => {
    overlay.classList.add('hidden');
    document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
  }, 200);
}

overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', closeModal));

document.getElementById('navLogin').addEventListener('click', () => openModal('loginModal'));
document.getElementById('navSignup').addEventListener('click', () => openModal('signupModal'));
document.getElementById('heroSignup').addEventListener('click', () => openModal('signupModal'));
document.getElementById('heroLogin').addEventListener('click', () => openModal('loginModal'));
document.getElementById('ctaSignup').addEventListener('click', () => openModal('signupModal'));

document.getElementById('switchToSignup').addEventListener('click', e => { e.preventDefault(); openModal('signupModal'); });
document.getElementById('switchToLogin').addEventListener('click', e => { e.preventDefault(); openModal('loginModal'); });

document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  closeModal();
  // Redirect to profile after short delay
  setTimeout(() => { window.location.href = 'profile.html'; }, 400);
});

document.getElementById('signupForm').addEventListener('submit', e => {
  e.preventDefault();
  closeModal();
  setTimeout(() => { window.location.href = 'profile.html'; }, 400);
});
