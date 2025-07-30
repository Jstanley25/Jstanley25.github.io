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
