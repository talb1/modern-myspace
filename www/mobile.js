'use strict';

// ===== BOTTOM NAV TABS =====
const tabs = {
  profile: document.querySelector('.sidebar-left'),
  feed:    document.querySelector('.main-feed'),
  friends: document.querySelector('.sidebar-right'),
  messages: null,
};

const navBtns = document.querySelectorAll('.bottom-nav-btn[data-tab]');

function switchTab(tab) {
  // Hide all panels
  document.querySelector('.main-feed').style.display = 'none';
  const left = document.querySelector('.sidebar-left');
  const right = document.querySelector('.sidebar-right');
  left.style.display = 'none';
  right.style.display = 'none';

  navBtns.forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

  if (tab === 'profile') {
    left.style.display = 'block';
    left.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (tab === 'feed') {
    document.querySelector('.main-feed').style.display = 'block';
  } else if (tab === 'friends') {
    right.style.display = 'block';
  } else if (tab === 'messages') {
    document.querySelector('.main-feed').style.display = 'block';
    showToast('Messages coming soon! 💬', 'info');
    document.querySelector('[data-tab="feed"]').classList.add('active');
    document.querySelector('[data-tab="messages"]').classList.remove('active');
  }
}

// Start on feed tab
switchTab('feed');

navBtns.forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// ===== FAB: open post box =====
document.getElementById('fabPost').addEventListener('click', () => {
  switchTab('feed');
  setTimeout(() => {
    const input = document.getElementById('statusInput');
    input.focus();
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
});

// ===== PULL TO REFRESH FEEL =====
let touchStartY = 0;
document.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; }, { passive: true });
document.addEventListener('touchend', e => {
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (dy > 80 && window.scrollY === 0) {
    showToast('Feed refreshed ✨', 'success');
  }
}, { passive: true });
