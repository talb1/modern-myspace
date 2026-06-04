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

document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', closeModal);
});

document.getElementById('navLogin').addEventListener('click', () => openModal('loginModal'));
document.getElementById('navSignup').addEventListener('click', () => openModal('signupModal'));

document.getElementById('switchToSignup').addEventListener('click', e => {
  e.preventDefault();
  openModal('signupModal');
});
document.getElementById('switchToLogin').addEventListener('click', e => {
  e.preventDefault();
  openModal('loginModal');
});

document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  closeModal();
  showToast('Logged in successfully! 👋', 'success');
});

document.getElementById('signupForm').addEventListener('submit', e => {
  e.preventDefault();
  closeModal();
  showToast('Account created! Welcome to MySpace 🎉', 'success');
});

// ===== EDIT PROFILE =====
const profileAvatarEl   = document.getElementById('profileAvatar');
const profileNameEl     = document.getElementById('profileName');
const profileAgeEl      = document.getElementById('profileAge');
const profileTaglineEl  = document.getElementById('profileTagline');
const profileLocationEl = document.getElementById('profileLocation');
const profileGenreEl    = document.getElementById('profileGenre');
const postBoxAvatar     = document.querySelector('.post-box-avatar');

// Open edit profile modal, pre-fill current values
document.getElementById('editProfileBtn').addEventListener('click', () => {
  document.getElementById('editName').value     = profileNameEl.childNodes[0].textContent.trim();
  document.getElementById('editAge').value      = profileAgeEl.textContent.trim();
  document.getElementById('editTagline').value  = profileTaglineEl.textContent.trim();
  document.getElementById('editLocation').value = profileLocationEl.textContent.replace('📍 ', '').trim();
  document.getElementById('editGenre').value    = profileGenreEl.textContent.replace('🎵 ', '').trim();
  openModal('editProfileModal');
});

document.getElementById('editProfileForm').addEventListener('submit', e => {
  e.preventDefault();
  const name     = document.getElementById('editName').value.trim();
  const age      = document.getElementById('editAge').value.trim();
  const tagline  = document.getElementById('editTagline').value.trim();
  const location = document.getElementById('editLocation').value.trim();
  const genre    = document.getElementById('editGenre').value.trim();

  profileNameEl.childNodes[0].textContent = name + ' ';
  if (age)      profileAgeEl.textContent      = age;
  if (tagline)  profileTaglineEl.textContent  = tagline;
  if (location) profileLocationEl.textContent = '📍 ' + location;
  if (genre)    profileGenreEl.textContent    = '🎵 ' + genre;

  document.title = name + ' — MySpace';
  closeModal();
  showToast('Profile updated! ✨', 'success');
});

// ===== AVATAR EDIT =====
const avatarInput = document.getElementById('avatarInput');

document.getElementById('avatarWrap').addEventListener('click', () => avatarInput.click());

avatarInput.addEventListener('change', () => {
  const file = avatarInput.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  profileAvatarEl.src = url;
  if (postBoxAvatar) postBoxAvatar.src = url;
  // Update all "my" comment/guestbook avatars
  document.querySelectorAll('.comment-input-row .comment-avatar').forEach(img => img.src = url);
  avatarInput.value = '';
  showToast('Profile photo updated! 📷', 'success');
});

// ===== BANNER EDIT =====
const banners = [
  'linear-gradient(135deg, #4c1d95, #7c3aed, #a855f7, #ec4899)',
  'linear-gradient(135deg, #0f172a, #1e3a5f, #0ea5e9, #38bdf8)',
  'linear-gradient(135deg, #064e3b, #065f46, #10b981, #6ee7b7)',
  'linear-gradient(135deg, #7f1d1d, #991b1b, #ef4444, #fca5a5)',
  'linear-gradient(135deg, #1c1917, #292524, #a8a29e, #f5f5f4)',
  'linear-gradient(135deg, #4a044e, #86198f, #e879f9, #f0abfc)',
  'linear-gradient(135deg, #0c4a6e, #0369a1, #38bdf8, #7dd3fc)',
];
let bannerIndex = 0;
const profileBannerEl = document.getElementById('profileBanner');

document.getElementById('bannerEditBtn').addEventListener('click', e => {
  e.stopPropagation();
  bannerIndex = (bannerIndex + 1) % banners.length;
  profileBannerEl.style.background = banners[bannerIndex];
  showToast('Banner updated! 🎨', 'success');
});

// ===== PHOTO ATTACH =====
const photoInput = document.getElementById('photoInput');
const photoPreview = document.getElementById('photoPreview');
const photoPreviewImg = document.getElementById('photoPreviewImg');
let pendingPhoto = null;

