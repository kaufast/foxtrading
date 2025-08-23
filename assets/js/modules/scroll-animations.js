/**
 * Scroll Animations Module
 * Implements GSAP ScrollTrigger animations to match the original website effects
 */

class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Wait for GSAP and ScrollTrigger to load
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('GSAP or ScrollTrigger not loaded');
            return;
        }

        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Initialize all animations
        this.initHeroAnimations();
        this.initSectionAnimations();
        this.initAboutAnimations();
        this.initServiceAnimations();
        this.initProjectAnimations();
        this.initTestimonialAnimations();
        this.initTeamAnimations();
        this.initFaqAnimations();
        this.initNavbarAnimations();
    }

    initHeroAnimations() {
        // Hero title and subtitle animation
        gsap.set('.hero-titile-text, .hero-sub-title', { opacity: 0, y: 50 });
        
        gsap.to('.hero-titile-text', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            delay: 0.3
        });

        gsap.to('.hero-sub-title', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            delay: 0.6
        });
    }

    initNavbarAnimations() {
        // Navbar scroll effect
        gsap.set('.container-nav', { y: '15%', width: '90%' });
        gsap.set('.container-nav-shadow', { opacity: 0 });

        ScrollTrigger.create({
            trigger: 'body',
            start: 'top -50px',
            end: 'bottom bottom',
            onEnter: () => {
                gsap.to('.container-nav', {
                    y: '0%',
                    width: '100%',
                    duration: 0.3,
                    ease: "power2.out"
                });
                gsap.to('.container-nav-shadow', {
                    opacity: 1,
                    duration: 0.3
                });
            },
            onLeaveBack: () => {
                gsap.to('.container-nav', {
                    y: '15%',
                    width: '90%',
                    duration: 0.3,
                    ease: "power2.out"
                });
                gsap.to('.container-nav-shadow', {
                    opacity: 0,
                    duration: 0.3
                });
            }
        });
    }

    initSectionAnimations() {
        // Brand section animation
        gsap.set('.brand-partner-contain', { opacity: 0, y: 30 });
        
        ScrollTrigger.create({
            trigger: '.brand-section',
            start: 'top 80%',
            onEnter: () => {
                gsap.to('.brand-partner-contain', {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out"
                });
            }
        });

        // Continuous brand slider animation
        const brandSlider = document.querySelector('.slider-partner');
        if (brandSlider) {
            gsap.to(brandSlider, {
                x: '-50%',
                duration: 20,
                ease: 'none',
                repeat: -1
            });
        }
    }

    initAboutAnimations() {
        // About section elements
        gsap.set('.sub-label-section', { opacity: 0, y: 20 });
        gsap.set('.about-us-text-wrapper', { opacity: 0, y: 30 });
        gsap.set('.about-us-amount', { opacity: 0 });

        ScrollTrigger.create({
            trigger: '#about-section',
            start: 'top 70%',
            onEnter: () => {
                gsap.to('#about-section .sub-label-section', {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out"
                });
                
                gsap.to('.about-us-text-wrapper', {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: 0.2,
                    ease: "power2.out"
                });
                
                gsap.to('.about-us-amount', {
                    opacity: 1,
                    duration: 0.8,
                    delay: 0.4,
                    ease: "power2.out"
                });
            }
        });

        // Counter animation
        this.animateCounters();
    }

    animateCounters() {
        const counters = [
            { element: '.amount-text.years', target: 10 },
            { element: '.amount-text.countries', target: 6 },
            { element: '.amount-text.project', target: 20 }
        ];

        ScrollTrigger.create({
            trigger: '.about-us-amount',
            start: 'top 80%',
            onEnter: () => {
                counters.forEach(counter => {
                    const element = document.querySelector(counter.element);
                    if (element) {
                        gsap.from({ value: 0 }, {
                            value: counter.target,
                            duration: 2,
                            ease: "power2.out",
                            onUpdate: function() {
                                element.textContent = Math.round(this.targets()[0].value);
                            }
                        });
                    }
                });
            }
        });
    }

    initServiceAnimations() {
        // Service section animation
        gsap.set('.benefit-contain.is-desktop', { opacity: 0 });
        gsap.set('.benefit-detail-card', { opacity: 0, y: 30 });

        ScrollTrigger.create({
            trigger: '#service-section',
            start: 'top 70%',
            onEnter: () => {
                gsap.to('.benefit-contain.is-desktop', {
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out"
                });
                
                gsap.to('.benefit-detail-card', {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: 0.3,
                    ease: "power2.out"
                });
            }
        });

        // Tab hover effects
        this.initServiceTabEffects();
    }

    initServiceTabEffects() {
        const tabLinks = document.querySelectorAll('.benefit-items');
        
        tabLinks.forEach(tab => {
            tab.addEventListener('mouseenter', () => {
                gsap.to(tab, {
                    backgroundColor: '#ffffff',
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                gsap.to(tab.querySelector('.benefit-title'), {
                    color: '#121212',
                    duration: 0.3
                });
                
                gsap.to(tab.querySelector('.benefit-desc'), {
                    color: '#888888',
                    duration: 0.3
                });
            });
            
            tab.addEventListener('mouseleave', () => {
                if (!tab.classList.contains('w--current')) {
                    gsap.to(tab, {
                        backgroundColor: 'transparent',
                        duration: 0.3,
                        ease: "power2.out"
                    });
                    
                    gsap.to(tab.querySelector('.benefit-title'), {
                        color: '#ffffff',
                        duration: 0.3
                    });
                    
                    gsap.to(tab.querySelector('.benefit-desc'), {
                        color: '#ffffff',
                        duration: 0.3
                    });
                }
            });
        });
    }

    initProjectAnimations() {
        gsap.set('.header-section.project', { opacity: 0, y: 30 });

        ScrollTrigger.create({
            trigger: '#project-section',
            start: 'top 70%',
            onEnter: () => {
                gsap.to('.header-section.project', {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out"
                });
            }
        });

        // Individual project items
        const projectItems = document.querySelectorAll('.project-item');
        projectItems.forEach((item, index) => {
            gsap.set(item, { opacity: 0, y: 50 });
            
            ScrollTrigger.create({
                trigger: item,
                start: 'top 80%',
                onEnter: () => {
                    gsap.to(item, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        delay: index * 0.2,
                        ease: "power2.out"
                    });
                }
            });
        });
    }

    initTestimonialAnimations() {
        gsap.set('.header-section.justify_center', { opacity: 0, y: 30 });
        gsap.set('.testimonial-list.is-desktop', { opacity: 0, y: 50 });

        ScrollTrigger.create({
            trigger: '#testimonial-section',
            start: 'top 70%',
            onEnter: () => {
                gsap.to('.header-section.justify_center', {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out"
                });
                
                gsap.to('.testimonial-list.is-desktop', {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: 0.3,
                    ease: "power2.out"
                });
            }
        });

        // Testimonial hover effects
        const testimonialItems = document.querySelectorAll('.testimonial-item');
        testimonialItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                gsap.to(item, {
                    scale: 1.02,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            item.addEventListener('mouseleave', () => {
                gsap.to(item, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }

    initTeamAnimations() {
        gsap.set('.header-section.testimonial', { opacity: 0, y: 30 });
        gsap.set('.team-list.is-desktop', { opacity: 0, y: 50 });

        ScrollTrigger.create({
            trigger: '#team-section',
            start: 'top 70%',
            onEnter: () => {
                gsap.to('.header-section.testimonial', {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out"
                });
                
                gsap.to('.team-list.is-desktop', {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: 0.3,
                    ease: "power2.out"
                });
            }
        });

        // Team member hover effects
        const teamItems = document.querySelectorAll('.team-item');
        teamItems.forEach(item => {
            const image = item.querySelector('.team-image');
            const content = item.querySelector('.team-card-content');
            
            item.addEventListener('mouseenter', () => {
                gsap.to(image, {
                    filter: 'saturate(100%)',
                    duration: 0.4,
                    ease: "power2.out"
                });
                
                gsap.to(content, {
                    height: 'auto',
                    duration: 0.4,
                    ease: "power2.out"
                });
            });
            
            item.addEventListener('mouseleave', () => {
                gsap.to(image, {
                    filter: 'saturate(0%)',
                    duration: 0.4,
                    ease: "power2.out"
                });
                
                gsap.to(content, {
                    height: '90px',
                    duration: 0.4,
                    ease: "power2.out"
                });
            });
        });
    }

    initFaqAnimations() {
        gsap.set('.faq-item', { opacity: 0, y: 30 });
        gsap.set('.footer-bottom', { opacity: 0, y: 20 });

        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach((item, index) => {
            ScrollTrigger.create({
                trigger: item,
                start: 'top 90%',
                onEnter: () => {
                    gsap.to(item, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        delay: index * 0.1,
                        ease: "power2.out"
                    });
                }
            });
        });

        ScrollTrigger.create({
            trigger: '.footer-bottom',
            start: 'top 90%',
            onEnter: () => {
                gsap.to('.footer-bottom', {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out"
                });
            }
        });

        // FAQ accordion animations
        this.initFaqAccordion();
    }

    initFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const toggle = item.querySelector('.w-dropdown-toggle');
            const list = item.querySelector('.w-dropdown-list');
            const plusIcon = item.querySelector('.icon_plus');
            const minusIcon = item.querySelector('.icon_minus');
            
            toggle.addEventListener('click', () => {
                const isOpen = item.classList.contains('w--open');
                
                if (!isOpen) {
                    // Open
                    item.classList.add('w--open');
                    gsap.to(list, {
                        height: 'auto',
                        duration: 0.4,
                        ease: "power2.out"
                    });
                    gsap.set(plusIcon, { display: 'none' });
                    gsap.set(minusIcon, { display: 'block' });
                } else {
                    // Close
                    item.classList.remove('w--open');
                    gsap.to(list, {
                        height: 0,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                    gsap.set(plusIcon, { display: 'block' });
                    gsap.set(minusIcon, { display: 'none' });
                }
            });
        });
    }
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimations();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrollAnimations;
}