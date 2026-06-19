/**
 * Portfolio - Main JavaScript Module
 * Handles: Navigation, Smooth Scrolling, Form Validation, Animations
 * Author: Hossam Mohamed
 */

// ============================================
// MODULE: Smooth Scrolling
// ============================================
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Close mobile menu if open
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          const closeBtn = document.querySelector('.navbar-toggler');
          closeBtn.click();
        }
      }
    });
  });
};

// ============================================
// MODULE: Form Validation
// ============================================
const FormValidator = {
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validateForm(formElement) {
    const errors = {};
    const name = formElement.querySelector('#name').value.trim();
    const email = formElement.querySelector('#email').value.trim();
    const message = formElement.querySelector('#message').value.trim();

    // Validate name
    if (!name) {
      errors.name = 'Name is required';
    } else if (name.length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }

    // Validate email
    if (!email) {
      errors.email = 'Email is required';
    } else if (!this.validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Validate message
    if (!message) {
      errors.message = 'Message is required';
    } else if (message.length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  },

  displayErrors(form, errors) {
    // Clear previous errors
    form.querySelectorAll('.invalid-feedback').forEach(el => {
      el.textContent = '';
    });
    form.querySelectorAll('.form-control').forEach(el => {
      el.classList.remove('is-invalid');
    });

    // Display new errors
    Object.keys(errors).forEach(field => {
      const input = form.querySelector(`#${field}`);
      const feedback = input.nextElementSibling;
      
      if (input && feedback) {
        input.classList.add('is-invalid');
        feedback.textContent = errors[field];
      }
    });
  },

  clearErrors(form) {
    form.querySelectorAll('.form-control').forEach(el => {
      el.classList.remove('is-invalid');
    });
    form.querySelectorAll('.invalid-feedback').forEach(el => {
      el.textContent = '';
    });
  }
};

// ============================================
// MODULE: Form Submission
// ============================================
const initContactForm = () => {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    FormValidator.clearErrors(form);

    // Validate form
    const { isValid, errors } = FormValidator.validateForm(form);
    
    if (!isValid) {
      FormValidator.displayErrors(form, errors);
      return;
    }

    // Disable button and show loading state
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';

    try {
      // Get form data
      const formData = new FormData(form);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        timestamp: new Date().toISOString()
      };

      // Note: This is a client-side implementation.
      // In production, you would send this to a backend service (e.g., EmailJS, Formspree)
      // Example: await sendToBackend(data);

      // Simulate API call (for demonstration)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      AlertManager.show(
        'Message sent successfully! I\'ll get back to you soon.',
        'success'
      );

      // Reset form
      form.reset();
      FormValidator.clearErrors(form);

      // Log for debugging (remove in production)
      console.log('Form submitted:', data);

    } catch (error) {
      AlertManager.show(
        'An error occurred while sending your message. Please try again.',
        'danger'
      );
      console.error('Form submission error:', error);
    } finally {
      // Restore button state
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });

  // Clear errors on input
  form.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('change', () => {
      input.classList.remove('is-invalid');
      input.nextElementSibling.textContent = '';
    });
  });
};

// ============================================
// MODULE: Alert Manager
// ============================================
const AlertManager = {
  show(message, type = 'info', duration = 5000) {
    const container = document.getElementById('alertContainer');
    if (!container) return;

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    container.appendChild(alertDiv);

    // Auto-remove after duration
    if (duration > 0) {
      const timeout = setTimeout(() => {
        alertDiv.remove();
      }, duration);

      // Clear timeout if dismissed manually
      alertDiv.addEventListener('close.bs.alert', () => {
        clearTimeout(timeout);
      });
    }
  },

  success(message, duration = 5000) {
    this.show(message, 'success', duration);
  },

  error(message, duration = 5000) {
    this.show(message, 'danger', duration);
  },

  info(message, duration = 5000) {
    this.show(message, 'info', duration);
  }
};

// ============================================
// MODULE: Navbar Scroll Effects
// ============================================
const initNavbarScrollEffect = () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Add shadow on scroll
    if (scrollY > 50) {
      navbar.style.boxShadow = 'var(--shadow-sm)';
      navbar.style.borderBottomColor = 'rgba(0, 212, 255, 0.2)';
    } else {
      navbar.style.boxShadow = 'none';
      navbar.style.borderBottomColor = 'var(--border-color)';
    }

    lastScrollY = scrollY;
  });
};

// ============================================
// MODULE: Intersection Observer (Scroll Animations)
// ============================================
const initScrollAnimations = () => {
  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers
    document.querySelectorAll('.project-card, .skill-card').forEach(el => {
      el.style.opacity = '1';
    });
    return;
  }

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all cards
  document.querySelectorAll('.project-card, .skill-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
};

// ============================================
// MODULE: Active Nav Link
// ============================================
const initActiveNavLink = () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const updateActiveLink = () => {
    let currentSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', updateActiveLink);
  window.addEventListener('load', updateActiveLink);
};

// ============================================
// MODULE: Performance - Lazy Loading Images
// ============================================
const initLazyImages = () => {
  if (!('IntersectionObserver' in window)) {
    return; // Graceful fallback
  }

  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
};

// ============================================
// MODULE: Error Boundary
// ============================================
const handleError = (error) => {
  console.error('Application error:', error);
  // Could send to error tracking service like Sentry
};

window.addEventListener('error', (event) => {
  handleError(event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  handleError(event.reason);
});

// ============================================
// INITIALIZATION
// ============================================
const initApp = () => {
  try {
    // Initialize all modules
    initSmoothScroll();
    initContactForm();
    initNavbarScrollEffect();
    initScrollAnimations();
    initActiveNavLink();
    initLazyImages();

    console.log('✓ Application initialized successfully');
  } catch (error) {
    handleError(error);
  }
};

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Expose AlertManager for global use if needed
window.AlertManager = AlertManager;