document.getElementById('attachPhoto').addEventListener('click', () => photoInput.click());

photoInput.addEventListener('change', () => {
  const file = photoInput.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  photoPreviewImg.src = url;
  pendingPhoto = url;
  photoPreview.classList.remove('hidden');
  photoInput.value = '';
});

document.getElementById('removePhoto').addEventListener('click', () => {
  photoPreview.classList.add('hidden');
  photoPreviewImg.src = '';
  pendingPhoto = null;
});

// ===== MUSIC ATTACH =====
const songAttachPreview = document.getElementById('songAttachPreview');
const songAttachText = document.getElementById('songAttachText');
let pendingSong = null;

document.getElementById('attachMusic').addEventListener('click', () => openModal('musicModal'));

document.getElementById('musicForm').addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('songTitleInput').value.trim();
  const artist = document.getElementById('songArtistInput').value.trim();
  if (!title || !artist) return;
  pendingSong = { title, artist };
  songAttachText.textContent = `🎵 ${title} — ${artist}`;
  songAttachPreview.classList.remove('hidden');
  closeModal();
  e.target.reset();
});

document.getElementById('removeSong').addEventListener('click', () => {
  songAttachPreview.classList.add('hidden');
  pendingSong = null;
});

// ===== MOOD ATTACH (scroll to mood widget) =====
document.getElementById('attachMood').addEventListener('click', () => {
  const moodWidget = document.querySelector('.widget');
  moodWidget.scrollIntoView({ behavior: 'smooth', block: 'center' });
  moodWidget.classList.add('widget-highlight');
  setTimeout(() => moodWidget.classList.remove('widget-highlight'), 1500);
});

// ===== MOOD PICKER =====
const moodBtns = document.querySelectorAll('.mood-btn');
const moodEmoji = document.getElementById('moodEmoji');
const moodText = document.getElementById('moodText');

moodBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    moodBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    moodEmoji.textContent = btn.dataset.mood;
    moodText.textContent = btn.dataset.text;
    showToast(`Mood updated: ${btn.dataset.text}`, 'info');
  });
});

// ===== MUSIC PLAYER =====
const songs = [
  { title: 'Neon Dreams', artist: 'The Midnight', art: 'https://picsum.photos/seed/album1/60/60', duration: '3:42' },
  { title: 'Stranger', artist: 'Bad Omens', art: 'https://picsum.photos/seed/album3/60/60', duration: '3:15' },
  { title: 'Blinding Lights', artist: 'The Weeknd', art: 'https://picsum.photos/seed/album4/60/60', duration: '3:20' },
  { title: 'Heat Waves', artist: 'Glass Animals', art: 'https://picsum.photos/seed/album5/60/60', duration: '3:59' },
];

let currentSong = 0;
let playing = false;
let progress = 0;
let progressInterval = null;

const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const trackNameEl = document.getElementById('trackName');
const trackArtistEl = document.getElementById('trackArtist');
const trackArtEl = document.querySelector('.track-art');
const playlistItems = document.querySelectorAll('.playlist-item');

function loadSong(idx) {
  currentSong = idx;
  const s = songs[idx];
  trackNameEl.textContent = s.title;
  trackArtistEl.textContent = s.artist;
  trackArtEl.src = s.art;
  progress = 0;
  progressFill.style.width = '0%';
  currentTimeEl.textContent = '0:00';
  playlistItems.forEach((item, i) => item.classList.toggle('active', i === idx));
}

function formatTime(pct, duration) {
  const parts = duration.split(':').map(Number);
  const totalSec = parts[0] * 60 + parts[1];
  const current = Math.floor((pct / 100) * totalSec);
  const m = Math.floor(current / 60);
  const s = current % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function startProgress() {
  if (progressInterval) clearInterval(progressInterval);
  progressInterval = setInterval(() => {
    progress += 0.45;
    if (progress >= 100) { progress = 0; nextSong(); return; }
    progressFill.style.width = progress + '%';
    currentTimeEl.textContent = formatTime(progress, songs[currentSong].duration);
  }, 500);
}

function stopProgress() {
  if (progressInterval) clearInterval(progressInterval);
}

function togglePlay() {
  playing = !playing;
  playBtn.textContent = playing ? '⏸' : '▶';
  playing ? startProgress() : stopProgress();
}

function nextSong() {
  loadSong((currentSong + 1) % songs.length);
  if (playing) startProgress();
}

function prevSong() {
  loadSong((currentSong - 1 + songs.length) % songs.length);
  if (playing) startProgress();
}

playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);

playlistItems.forEach((item, i) => {
  item.addEventListener('click', () => {
    loadSong(i);
    if (!playing) togglePlay();
    else startProgress();
  });
});

