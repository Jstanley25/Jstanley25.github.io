// =========================
// Smooth Scroll for Anchor Links
// =========================
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const id = link.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});

// =========================
// Email Form Submission
// =========================
function sendEmail(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    alert("Please fill out all fields before sending.");
    return;
  }

  const subject = `Portfolio Inquiry from ${name}`;
  const body = `Hello John,\n\nMy name is ${name} (${email}).\n\n${message}\n\nBest regards,\n${name}`;

  // Encode mailto link
  const mailtoLink = `mailto:Jstanley25@student.umgc.edu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Open default email client
  window.location.href = mailtoLink;
}

// =========================
// Popup Gallery
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const triggers = document.querySelectorAll('.popup-trigger');
  const popup = document.getElementById('popup-gallery');
  const galleryMedia = document.querySelector('.gallery-images');
  const closeBtn = popup.querySelector('.close-btn');
  let currentIndex = 0;
  let mediaArray = [];

  // Open gallery
  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      mediaArray = trigger.dataset.media.split(',').map(item => item.trim());
      currentIndex = 0;
      showMedia();
      popup.style.display = 'flex';
    });
  });

  // Navigate gallery on click
  popup.addEventListener('click', () => {
    if (mediaArray.length > 1) {
      currentIndex = (currentIndex + 1) % mediaArray.length;
      showMedia();
    }
  });

  // Close popup
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    popup.style.display = 'none';
    galleryMedia.innerHTML = '';
  });

  // Display selected media
  function showMedia() {
    const src = mediaArray[currentIndex];
    const isVideo = /\.(mp4|webm|ogg)$/i.test(src);

    galleryMedia.innerHTML = isVideo
      ? `<video controls autoplay style="max-width:90%;max-height:90%;">
           <source src="${src}" type="video/mp4">
           Your browser does not support the video tag.
         </video>`
      : `<img src="${src}" alt="Gallery Media" style="max-width:90%;max-height:90%;">`;
  }
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.open-game').forEach(btn => {
        btn.addEventListener('click', () => {
            const game = btn.dataset.game;
            const popupGame = document.getElementById('popup-game');
            popupGame.style.display = 'flex';

            const canvas = document.getElementById('gameCanvas');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (game === 'pong' && typeof startPong === 'function') startPong();
            if (game === 'snake' && typeof startSnake === 'function') startSnake();
            if (game === 'breakout' && typeof startBreakout === 'function') startBreakout();
        });
    });

    document.querySelector('#popup-game .close-btn').addEventListener('click', () => {
        document.getElementById('popup-game').style.display = 'none';
    });
});


