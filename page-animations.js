function setupPageAnimations() {
    const targets = [
        '.page-hero > .container',
        '.hero-copy',
        '.hero-stage',
        '.section-title',
        '.shop-toolbar',
        '.category-card',
        '.product-card',
        '.featured-card',
        '.community-banner',
        '.details-layout > *',
        '.cart-layout > *',
        '.cart-item',
        '.form-card',
        '.summary-card',
        '.support-grid > *',
        '.forum-layout > *',
        '.forum-post',
        '.auth-grid > *',
        '.interest-bar',
        '.empty',
        '.empty-card',
        '.success',
        '.review-card',
        '.feature-note'
    ];

    const elements = document.querySelectorAll(targets.join(','));

    elements.forEach((element, index) => {
        element.classList.add('motion-target');
        element.style.setProperty('--motion-order', Math.min(index % 8, 7));
    });

    if (!('IntersectionObserver' in window)) {
        elements.forEach((element) => element.classList.add('motion-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('motion-visible');
            currentObserver.unobserve(entry.target);
        });
    }, { threshold: 0.1 });

    elements.forEach((element) => observer.observe(element));
}

document.addEventListener('DOMContentLoaded', setupPageAnimations);
