// Set current year in footer
document.getElementById("current-year").textContent = new Date().getFullYear()

// Header scroll effect
const header = document.querySelector(".header")
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled")
  } else {
    header.classList.remove("scrolled")
  }
})

// Mobile menu toggle
const mobileMenuButton = document.querySelector(".mobile-menu-button")
if (mobileMenuButton) {
  mobileMenuButton.addEventListener("click", () => {
    // Create mobile menu if it doesn't exist
    if (!document.querySelector(".mobile-menu")) {
      const mobileMenu = document.createElement("div")
      mobileMenu.className = "mobile-menu"

      // Clone navigation links
      const navLinks = document.querySelector(".nav-links").cloneNode(true)
      mobileMenu.appendChild(navLinks)

      // Clone navigation buttons
      const navButtons = document.querySelector(".nav-buttons").cloneNode(true)
      mobileMenu.appendChild(navButtons)

      // Add mobile menu to body
      document.body.appendChild(mobileMenu)

      // Add event listeners to mobile menu links
      const mobileLinks = mobileMenu.querySelectorAll("a")
      mobileLinks.forEach((link) => {
        link.addEventListener("click", () => {
          mobileMenu.classList.remove("active")
          const spans = mobileMenuButton.querySelectorAll("span")
          spans.forEach((span) => span.classList.remove("active"))
        })
      })
    }

    // Toggle mobile menu
    const mobileMenu = document.querySelector(".mobile-menu")
    mobileMenu.classList.toggle("active")
    document.body.classList.toggle("menu-open")

    // Animate hamburger icon
    const spans = mobileMenuButton.querySelectorAll("span")
    spans.forEach((span) => span.classList.toggle("active"))
  })

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    const mobileMenu = document.querySelector(".mobile-menu")
    if (mobileMenu && mobileMenu.classList.contains("active")) {
      if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
        mobileMenu.classList.remove("active")
        document.body.classList.remove("menu-open")
        const spans = mobileMenuButton.querySelectorAll("span")
        spans.forEach((span) => span.classList.remove("active"))
      }
    }
  })
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()

    const targetId = this.getAttribute("href")
    if (targetId === "#") return

    const targetElement = document.querySelector(targetId)
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 100,
        behavior: "smooth",
      })

      // Close mobile menu if open
      const mobileMenu = document.querySelector(".mobile-menu")
      if (mobileMenu && mobileMenu.classList.contains("active")) {
        mobileMenu.classList.remove("active")
        const spans = document.querySelectorAll(".mobile-menu-button span")
        spans.forEach((span) => span.classList.remove("active"))
      }
    }
  })
})

// Fix mobile viewport height for better mobile experience
function setVh() {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

setVh()
window.addEventListener('resize', setVh)

// Back to top button functionality
const backToTopButton = document.getElementById('backToTop')
if (backToTopButton) {
  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopButton.classList.add('visible')
    } else {
      backToTopButton.classList.remove('visible')
    }
  })
  
  // Scroll to top when clicked
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  })
}

// University Search Autocomplete
document.addEventListener('DOMContentLoaded', function() {
  const schoolsList = document.getElementById('schools-list');
  
  // Load universities from CSV file
  fetch('nigerian_universities.csv')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(data => {
      // Parse CSV data
      const universities = data.split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));

      // Remove header row if it exists
      if (universities.length > 0 && 
          (universities[0].toLowerCase().includes('university') || 
           universities[0].toLowerCase().includes('name'))) {
        universities.shift();
      }

      // Add universities to datalist
      universities.forEach(school => {
        const option = document.createElement('option');
        option.value = school;
        schoolsList.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error loading universities:', error);
    });
});

