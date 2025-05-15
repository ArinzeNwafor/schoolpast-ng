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