// ===== SONG CARD PLAY BUTTONS =====
document.addEventListener('click', e => {
  const btn = e.target.closest('.song-share-card .btn-ghost');
  if (!btn) return;
  const card = btn.closest('.song-share-card');
  const title = card.querySelector('.song-share-title').textContent;
  const isPlaying = btn.textContent.trim().startsWith('⏸');
  btn.textContent = isPlaying ? '▶ Play' : '⏸ Pause';
  if (!isPlaying) showToast(`Now playing: ${title} 🎵`, 'info');
});

// ===== SHARE BUTTONS =====
document.addEventListener('click', e => {
  const btn = e.target.closest('.share-btn');
  if (!btn) return;
  const fakeUrl = `https://myspace.com/post/${Math.random().toString(36).slice(2, 8)}`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(fakeUrl).then(() => showToast('Link copied! 🔗', 'success'));
  } else {
    showToast('Link copied! 🔗', 'success');
  }
});

// ===== REACTION BUTTONS =====
document.addEventListener('click', e => {
  const btn = e.target.closest('.react-btn');
  if (!btn || btn.classList.contains('share-btn')) return;
  if (btn.dataset.type === 'comment') return;
  const countEl = btn.querySelector('span');
  if (!countEl) return;
  const reacted = btn.classList.toggle('reacted');
  countEl.textContent = parseInt(countEl.textContent) + (reacted ? 1 : -1);
});

// ===== TOGGLE COMMENTS =====
function toggleComments(btn) {
  const card = btn.closest('.post-card');
  const section = card.querySelector('.comments-section');
  section.classList.toggle('hidden');
  const countEl = btn.querySelector('span');
  if (countEl) btn.classList.toggle('reacted', !section.classList.contains('hidden'));
}

// ===== COMMENT INPUT: Enter to submit =====
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const input = e.target.closest('.comment-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  const row = input.closest('.comment-input-row');
  const section = input.closest('.comments-section');
  const comment = document.createElement('div');
  comment.className = 'comment';
  comment.innerHTML = `
    <img class="comment-avatar" src="https://i.pravatar.cc/28?img=47" alt="" />
    <div class="comment-body"><strong>Tal Bogachov</strong> ${escapeHtml(text)}</div>
  `;
  section.insertBefore(comment, row);
  input.value = '';

  const card = section.closest('.post-card');
  const commentBtn = card.querySelector('.react-btn[data-type="comment"] span');
  if (commentBtn) commentBtn.textContent = parseInt(commentBtn.textContent) + 1;
});

// ===== STATUS POST =====
const postBtn = document.getElementById('postBtn');
const statusInput = document.getElementById('statusInput');
const feed = document.getElementById('feed');

postBtn.addEventListener('click', () => {
  const text = statusInput.value.trim();
  if (!text && !pendingPhoto && !pendingSong) return;

  let extraHTML = '';
  if (pendingPhoto) {
    extraHTML += `<div class="post-image-wrap"><img class="post-image" src="${pendingPhoto}" alt="photo" /></div>`;
  }
  if (pendingSong) {
    extraHTML += `
      <div class="song-share-card">
        <img src="https://picsum.photos/seed/${pendingSong.title}/56/56" alt="Album" />
        <div>
          <div class="song-share-title">${escapeHtml(pendingSong.title)}</div>
          <div class="song-share-artist">${escapeHtml(pendingSong.artist)}</div>
        </div>
        <button class="btn-ghost small">▶ Play</button>
      </div>`;
  }

  const card = document.createElement('article');
  card.className = 'post-card';
  card.innerHTML = `
    <div class="post-header">
      <img class="post-avatar" src="https://i.pravatar.cc/40?img=47" alt="" />
      <div>
        <span class="post-author">Tal Bogachov</span>
        <span class="post-time">Just now</span>
      </div>
    </div>
    ${text ? `<p class="post-body">${escapeHtml(text)}</p>` : ''}
    ${extraHTML}
    <div class="post-actions">
      <button class="react-btn" data-type="heart">❤️ <span>0</span></button>
      <button class="react-btn" data-type="fire">🔥 <span>0</span></button>
      <button class="react-btn" data-type="comment" onclick="toggleComments(this)">💬 <span>0</span></button>
      <button class="react-btn share-btn">↗ Share</button>
    </div>
    <div class="comments-section hidden">
      <div class="comment-input-row">
        <img class="comment-avatar" src="https://i.pravatar.cc/28?img=47" alt="" />
        <input class="comment-input" placeholder="Add a comment..." />
      </div>
    </div>
  `;

  feed.insertBefore(card, feed.firstChild);
  statusInput.value = '';

  // Reset attachments
  pendingPhoto = null;
  pendingSong = null;
  photoPreview.classList.add('hidden');
  photoPreviewImg.src = '';
  songAttachPreview.classList.add('hidden');

  card.style.opacity = '0';
  card.style.transform = 'translateY(-10px)';
  requestAnimationFrame(() => {
    card.style.transition = 'opacity 0.3s, transform 0.3s';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  });
  showToast('Posted! ✨', 'success');
});

statusInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) postBtn.click();
});

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ===== GUESTBOOK =====
const gbBtn = document.getElementById('gbBtn');
const gbInput = document.getElementById('gbInput');
const guestbook = document.getElementById('guestbook');

gbBtn.addEventListener('click', () => {
  const msg = gbInput.value.trim();
  if (!msg) return;
  const entry = document.createElement('div');
  entry.className = 'gb-entry';
  entry.innerHTML = `
    <img src="https://i.pravatar.cc/32?img=47" alt="" />
    <div>
      <strong>Tal Bogachov</strong>
      <p>${escapeHtml(msg)}</p>
      <span class="gb-time">Just now</span>
    </div>
  `;
  guestbook.insertBefore(entry, guestbook.firstChild);
  gbInput.value = '';
  showToast('Guestbook entry posted! 📝', 'success');
});

gbInput.addEventListener('keydown', e => { if (e.key === 'Enter') gbBtn.click(); });

// ===== TOP 8 MINI PROFILE POPUP =====
const miniProfileData = {
  Jamie:  { img: 'https://i.pravatar.cc/80?img=12', status: '🎸 at rehearsal rn' },
  Morgan: { img: 'https://i.pravatar.cc/80?img=5',  status: '💻 working from home' },
  Casey:  { img: 'https://i.pravatar.cc/80?img=28', status: '🌅 out on a drive' },
  Sam:    { img: 'https://i.pravatar.cc/80?img=33', status: '🎵 in the music zone' },
  Riley:  { img: 'https://i.pravatar.cc/80?img=19', status: '📚 studying... maybe' },
  Jordan: { img: 'https://i.pravatar.cc/80?img=44', status: '🔥 on fire today' },
  Taylor: { img: 'https://i.pravatar.cc/80?img=60', status: '😴 napping lol' },
  Drew:   { img: 'https://i.pravatar.cc/80?img=15', status: '🌙 late night vibes' },
};

const miniProfile = document.getElementById('miniProfile');
const miniAvatar = document.getElementById('miniAvatar');
const miniName = document.getElementById('miniName');
const miniStatus = document.getElementById('miniStatus');

document.querySelectorAll('.top8-item').forEach(item => {
  item.addEventListener('click', e => {
    const name = item.querySelector('span').textContent;
    const data = miniProfileData[name];
    if (!data) return;

    miniAvatar.src = data.img;
    miniName.textContent = name;
    miniStatus.textContent = data.status;

    const rect = item.getBoundingClientRect();
    miniProfile.style.top = (rect.bottom + window.scrollY + 8) + 'px';
    miniProfile.style.left = Math.min(rect.left + window.scrollX, window.innerWidth - 220) + 'px';
    miniProfile.classList.remove('hidden');
    miniProfile.classList.add('visible');

    document.getElementById('miniMsg').onclick = () => {
      document.getElementById('messageRecipient').textContent = name;
      openModal('messageModal');
      hideMiniProfile();
    };
  });
});

document.getElementById('miniClose').addEventListener('click', hideMiniProfile);
document.getElementById('miniView').addEventListener('click', () => {
  showToast('Profile pages coming soon! 👀', 'info');
  hideMiniProfile();
});

function hideMiniProfile() {
  miniProfile.classList.remove('visible');
  setTimeout(() => miniProfile.classList.add('hidden'), 180);
}

document.addEventListener('click', e => {
  if (!miniProfile.contains(e.target) && !e.target.closest('.top8-item')) hideMiniProfile();
});

// ===== NAV LINKS =====
document.querySelector('.nav-links').addEventListener('click', e => {
  const link = e.target.closest('a');
  if (!link) return;
  e.preventDefault();
  const label = link.textContent.trim();
  if (label === 'Home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (label === 'Browse') {
    showToast('Browse is coming soon! 🔍', 'info');
  } else if (label === 'Search') {
    showToast('Search is coming soon! 🔎', 'info');
  } else if (label === 'Invite') {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('https://myspace.com/invite/abc123')
        .then(() => showToast('Invite link copied! Share it with friends 🤙', 'success'));
    } else {
      showToast('Invite link copied! 🤙', 'success');
    }
  }
});
