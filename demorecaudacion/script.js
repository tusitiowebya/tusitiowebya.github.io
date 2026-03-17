// Initialize progress bar animation on page load
document.addEventListener('DOMContentLoaded', function() {
  const progressBar = document.getElementById('progressBar');
  const raised = 12714480;
  const goal = 17659000;
  const percentage = Math.round((raised / goal) * 100);
  
  // Animate progress bar after a short delay
  setTimeout(function() {
    progressBar.style.width = percentage + '%';
  }, 100);
});

// Smooth scroll to section
function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

document.addEventListener("keydown", (e) => {
  if (
    e.key === "F12" ||
    (e.ctrlKey && e.shiftKey && e.key === "I") ||
    (e.ctrlKey && e.shiftKey && e.key === "J") ||
    (e.ctrlKey && e.key === "U")
  ) {
    e.preventDefault();
  }
});
// Copy to clipboard function
async function copyToClipboard(text, button) {
  try {
    await navigator.clipboard.writeText(text);
    
    // Store original content
    const originalHTML = button.innerHTML;
    
    // Show success state
    button.innerHTML = `
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>Copiado</span>
    `;
    button.classList.add('btn-success');
    button.classList.remove('btn-secondary');
    
    // Reset after 2 seconds
    setTimeout(function() {
      button.innerHTML = originalHTML;
      button.classList.remove('btn-success');
      button.classList.add('btn-secondary');
    }, 2000);
    
  } catch (err) {
    console.error('Error al copiar:', err);
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      
      // Show success state
      const originalHTML = button.innerHTML;
      button.innerHTML = `
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Copiado</span>
      `;
      button.classList.add('btn-success');
      button.classList.remove('btn-secondary');
      
      setTimeout(function() {
        button.innerHTML = originalHTML;
        button.classList.remove('btn-success');
        button.classList.add('btn-secondary');
      }, 2000);
      
    } catch (fallbackErr) {
      console.error('Fallback copy failed:', fallbackErr);
    }
    
    document.body.removeChild(textArea);
  }
}

// Accordion toggle function
function toggleAccordion(trigger) {
  const item = trigger.closest('.accordion-item');
  const isActive = item.classList.contains('active');
  
  // Close all accordion items first (for single-open behavior)
  document.querySelectorAll('.accordion-item').forEach(function(accItem) {
    accItem.classList.remove('active');
  });
  
  // Toggle the clicked item
  if (!isActive) {
    item.classList.add('active');
  }
}
