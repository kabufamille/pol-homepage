document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });

            // Re-trigger hero animations when clicking Home
            if (targetId === '#hero') {
                const animatedElements = document.querySelectorAll('#hero .fade-in-up');
                animatedElements.forEach(el => {
                    el.style.animation = 'none';
                    el.offsetHeight; /* Trigger reflow */
                    el.style.animation = '';
                });
            }
        });
    });

    // Scroll Animation Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible to run only once
                // observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.1
    });

    // Elements to animate on scroll
    document.querySelectorAll('[data-scroll]').forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease-out';
        observer.observe(el);
    });

    // Add visible class logic dynamically for scroll elements
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = "0 5px 20px rgba(0,0,0,0.1)";
        } else {
            header.style.boxShadow = "none";
        }
    });

    // Yeast Bubble Animation for About Section
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
        const bubbleContainer = document.createElement('div');
        bubbleContainer.className = 'yeast-bubbles';
        aboutSection.insertBefore(bubbleContainer, aboutSection.firstChild);

        const bubbleCount = 40; // Number of bubbles
        for (let i = 0; i < bubbleCount; i++) {
            const bubble = document.createElement('span');
            bubble.className = 'yeast-bubble';
            
            // Randomize position, size, and animation
            const size = Math.random() * 15 + 5; // 5px to 20px
            const leftPosition = Math.random() * 100; // 0% to 100%
            const duration = Math.random() * 10 + 6; // 6s to 16s
            const delay = Math.random() * 15; // 0s to 15s

            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${leftPosition}%`;
            bubble.style.animationDuration = `${duration}s`;
            bubble.style.animationDelay = `${delay}s`;

            bubbleContainer.appendChild(bubble);
        }

        // Trigger animation when scrolled into view
        const bubbleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const steamField = aboutSection.querySelector('.steam-field');
                if (entry.isIntersecting) {
                    bubbleContainer.classList.add('active');
                    if(steamField) steamField.classList.add('active');
                } else {
                    bubbleContainer.classList.remove('active');
                    if(steamField) steamField.classList.remove('active');
                }
            });
        }, { threshold: 0.2 });
        bubbleObserver.observe(aboutSection);
        
        // Steam Vapor Animation for About Section
        const steamField = document.createElement('div');
        steamField.className = 'steam-field';
        aboutSection.insertBefore(steamField, aboutSection.firstChild);

        const steamCount = 12; // Number of steam particles
        for (let i = 0; i < steamCount; i++) {
            const steam = document.createElement('div');
            steam.className = 'steam';
            
            // Randomize styling
            const size = Math.random() * 80 + 50; // 50px to 130px width
            const leftPosition = Math.random() * 100; // 0% to 100% horizontal
            const duration = Math.random() * 6 + 8; // 8s to 14s duration
            const delay = Math.random() * 8; // 0s to 8s delay

            steam.style.width = `${size}px`;
            steam.style.height = `${size * 2}px`; // slightly taller than wide
            steam.style.left = `${leftPosition}%`;
            steam.style.animation = `riseSteam ${duration}s infinite cubic-bezier(0.5, 0, 0.5, 1) ${delay}s`;

            steamField.appendChild(steam);
        }
    }


    // Online Shop Cart Functionality
    document.querySelectorAll('.btn-shop').forEach(button => {
        button.addEventListener('click', () => {
            const productName = button.getAttribute('data-product');
            alert(`${productName}をカートに追加しました。\n(これはデモサイトです。実際の購入はできません)`);
        });
    });

    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');

    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.nav a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }
});
