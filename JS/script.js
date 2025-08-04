// Smooth scroll for anchor links
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const id = link.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});


function sendEmail(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  const subject = `Portfolio Inquiry from ${name}`;
  const body = `Hello John,\n\nMy name is ${name} (${email}).\n\n${message}\n\nBest regards,\n${name}`;

  // Encode for URL
  const mailtoLink = `mailto:Jstanley25@student.umgc.edu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Open email client
  window.location.href = mailtoLink;
}

// JS for popup gallery
document.addEventListener("DOMContentLoaded", () => {
  const triggers = document.querySelectorAll('.popup-trigger');
  const popup = document.getElementById('popup-gallery');
  const galleryMedia = document.querySelector('.gallery-images');
  const closeBtn = document.querySelector('.close-btn');
  let currentIndex = 0;
  let mediaArray = [];

  // Open gallery
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      mediaArray = trigger.dataset.media.split(',');
      currentIndex = 0;
      showMedia();
      popup.style.display = 'flex';
    });
  });

  // Show next media on click
  popup.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % mediaArray.length;
    showMedia();
  });

  // Close button
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    popup.style.display = 'none';
  });

  function showMedia() {
    const src = mediaArray[currentIndex].trim();
    const isVideo = src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.ogg');

    if (isVideo) {
      galleryMedia.innerHTML = `
        <video controls autoplay style="max-width:90%;max-height:90%;">
          <source src="${src}" type="video/mp4">
          Your browser does not support the video tag.
        </video>`;
    } else {
      galleryMedia.innerHTML = `<img src="${src}" alt="Gallery Media" style="max-width:90%;max-height:90%;">`;
    }
  }
});

