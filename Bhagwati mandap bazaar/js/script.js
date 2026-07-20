/*
   Bhagwati Mandap Bazaar - Custom Script
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Navbar Scroll Transition
    const navbar = document.querySelector('.navbar');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // 2. Scroll Animation with Intersection Observer
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Optional: stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(element => {
        animationObserver.observe(element);
    });

    // 3. Stats Counter Animation
    const statsSection = document.querySelector('.bg-navy-deep.text-white.py-5');
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    const startCounters = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const suffix = stat.getAttribute('data-suffix') || '';
            let current = 0;
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // ~60fps

            const updateCount = () => {
                current += increment;
                if (current >= target) {
                    stat.innerText = target + suffix;
                } else {
                    stat.innerText = Math.floor(current) + suffix;
                    requestAnimationFrame(updateCount);
                }
            };
            updateCount();
        });
    };

    if (statsSection && statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    startCounters();
                }
            });
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    }

    // 4. Contact Form Processing
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Perform basic validation checks
            if (!contactForm.checkValidity()) {
                e.stopPropagation();
                contactForm.classList.add('was-validated');
                return;
            }

            // Create and show custom feedback overlay
            let feedbackOverlay = document.getElementById('formFeedbackOverlay');
            if (!feedbackOverlay) {
                feedbackOverlay = document.createElement('div');
                feedbackOverlay.id = 'formFeedbackOverlay';
                feedbackOverlay.className = 'feedback-overlay';
                feedbackOverlay.innerHTML = `
                    <div class="feedback-card">
                        <div class="feedback-icon">
                            <i class="fas fa-check"></i>
                        </div>
                        <h3 class="mb-3 text-navy-deep" style="font-family: var(--font-heading); font-weight: 700;">Message Sent Successfully!</h3>
                        <p class="text-muted mb-4">Thank you for reaching out to Bhagwati Mandap Bazaar. Our representative will contact you shortly.</p>
                        <button type="button" class="btn btn-gold px-4" id="closeFeedbackBtn">Close</button>
                    </div>
                `;
                document.body.appendChild(feedbackOverlay);

                // Add close listener
                document.getElementById('closeFeedbackBtn').addEventListener('click', () => {
                    feedbackOverlay.classList.remove('show');
                    contactForm.reset();
                    contactForm.classList.remove('was-validated');
                });
            }

            // Show it
            setTimeout(() => {
                feedbackOverlay.classList.add('show');
            }, 100);
        });
    }

    // 5. Smooth Scroll for Page anchors
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offset = 80; // height of sticky header
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = targetElement.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
