/**
 * ==========================================================================
 * CURSO DE APLICAÇÃO DE VACINAS E INJETÁVEIS
 * Ingrid Victoria Rebouças Lima (CRF-PI 4137)
 * Script de Interatividade, Carrossel e Links do Google Forms
 * ==========================================================================
 */

// ==========================================================================
// 1. CONFIGURAÇÕES PRINCIPAIS (EDITE AQUI FACILMENTE)
// ==========================================================================
const CONFIG = {
    whatsappNumber: '5589994519780',

    googleFormsUrl: 'https://forms.gle/bMM1sQ5GBNuA6Er47',

    courseName: 'Curso de Aplicação de Vacinas e Injetáveis',
    instructorName: 'Ingrid Victoria Rebouças Lima (CRF-PI 4137)',
    investmentValue: 'R$ 79,99 (Pagamento exclusivo via PIX)'
};


// ==========================================================================
// 2. INICIALIZAÇÃO
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    initHeaderNav();
    initCarousel();
    initGoogleFormsLinks();
    initFaqAccordion();
    setCurrentYear();
});


// ==========================================================================
// 3. LINKS DO GOOGLE FORMS
// ==========================================================================
function initGoogleFormsLinks() {
    const formLinks = document.querySelectorAll('.btn-forms-link, #googleFormsLinkBtn');

    if (!formLinks.length || !CONFIG.googleFormsUrl) return;

    formLinks.forEach(link => {
        link.setAttribute('href', CONFIG.googleFormsUrl);
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
}


// ==========================================================================
// 4. MENU DE NAVEGAÇÃO
// ==========================================================================
function initHeaderNav() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-cta-mobile a');

    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('click', (e) => {
        if (
            !navMenu.contains(e.target) &&
            !menuToggle.contains(e.target) &&
            navMenu.classList.contains('active')
        ) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    window.addEventListener('scroll', () => {
        const header = document.querySelector('.site-header');

        if (header) {
            if (window.scrollY > 30) {
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            } else {
                header.style.boxShadow = 'none';
            }
        }
    });
}


// ==========================================================================
// 5. CARROSSEL
// ==========================================================================
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const indicatorsContainer = document.getElementById('carouselIndicators');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoplayTimer = null;
    const autoplayDelay = 5000;

    if (indicatorsContainer) {
        indicatorsContainer.innerHTML = '';

        slides.forEach((_, idx) => {
            const dot = document.createElement('button');

            dot.className = `indicator-dot ${idx === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Ir para o slide ${idx + 1}`);

            dot.addEventListener('click', () => {
                goToSlide(idx);
                resetAutoplay();
            });

            indicatorsContainer.appendChild(dot);
        });
    }

    const dots = indicatorsContainer
        ? indicatorsContainer.querySelectorAll('.indicator-dot')
        : [];

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        slides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === currentIndex);
        });

        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }

    function goToSlide(index) {
        if (index < 0) {
            currentIndex = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        updateCarousel();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(nextSlide, autoplayDelay);
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    const carouselWrapper = document.querySelector('.carousel-wrapper');

    if (carouselWrapper) {
        carouselWrapper.addEventListener('mouseenter', stopAutoplay);
        carouselWrapper.addEventListener('mouseleave', startAutoplay);
    }

    let startX = 0;
    let endX = 0;
    const swipeThreshold = 40;

    track.addEventListener(
        'touchstart',
        (e) => {
            startX = e.touches[0].clientX;
            stopAutoplay();
        },
        { passive: true }
    );

    track.addEventListener(
        'touchmove',
        (e) => {
            endX = e.touches[0].clientX;
        },
        { passive: true }
    );

    track.addEventListener('touchend', () => {
        const diffX = startX - endX;

        if (Math.abs(diffX) > swipeThreshold && endX !== 0) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }

        startX = 0;
        endX = 0;

        startAutoplay();
    });

    startAutoplay();
}


// ==========================================================================
// 6. FAQ ACCORDION
// ==========================================================================
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (!questionBtn || !answer) return;

        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');

                    const otherBtn = otherItem.querySelector('.faq-question');
                    const otherAnswer = otherItem.querySelector('.faq-answer');

                    if (otherBtn) {
                        otherBtn.setAttribute('aria-expanded', 'false');
                    }

                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = null;
                    }
                }
            });

            if (isActive) {
                item.classList.remove('active');
                questionBtn.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = null;
            } else {
                item.classList.add('active');
                questionBtn.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}


// ==========================================================================
// 7. ANO ATUAL
// ==========================================================================
function setCurrentYear() {
    const yearSpan = document.getElementById('currentYear');

    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}