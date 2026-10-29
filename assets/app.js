/**
 * CARDIAC SUPERNOVA — Documentary Motion Engine
 * Inspired by Hello Monday's "In My World" (Awwwards Site of the Year)
 */

document.addEventListener('DOMContentLoaded', () => {
  setupEyelidBlink();
  setupTilt();
  setupBadge3D();
  setupDocumentModal();
  setupToast();
});

/* --- 1. The "Blink" Transition (Eyelid Aperture) --- */
function setupEyelidBlink() {
  const shutter = document.getElementById('eyelidShutter');
  if (!shutter) return;

  // Intercept internal navigation to simulate human eye blink
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    // Only internal relative links, not anchors or downloads
    if (href && !href.startsWith('#') && !href.startsWith('http') && !link.hasAttribute('download')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        shutter.classList.add('blink');
        setTimeout(() => {
          window.location.href = href;
        }, 340);
      });
    }
  });

  // Open eyes on page load
  window.addEventListener('pageshow', () => {
    shutter.classList.remove('blink');
  });
}

/* --- 2. 3D Perspective Tilt with Smooth Damping --- */
function setupTilt() {
  const tiltElements = document.querySelectorAll('[data-tilt]');
  tiltElements.forEach(el => {
    let bounds;
    
    function handleMove(e) {
      bounds = el.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;
      const cx = bounds.width / 2;
      const cy = bounds.height / 2;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;
      
      const maxTilt = 10; // degrees
      el.style.transform = `perspective(1000px) rotateX(${(-dy * maxTilt).toFixed(2)}deg) rotateY(${(dx * maxTilt).toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    }

    el.addEventListener('mouseenter', () => {
      bounds = el.getBoundingClientRect();
      el.addEventListener('mousemove', handleMove);
    });

    el.addEventListener('mouseleave', () => {
      el.removeEventListener('mousemove', handleMove);
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* --- 3. Bedside Pocket Badge 3D Flip --- */
function setupBadge3D() {
  const badge = document.getElementById('bedsideBadge3D');
  const trigger = document.getElementById('badgeFlipTrigger');
  if (!badge) return;

  function flip() {
    badge.classList.toggle('flipped');
  }

  badge.addEventListener('click', flip);
  if (trigger) trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    flip();
  });
}

/* --- 4. High-Resolution Exhibition Modal --- */
function setupDocumentModal() {
  const overlay = document.getElementById('modalOverlay');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalPdf = document.getElementById('modalPdf');
  const modalPng = document.getElementById('modalPng');
  const closeBtn = document.getElementById('modalCloseBtn');
  if (!overlay) return;

  document.querySelectorAll('[data-open-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const src = trigger.getAttribute('data-img-src');
      const title = trigger.getAttribute('data-title') || 'Visual Framework';
      const pdf = trigger.getAttribute('data-pdf-src') || '#';

      modalImg.src = src;
      modalTitle.textContent = title;
      modalPdf.href = pdf;
      modalPng.href = src;

      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });
}

/* --- 5. Clipboard & Toast --- */
function setupToast() {
  window.copyClip = function(text, label = 'Copied to clipboard') {
    navigator.clipboard.writeText(text).then(() => {
      triggerToast(label);
    }).catch(() => {
      triggerToast('Copied: ' + text);
    });
  };
}

function triggerToast(msg) {
  let toast = document.getElementById('docToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'docToast';
    toast.className = 'toast-bubble';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> <span>${msg}</span>`;
  toast.classList.add('visible');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('visible');
  }, 2400);
}