// Waitlist Modal functionality
document.addEventListener('DOMContentLoaded', () => {
  // Get the modal overlay element
  const waitlistModal = document.getElementById('waitlistModal');
  
  if (waitlistModal) {
    // Add blur effect styles to the page
    const blurStyles = document.createElement('style');
    blurStyles.textContent = `
      .modal-overlay {
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        background-color: rgba(0, 0, 0, 0.65);
        transition: backdrop-filter 0.3s ease, background-color 0.3s ease;
      }
      
      .modal-container {
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
      }
      
      .modal-overlay.active .modal-container {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
      
      .modal-container {
        transform: translateY(20px) scale(0.95);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
      }
    `;
    document.head.appendChild(blurStyles);

    // Check if user is already registered
    const isRegistered = localStorage.getItem('waitlistRegistered');
    const registeredEmail = localStorage.getItem('registeredEmail');

    // Function to show modal
    window.showModal = () => {
      waitlistModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    // Function to hide modal
    window.hideModal = () => {
      waitlistModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    // Close button functionality
    const closeButton = document.getElementById('closeModal');
    if (closeButton) {
      closeButton.addEventListener('click', hideModal);
    }

    // Close on outside click
    waitlistModal.addEventListener('click', (e) => {
      if (e.target === waitlistModal) {
        hideModal();
      }
    });

    // Handle form submission
    const waitlistForm = document.getElementById('waitlistForm');
    if (waitlistForm) {
      waitlistForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('waitlist-email');
        const email = emailInput.value.trim();
        const submitButton = waitlistForm.querySelector('button[type="submit"]');
        const modalContent = document.querySelector('.modal-content');

        // Disable the submit button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = 'Joining...';

        try {
          const response = await fetch('/api/waitlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
          });

          const data = await response.json();

          if (response.ok) {
            // Show success message
            modalContent.innerHTML = `
              <div class="modal-header">
                <h2>🎉 Welcome Aboard!</h2>
              </div>
              <div class="modal-success">
                <p>Thank you for joining our waitlist! We've sent you a confirmation email.</p>
                <p>Check your inbox for more details about what's coming.</p>
                <button onclick="hideModal()" class="button primary-button full-width">Close</button>
              </div>
            `;
            
            // Store in localStorage to prevent duplicate signups
            localStorage.setItem('waitlistRegistered', 'true');
            localStorage.setItem('registeredEmail', email);
          } else {
            // Show error message in the form
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-error-message';
            errorDiv.textContent = data.message || 'Something went wrong. Please try again.';
            
            // Remove any existing error message
            const existingError = waitlistForm.querySelector('.form-error-message');
            if (existingError) {
              existingError.remove();
            }
            
            waitlistForm.insertBefore(errorDiv, submitButton);
            submitButton.disabled = false;
            submitButton.innerHTML = 'Join Waitlist';
          }
        } catch (error) {
          console.error('Error:', error);
          // Show error message
          const errorDiv = document.createElement('div');
          errorDiv.className = 'form-error-message';
          errorDiv.textContent = 'Network error. Please try again.';
          
          // Remove any existing error message
          const existingError = waitlistForm.querySelector('.form-error-message');
          if (existingError) {
            existingError.remove();
          }
          
          waitlistForm.insertBefore(errorDiv, submitButton);
          submitButton.disabled = false;
          submitButton.innerHTML = 'Join Waitlist';
        }
      });
    }

    // Only show modal if user is not registered
    if (!isRegistered && !registeredEmail) {
      // Show modal after 5 seconds
      setTimeout(showModal, 5000);
    }
  }
});

// Cookie Consent Banner
const cookieBanner = document.getElementById('cookie-banner');
const acceptButton = document.getElementById('cookie-accept');
const declineButton = document.getElementById('cookie-settings');

// Check if user has already accepted or declined cookies
function checkCookieConsent() {
  const cookieConsent = localStorage.getItem('cookieConsent');
  
  if (cookieConsent === 'accepted' || cookieConsent === 'declined') {
    cookieBanner.style.display = 'none';
  } else {
    // Show the cookie banner after 2 seconds
    setTimeout(() => {
      cookieBanner.style.display = 'block';
    }, 2000);
  }
}

// Set cookie consent as accepted in localStorage
function acceptCookies() {
  localStorage.setItem('cookieConsent', 'accepted');
  cookieBanner.style.display = 'none';
}

// Set cookie consent as declined in localStorage
function declineCookies() {
  localStorage.setItem('cookieConsent', 'declined');
  cookieBanner.style.display = 'none';
}

// Add event listeners
if (acceptButton) {
  acceptButton.addEventListener('click', acceptCookies);
}

if (declineButton) {
  declineButton.addEventListener('click', declineCookies);
}

// Check cookie consent on page load
document.addEventListener('DOMContentLoaded', checkCookieConsent);
