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
    // Número oficial do WhatsApp:
    whatsappNumber: '5589994519780',

    // ======================================================================
    // LINK DO SEU GOOGLE FORMS:
    // Cole aqui o link da sua ficha no Google Forms. Todos os botões
    // de "Garantir Vaga" e "Inscrição" do site atualizarão automaticamente!
    // Exemplo: 'https://docs.google.com/forms/d/e/SEU_LINK_AQUI/viewform'
    // ======================================================================
    googleFormsUrl: 'https://docs.google.com/forms',

    // Dados do Curso
    courseName: 'Curso de Aplicação de Vacinas e Injetáveis',
    instructorName: 'Ingrid Victoria Rebouças Lima (CRF-PI 4137)',
    investmentValue: 'R$ 79,99 (Pagamento exclusivo via PIX)'
};

document.addEventListener('DOMContentLoaded', () => {
    initHeaderNav();
    initCarousel();
    initGoogleFormsLinks();
    initFaqAccordion();
    setCurrentYear();
});

// ==========================================================================
// 2. ATUALIZAÇÃO AUTOMÁTICA DE TODOS OS LINKS DE "GARANTIR VAGA" PARA O FORMS
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
// 3. MENU DE NAVEGAÇÃO MOBILE
// ==========================================================================
function initHeaderNav() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-cta-mobile a');

    if (!menuToggle || !navMenu) return;

    // Abrir / Fechar menu
    menuToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Fechar ao clicar em qualquer item do menu
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Fechar ao clicar fora do menu
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Sombra sutil no cabeçalho ao rolar a página
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
// 4. CARROSSEL DE FOTOS COM JS PURO (AUTOPLAY, INDICADORES E TOUCH SWIPE)
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
    const autoplayDelay = 5000; // Intervalo de 5 segundos por slide

    // Cria as bolinhas (indicadores) dinamicamente
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

    const dots = indicatorsContainer ? indicatorsContainer.querySelectorAll('.indicator-dot') : [];

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

    // Eventos dos botões de controle
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

    // Autoplay com pausa ao passar o mouse
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

    // Suporte a gestos touch swipe em smartphones
    let startX = 0;
    let endX = 0;
    const swipeThreshold = 40;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        stopAutoplay();
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        endX = e.touches[0].clientX;
    }, { passive: true });

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

    // Inicia o carrossel automático
    startAutoplay();
}

// ==========================================================================
// 5. ACCORDION DE PERGUNTAS FREQUENTES (FAQ)
// ==========================================================================
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (!questionBtn || !answer) return;

        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Fecha outros itens para manter organizado
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherBtn = otherItem.querySelector('.faq-question');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                    if (otherAnswer) otherAnswer.style.maxHeight = null;
                }
            });

            // Alterna o item atual
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
// 6. ATUALIZAR ANO CORRENTE NO RODAPÉ
// ==========================================================================
function setCurrentYear() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}
