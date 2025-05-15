// Set current year in footer
document.getElementById("current-year").textContent = new Date().getFullYear()

// Developer mode for testing - set to true during development, false in production
const DEV_MODE = true;

// Header scroll effect
const header = document.querySelector(".header")
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled")
  } else {
    header.classList.remove("scrolled")
  }
})

// Mobile menu toggle - improved version
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

// Form submission (placeholder)
const searchBox = document.querySelector(".search-box")
if (searchBox) {
  const searchButton = searchBox.querySelector(".search-button")
  const searchInput = searchBox.querySelector("input")

  searchButton.addEventListener("click", () => {
    const schoolName = searchInput.value.trim()
    if (schoolName) {
      alert(`You searched for: ${schoolName}`)
      // In a real application, you would handle the form submission here
    } else {
      alert("Please enter a school name")
    }
  })

  // Allow form submission with Enter key
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchButton.click()
    }
  })
}

// Password toggle
const passwordToggles = document.querySelectorAll(".password-toggle")
passwordToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const passwordInput = toggle.previousElementSibling
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
    passwordInput.setAttribute("type", type)

    // Change icon
    const svg = toggle.querySelector("svg")
    if (type === "text") {
      svg.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>'
    } else {
      svg.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>'
    }
  })
})

// Form validation for auth pages
const authForms = document.querySelectorAll('.auth-form')
authForms.forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault()
    
    let isValid = true
    const inputs = form.querySelectorAll('input[required]')
    
    inputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false
        input.classList.add('error')
        
        // Create error message if it doesn't exist
        let errorMsg = input.parentElement.querySelector('.error-message')
        if (!errorMsg) {
          errorMsg = document.createElement('div')
          errorMsg.className = 'error-message'
          input.parentElement.appendChild(errorMsg)
        }
        errorMsg.textContent = `${input.placeholder.replace('Enter your ', '').replace('Create a ', '')} is required`
      } else {
        input.classList.remove('error')
        const errorMsg = input.parentElement.querySelector('.error-message')
        if (errorMsg) errorMsg.remove()
      }
    })
    
    // Email validation
    const emailInput = form.querySelector('input[type="email"]')
    if (emailInput && emailInput.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(emailInput.value)) {
        isValid = false
        emailInput.classList.add('error')
        
        let errorMsg = emailInput.parentElement.querySelector('.error-message')
        if (!errorMsg) {
          errorMsg = document.createElement('div')
          errorMsg.className = 'error-message'
          emailInput.parentElement.appendChild(errorMsg)
        }
        errorMsg.textContent = 'Please enter a valid email address'
      }
    }
    
    // Password validation
    const passwordInput = form.querySelector('input[type="password"]')
    if (passwordInput && passwordInput.value && passwordInput.id === 'password' && form.closest('.auth-card').querySelector('h1').textContent.includes('Create')) {
      if (passwordInput.value.length < 8) {
        isValid = false
        passwordInput.classList.add('error')
        
        let errorMsg = passwordInput.parentElement.querySelector('.error-message')
        if (!errorMsg) {
          errorMsg = document.createElement('div')
          errorMsg.className = 'error-message'
          passwordInput.parentElement.appendChild(errorMsg)
        }
        errorMsg.textContent = 'Password must be at least 8 characters'
      }
    }
    
    if (isValid) {
      // Simulate form submission with a loading state
      const submitButton = form.querySelector('button[type="submit"]')
      const originalText = submitButton.textContent
      submitButton.textContent = 'Loading...'
      submitButton.disabled = true
      
      setTimeout(() => {
        submitButton.textContent = originalText
        submitButton.disabled = false
        alert('Form submitted successfully!')
        // Redirect to dashboard in real implementation
        window.location.href = 'index.html'
      }, 1500)
    }
  })
  
  // Clear errors on input change
  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function() {
      input.classList.remove('error')
      const errorMsg = input.parentElement.querySelector('.error-message')
      if (errorMsg) errorMsg.remove()
    })
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
        background-color: rgba(0, 0, 0, 0.65); /* Slightly darker background with blur */
        transition: backdrop-filter 0.3s ease, background-color 0.3s ease;
      }
      
      .modal-container {
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2); /* Enhanced shadow for better depth */
      }
      
      /* Improved animation for modal appearance */
      .modal-overlay.active .modal-container {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
      
      .modal-container {
        transform: translateY(20px) scale(0.95);
        opacity: 0;
        transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.4s ease;
      }
    `;
    document.head.appendChild(blurStyles);
    
    // Function to open modal with blur effect
    function openWaitlistModal() {
      if (waitlistModal) {
        waitlistModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
      }
    }
    
    // Function to close modal and remove blur
    function closeWaitlistModal() {
      if (waitlistModal) {
        waitlistModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
      }
    }
    
    // Auto show modal after a delay (only on homepage and if not shown before)
    if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
      // In dev mode, we clear the sessionStorage on each page load for testing
      if (DEV_MODE) {
        sessionStorage.removeItem('hasShownWaitlistModal');
        
        // Add a debug button for developers
        const debugButton = document.createElement('button');
        debugButton.textContent = 'Test Waitlist Modal';
        debugButton.style.position = 'fixed';
        debugButton.style.bottom = '20px';
        debugButton.style.left = '20px';
        debugButton.style.zIndex = '9999';
        debugButton.style.padding = '10px';
        debugButton.style.background = '#f44336';
        debugButton.style.color = 'white';
        debugButton.style.border = 'none';
        debugButton.style.borderRadius = '4px';
        debugButton.style.cursor = 'pointer';
        
        debugButton.addEventListener('click', () => {
          openWaitlistModal();
        });
        
        document.body.appendChild(debugButton);
      }
      
      // Check if we've shown the modal before in this session
      const hasShownModal = sessionStorage.getItem('hasShownWaitlistModal');
      
      if (!hasShownModal || DEV_MODE) {
        // Show modal after 5 seconds (5000ms) - adjust time as needed
        setTimeout(() => {
          openWaitlistModal();
          // Mark that we've shown the modal in this session
          sessionStorage.setItem('hasShownWaitlistModal', 'true');
        }, DEV_MODE ? 2000 : 5000); // Shorter delay in dev mode
      }
    }
    
    // Add waitlist trigger to CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button')
    ctaButtons.forEach(button => {
      // Change the button to open the modal instead of navigating to signup
      if (button.getAttribute('href') === 'signup.html') {
        button.setAttribute('data-open-waitlist', 'true')
        button.addEventListener('click', (e) => {
          e.preventDefault()
          openWaitlistModal()
        })
      }
    })
    
    // Close modal when clicking X button
    const closeModalButton = document.getElementById('closeModal')
    if (closeModalButton) {
      closeModalButton.addEventListener('click', closeWaitlistModal)
    }
    
    // Close modal when clicking outside
    const waitlistModal = document.getElementById('waitlistModal')
    if (waitlistModal) {
      waitlistModal.addEventListener('click', (e) => {
        if (e.target === waitlistModal) {
          closeWaitlistModal()
        }
      })
    }
    
    // Handle waitlist form submission
    const waitlistForm = document.getElementById('waitlistForm')
    if (waitlistForm) {
      waitlistForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic form validation
        let isValid = true;
        const inputs = waitlistForm.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
          if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            
            // Create error message if it doesn't exist
            let errorMsg = input.parentElement.querySelector('.error-message');
            if (!errorMsg) {
              errorMsg = document.createElement('div');
              errorMsg.className = 'error-message';
              input.parentElement.appendChild(errorMsg);
            }
            errorMsg.textContent = `${input.placeholder.replace('Enter your ', '').replace('Create a ', '')} is required`;
          } else {
            input.classList.remove('error');
            const errorMsg = input.parentElement.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
          }
        });
        
        // Email validation
        const emailInput = waitlistForm.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(emailInput.value)) {
            isValid = false;
            emailInput.classList.add('error');
            
            let errorMsg = emailInput.parentElement.querySelector('.error-message');
            if (!errorMsg) {
              errorMsg = document.createElement('div');
              errorMsg.className = 'error-message';
              emailInput.parentElement.appendChild(errorMsg);
            }
            errorMsg.textContent = 'Please enter a valid email address';
          }
        }
        
        if (isValid) {
          // Get the email from the form
          const email = emailInput.value;
          
          // Simulate form submission with a loading state
          const submitButton = waitlistForm.querySelector('button[type="submit"]');
          const originalText = submitButton.textContent;
          submitButton.textContent = 'Submitting...';
          submitButton.disabled = true;
          
          // Submit the form to our API
          fetch('/api/waitlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
          })
          .then(response => {
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            return response.json();
          })
          .then(data => {
            console.log('Success:', data);
            
            // Get the entire modal container to replace its content
            const modalContainer = document.querySelector('.modal-container');
            const modalImage = document.querySelector('.modal-image');
            
            // Remove the side column if it exists
            if (modalImage) {
              modalImage.style.display = 'none';
            }
            
            // Create CSS for the animation
            const style = document.createElement('style');
            style.textContent = `
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              
              @keyframes checkmark {
                0% { 
                  stroke-dashoffset: 100; 
                  opacity: 0;
                }
                30% {
                  opacity: 1;
                }
                100% {
                  stroke-dashoffset: 0;
                  opacity: 1;
                }
              }
              
              .success-animation {
                text-align: center;
                padding: 3rem 2rem;
                animation: fadeIn 0.6s ease-out forwards;
                width: 100%;
                box-sizing: border-box;
              }
              
              .checkmark-circle {
                width: 120px;
                height: 120px;
                position: relative;
                margin: 0 auto 1.5rem;
              }
              
              .checkmark-circle-bg {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                background-color: rgba(10, 124, 46, 0.1);
                display: flex;
                align-items: center;
                justify-content: center;
              }
              
              .checkmark {
                width: 70px;
                height: 70px;
              }
              
              .checkmark path {
                stroke-dasharray: 100;
                stroke-dashoffset: 100;
                animation: checkmark 1s ease-in-out forwards;
                animation-delay: 0.2s;
              }
              
              .success-message {
                font-size: 2.4rem;
                font-weight: 800;
                color: #0a7c2e;
                margin-bottom: 1.2rem;
                opacity: 0;
                animation: fadeIn 0.6s ease-out forwards;
                animation-delay: 0.5s;
                line-height: 1.2;
              }
              
              .success-description {
                opacity: 0;
                animation: fadeIn 0.6s ease-out forwards;
                animation-delay: 0.8s;
                margin-bottom: 2rem;
                font-size: 1.1rem;
                max-width: 400px;
                margin-left: auto;
                margin-right: auto;
                line-height: 1.5;
              }
              
              .success-animation button {
                opacity: 0;
                animation: fadeIn 0.6s ease-out forwards;
                animation-delay: 1.1s;
                padding: 12px 30px;
                font-size: 1.1rem;
              }
              
              /* Ensure content takes full width of modal */
              .modal-content {
                width: 100%;
                flex: 1;
              }
              
              /* Responsive adjustments */
              @media (max-width: 768px) {
                .success-message {
                  font-size: 1.8rem;
                }
                
                .success-description {
                  font-size: 1rem;
                }
                
                .checkmark-circle {
                  width: 100px;
                  height: 100px;
                }
                
                .checkmark-circle-bg {
                  width: 100px;
                  height: 100px;
                }
                
                .checkmark {
                  width: 60px;
                  height: 60px;
                }
              }
            `;
            document.head.appendChild(style);
            
            // Clear the form
            waitlistForm.reset();
            
            // Replace modal content with thank you message
            const modalContent = waitlistForm.closest('.modal-content');
            modalContent.innerHTML = `
              <div class="success-animation">
                <div class="checkmark-circle">
                  <div class="checkmark-circle-bg">
                    <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                      <path fill="none" stroke="#0a7c2e" stroke-width="3" d="M14,27 L22,35 L38,17" />
                    </svg>
                  </div>
                </div>
                <div class="success-message">+1 😍 Welcome to the waitlist!</div>
                <p class="success-description">We've sent you a confirmation email. Thank you for your interest in Schoolpast.ng!</p>
                <button class="button primary-button" id="closeSuccessModal">Got it</button>
              </div>
            `;
            
            // Ensure modal content takes full width
            modalContent.style.width = '100%';
            
            // Add event listener to the close button
            const closeSuccessButton = document.getElementById('closeSuccessModal');
            if (closeSuccessButton) {
              closeSuccessButton.addEventListener('click', function() {
                const waitlistModal = document.getElementById('waitlistModal');
                if (waitlistModal) {
                  waitlistModal.classList.remove('active');
                  document.body.style.overflow = ''; // Restore scrolling
                }
              });
            }
          })
          .catch(error => {
            console.error('Error:', error);
            // Log more details about the error
            console.error('Error details:', {
              message: error.message,
              stack: error.stack,
              type: error.constructor.name
            });
            
            // Handle errors - restore the button and show an error message
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            // Display error message
            let errorMsg = waitlistForm.querySelector('.form-error-message');
            if (!errorMsg) {
              errorMsg = document.createElement('div');
              errorMsg.className = 'form-error-message';
              waitlistForm.appendChild(errorMsg);
            }
            errorMsg.textContent = 'There was an error submitting your email. Please try again.';
          });
        }
      });
      
      // Clear errors on input change
      waitlistForm.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function() {
          input.classList.remove('error');
          const errorMsg = input.parentElement.querySelector('.error-message');
          if (errorMsg) errorMsg.remove();
        });
      });
    }
    
    // Add "Join Waitlist" button to the main CTA section if not present
    const ctaSections = document.querySelectorAll('.cta, .get-started')
    
    ctaSections.forEach(section => {
      // Check if there's already a waitlist-specific button
      const existingWaitlistBtn = section.querySelector('[data-open-waitlist="true"]')
      
      if (!existingWaitlistBtn) {
        // Look for standard CTA buttons
        const ctaButton = section.querySelector('.cta-button')
        
        if (ctaButton && ctaButton.textContent.includes('Get Started')) {
          // Create a new "Join Waitlist" button
          const waitlistButton = document.createElement('a')
          waitlistButton.href = '#'
          waitlistButton.className = 'button outline-button waitlist-button'
          waitlistButton.setAttribute('data-open-waitlist', 'true')
          waitlistButton.textContent = 'Join Waitlist'
          waitlistButton.style.marginLeft = '1rem'
          
          // Add event listener to open modal
          waitlistButton.addEventListener('click', (e) => {
            e.preventDefault()
            openWaitlistModal()
          })
          
          // Insert after the CTA button
          ctaButton.parentNode.insertBefore(waitlistButton, ctaButton.nextSibling)
        }
      }
    })
  }
})

// Nigerian universities list (you'll need to populate this from your CSV)
// This could also be loaded from an external file
const nigerianUniversities = [
  "University of Lagos",
  "University of Ibadan",
  "Ahmadu Bello University",
  "University of Nigeria, Nsukka",
  "University of Benin",
  "Obafemi Awolowo University",
  "University of Ilorin",
  "University of Port Harcourt",
  "Covenant University",
  "Federal University of Technology, Akure",
  "Federal University of Technology, Minna",
  "Federal University of Technology, Owerri",
  "Bayero University Kano",
  "Lagos State University",
  "Nnamdi Azikiwe University",
  // Add all your universities from the CSV here
];

// CSV Loading Function (if you prefer to load the CSV directly)
function loadSchoolsFromCSV() {
  // This assumes you have a CSV file named "nigerian_universities.csv" in your project
  fetch('nigerian_universities.csv')
    .then(response => response.text())
    .then(data => {
      // Parse CSV and convert to array
      const schools = data.split('\n').map(line => line.trim()).filter(line => line);
      // Remove header row if present
      if (schools.length > 0 && schools[0].includes('University') || schools[0].includes('Name')) {
        schools.shift();
      }
      initAutocomplete(schools);
    })
    .catch(error => {
      console.error('Error loading schools CSV:', error);
      // Fall back to the hardcoded list if CSV fails to load
      initAutocomplete(nigerianUniversities);
    });
}

// Function to initialize autocomplete
function initAutocomplete(schools) {
  const searchInput = document.querySelector('.search-box input');
  if (!searchInput) return;
  
  // Create dropdown container - append it to the search-box for proper mobile positioning
  const dropdownContainer = document.createElement('div');
  dropdownContainer.className = 'search-dropdown';
  searchInput.parentNode.appendChild(dropdownContainer);
  
  // Handle input changes
  searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();
    
    // Clear dropdown
    dropdownContainer.innerHTML = '';
    
    if (query.length < 2) {
      dropdownContainer.classList.remove('active');
      return;
    }
    
    // Filter universities based on query
    const matches = schools.filter(school => 
      school.toLowerCase().includes(query)
    ).slice(0, 5); // Limit to 5 results
    
    if (matches.length === 0) {
      dropdownContainer.classList.remove('active');
      return;
    }
    
    // Create dropdown items
    matches.forEach(school => {
      const item = document.createElement('div');
      item.className = 'dropdown-item';
      
      // Highlight the matching part
      const highlightedText = school.replace(
        new RegExp(query, 'gi'),
        match => `<strong>${match}</strong>`
      );
      
      item.innerHTML = highlightedText;
      
      // Handle click on dropdown item
      item.addEventListener('click', function() {
        searchInput.value = school;
        dropdownContainer.classList.remove('active');
        dropdownContainer.innerHTML = ''; // Clear dropdown after selection
      });
      
      dropdownContainer.appendChild(item);
    });
    
    // Show dropdown
    dropdownContainer.classList.add('active');
  });
  
  // Handle focus events
  searchInput.addEventListener('focus', function() {
    if (dropdownContainer.childNodes.length > 0) {
      dropdownContainer.classList.add('active');
    }
  });
  
  // Handle click outside
  document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !dropdownContainer.contains(e.target)) {
      dropdownContainer.classList.remove('active');
    }
  });
  
  // Handle keyboard navigation
  searchInput.addEventListener('keydown', function(e) {
    const items = dropdownContainer.querySelectorAll('.dropdown-item');
    if (!items.length) return;
    
    const active = dropdownContainer.querySelector('.dropdown-item.active');
    const activeIndex = Array.from(items).indexOf(active);
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (active) {
          items[activeIndex].classList.remove('active');
          items[(activeIndex + 1) % items.length].classList.add('active');
        } else {
          items[0].classList.add('active');
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (active) {
          items[activeIndex].classList.remove('active');
          items[activeIndex === 0 ? items.length - 1 : activeIndex - 1].classList.add('active');
        } else {
          items[items.length - 1].classList.add('active');
        }
        break;
      case 'Enter':
        if (active) {
          e.preventDefault();
          searchInput.value = active.textContent.replace(/<\/?strong>/g, ''); // Remove HTML tags
          dropdownContainer.classList.remove('active');
          dropdownContainer.innerHTML = ''; // Clear dropdown after selection
        }
        break;
      case 'Escape':
        dropdownContainer.classList.remove('active');
        break;
    }
  });
  
  // Handle search button click - clear dropdown when search is submitted
  const searchButton = document.querySelector('.search-button');
  if (searchButton) {
    searchButton.addEventListener('click', function() {
      dropdownContainer.classList.remove('active');
      dropdownContainer.innerHTML = ''; // Clear dropdown
    });
  }
}

// Call this when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Choose one of these approaches:
  // 1. Load from CSV file:
  // loadSchoolsFromCSV();
  
  // 2. Or use the hardcoded array:
  initAutocomplete(nigerianUniversities);
});

// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Nigerian universities list - this is a small sample, you should replace with your full list
  const nigerianUniversities = [
    "University of Lagos",
    "University of Ibadan",
    "Ahmadu Bello University",
    "University of Nigeria, Nsukka",
    "University of Benin",
    "Obafemi Awolowo University",
    "University of Ilorin",
    "University of Port Harcourt",
    "Covenant University",
    "Federal University of Technology, Akure",
    "Federal University of Technology, Minna",
    "Federal University of Technology, Owerri",
    "Bayero University Kano",
    "Lagos State University",
    "Nnamdi Azikiwe University",
    // Add all your universities here
  ];

  // Get the search input element
  const searchInput = document.querySelector('.search-box input');
  
  // Check if search input exists
  if (!searchInput) {
    console.error('Search input not found');
    return;
  }
  
  console.log('Autocomplete initialized for:', searchInput); // Debug log
  
  // Create and append the dropdown container
  const dropdownContainer = document.createElement('div');
  dropdownContainer.className = 'search-dropdown';
  searchInput.parentNode.appendChild(dropdownContainer);
  
  // Add event listener for input changes
  searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();
    console.log('Search query:', query); // Debug log
    
    // Clear the dropdown
    dropdownContainer.innerHTML = '';
    
    // Only show suggestions if query is at least 2 characters
    if (query.length < 2) {
      dropdownContainer.classList.remove('active');
      return;
    }
    
    // Filter universities based on query
    const matches = nigerianUniversities.filter(school => 
      school.toLowerCase().includes(query)
    ).slice(0, 5); // Limit to 5 results
    
    console.log('Matches found:', matches.length); // Debug log
    
    if (matches.length === 0) {
      dropdownContainer.classList.remove('active');
      return;
    }
    
    // Create dropdown items for each match
    matches.forEach(school => {
      const item = document.createElement('div');
      item.className = 'dropdown-item';
      
      // Highlight the matching part
      const highlightedText = school.replace(
        new RegExp(query, 'gi'),
        match => `<strong>${match}</strong>`
      );
      
      item.innerHTML = highlightedText;
      
      // Handle click on dropdown item
      item.addEventListener('click', function() {
        searchInput.value = school;
        dropdownContainer.classList.remove('active');
        dropdownContainer.innerHTML = ''; // Clear dropdown after selection
      });
      
      dropdownContainer.appendChild(item);
    });
    
    // Show dropdown
    dropdownContainer.classList.add('active');
  });
  
  // Handle focus events
  searchInput.addEventListener('focus', function() {
    const query = this.value.toLowerCase().trim();
    if (query.length >= 2) {
      // Trigger the input event to show suggestions
      this.dispatchEvent(new Event('input'));
    }
  });
  
  // Handle click outside
  document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !dropdownContainer.contains(e.target)) {
      dropdownContainer.classList.remove('active');
    }
  });
  
  // Add these styles directly to ensure the dropdown works
  const style = document.createElement('style');
  style.textContent = `
    .search-box {
      position: relative;
    }
    
    .search-dropdown {
      position: absolute;
      z-index: 1000;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      max-height: 0;
      opacity: 0;
      width: calc(100% - 50px);
      left: 0;
      top: calc(100% + 5px);
      transition: all 0.2s ease;
      pointer-events: none;
    }
    
    .search-dropdown.active {
      max-height: 300px;
      opacity: 1;
      border: 1px solid #e2e8f0;
      pointer-events: auto;
    }
    
    .dropdown-item {
      padding: 12px 15px;
      cursor: pointer;
      transition: background-color 0.2s;
      font-size: 0.9rem;
    }
    
    .dropdown-item:hover {
      background-color: rgba(10, 124, 46, 0.05);
    }
    
    .dropdown-item strong {
      color: #0a7c2e;
      font-weight: 600;
    }
    
    @media (max-width: 576px) {
      .search-dropdown {
        width: 100%;
        top: 100%;
        left: 0;
        border-radius: 0 0 8px 8px;
      }
      
      .dropdown-item {
        padding: 10px 12px;
        font-size: 0.85rem;
      }
    }
  `;
  document.head.appendChild(style);
  
  console.log('Autocomplete setup complete'); // Debug log
});

// Immediately execute when this script is loaded
(function() {
  console.log('School search autocomplete initializing...');
  
  // Sample list of Nigerian universities
  const universities = [
    "University of Lagos",
    "University of Ibadan",
    "Ahmadu Bello University",
    "University of Nigeria, Nsukka",
    "University of Benin",
    "Obafemi Awolowo University",
    "University of Ilorin",
    "University of Port Harcourt",
    "Covenant University",
    "Federal University of Technology, Akure",
    "Federal University of Technology, Minna",
    "Federal University of Technology, Owerri",
    "Bayero University Kano",
    "Lagos State University",
    "Nnamdi Azikiwe University"
  ];
  
  // Find the search input
  const searchBox = document.querySelector('.search-box');
  if (!searchBox) {
    console.error('Search box not found');
    return;
  }
  
  const searchInput = searchBox.querySelector('input');
  if (!searchInput) {
    console.error('Search input not found');
    return;
  }
  
  console.log('Search input found:', searchInput);
  
  // Create dropdown container
  const dropdownContainer = document.createElement('div');
  dropdownContainer.className = 'school-search-dropdown';
  dropdownContainer.style.position = 'absolute';
  dropdownContainer.style.top = '100%';
  dropdownContainer.style.left = '0';
  dropdownContainer.style.width = '100%';
  dropdownContainer.style.maxHeight = '0';
  dropdownContainer.style.overflow = 'hidden';
  dropdownContainer.style.background = 'white';
  dropdownContainer.style.borderRadius = '0 0 8px 8px';
  dropdownContainer.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
  dropdownContainer.style.zIndex = '1000';
  dropdownContainer.style.opacity = '0';
  dropdownContainer.style.transition = 'all 0.2s ease';
  
  // Ensure search box has position relative
  searchBox.style.position = 'relative';
  
  // Add dropdown to DOM
  searchBox.appendChild(dropdownContainer);
  
  // Input event handler
  searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();
    console.log('Search query:', query);
    
    // Clear dropdown
    dropdownContainer.innerHTML = '';
    
    if (query.length < 2) {
      hideDropdown();
      return;
    }
    
    // Filter matches
    const matches = universities.filter(uni => 
      uni.toLowerCase().includes(query)
    ).slice(0, 5);
    
    console.log('Matches found:', matches.length);
    
    if (matches.length === 0) {
      hideDropdown();
      return;
    }
    
    // Create dropdown items
    matches.forEach(uni => {
      const item = document.createElement('div');
      item.style.padding = '12px 15px';
      item.style.cursor = 'pointer';
      item.style.transition = 'background-color 0.2s';
      item.style.fontSize = '14px';
      
      // Highlight matching text
      const highlightedText = uni.replace(
        new RegExp(query, 'gi'),
        match => `<strong style="color:#0a7c2e;font-weight:600;">${match}</strong>`
      );
      
      item.innerHTML = highlightedText;
      
      // Hover effect
      item.addEventListener('mouseover', function() {
        this.style.backgroundColor = 'rgba(10, 124, 46, 0.05)';
      });
      
      item.addEventListener('mouseout', function() {
        this.style.backgroundColor = 'transparent';
      });
      
      // Click handler
      item.addEventListener('click', function() {
        searchInput.value = uni;
        hideDropdown();
      });
      
      dropdownContainer.appendChild(item);
    });
    
    // Show dropdown
    showDropdown();
  });
  
  // Focus handler
  searchInput.addEventListener('focus', function() {
    const query = this.value.toLowerCase().trim();
    if (query.length >= 2 && dropdownContainer.childNodes.length === 0) {
      // Simulate input to show results
      this.dispatchEvent(new Event('input'));
    } else if (dropdownContainer.childNodes.length > 0) {
      showDropdown();
    }
  });
  
  // Document click handler to hide dropdown
  document.addEventListener('click', function(e) {
    if (!searchBox.contains(e.target)) {
      hideDropdown();
    }
  });
  
  // Helper functions
  function showDropdown() {
    dropdownContainer.style.maxHeight = '300px';
    dropdownContainer.style.opacity = '1';
    dropdownContainer.style.border = '1px solid #e2e8f0';
  }
  
  function hideDropdown() {
    dropdownContainer.style.maxHeight = '0';
    dropdownContainer.style.opacity = '0';
    dropdownContainer.style.border = 'none';
  }
  
  console.log('School search autocomplete initialized');
})();

// School autocomplete functionality
const searchInput = document.querySelector('.search-box input');
  
if (searchInput) {
  // Create datalist element
  const dataList = document.createElement('datalist');
  dataList.id = 'school-options';
  
  // Add datalist to the page
  document.body.appendChild(dataList);
  
  // Connect input to datalist
  searchInput.setAttribute('list', 'school-options');
  
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
      
      // Add options to datalist
      universities.forEach(uni => {
        const option = document.createElement('option');
        option.value = uni;
        dataList.appendChild(option);
      });
      
      console.log(`Loaded ${universities.length} universities from CSV`);
    })
    .catch(error => {
      console.error('Error loading universities from CSV:', error);
      
      // Fallback to a minimal set of universities if CSV fails to load
      const fallbackUniversities = [
        "University of Lagos",
        "University of Ibadan",
        "Ahmadu Bello University",
        "University of Nigeria, Nsukka",
        "University of Benin"
      ];
      
      fallbackUniversities.forEach(uni => {
        const option = document.createElement('option');
        option.value = uni;
        dataList.appendChild(option);
      });
      
      console.log('Using fallback university list');
    });
}

// Cookie Consent Banner
const cookieBanner = document.getElementById('cookie-banner');
const acceptButton = document.getElementById('cookie-accept');
const declineButton = document.getElementById('cookie-settings'); // Now it's the decline button

// Check if user has already accepted or declined cookies
function checkCookieConsent() {
  const cookieConsent = localStorage.getItem('cookieConsent');
  
  if (cookieConsent === 'accepted' || cookieConsent === 'declined') {
    // User has already made a choice
    cookieBanner.style.display = 'none';
  } else {
    // Show the cookie banner
    cookieBanner.style.display = 'block';
  }
}

// Set cookie consent as accepted in localStorage
function acceptCookies() {
  localStorage.setItem('cookieConsent', 'accepted');
  cookieBanner.style.display = 'none';
  console.log('Cookies accepted');
}

// Set cookie consent as declined in localStorage
function declineCookies() {
  localStorage.setItem('cookieConsent', 'declined');
  cookieBanner.style.display = 'none';
  console.log('Cookies declined');
}

// Test function - can be called from console to reset cookie consent
window.testCookieBanner = function() {
  localStorage.removeItem('cookieConsent');
  checkCookieConsent();
  console.log('Cookie consent reset. Banner should now be visible.');
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

// Add event listener for test cookie button
const testCookieButton = document.getElementById('test-cookie-button');
if (testCookieButton) {
  testCookieButton.addEventListener('click', testCookieBanner);
}
