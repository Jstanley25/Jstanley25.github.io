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
const triggers = document.querySelectorAll('.popup-trigger');
const popup = document.getElementById('popup-gallery');
const galleryImages = document.querySelector('.gallery-images');
const closeBtn = document.querySelector('.close-btn');

triggers.forEach(trigger => {
  trigger.addEventListener('click', () => {
    const imgs = trigger.dataset.images.split(',');
    galleryImages.innerHTML = imgs.map(src => `<img src="${src}" alt="Gallery Image">`).join('');
    popup.style.display = 'flex';
  });
});
closeBtn.addEventListener('click', () => popup.style.display = 'none');