const rates = {
    USD: 1,
    LKR: 320,
    GBP: 0.78,
    INR: 83,
    AUD: 1.52,
    EUR: 0.92,
    CAD: 1.36,
    AED: 3.67
};

const symbols = {
    USD: '$',
    LKR: 'LKR ',
    GBP: '£',
    INR: '₹',
    AUD: 'A$',
    EUR: '€',
    CAD: 'C$',
    AED: 'AED '
};

function readStore(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
        return fallback;
    }
}

function writeStore(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getCurrency() {
    return localStorage.getItem('toyCurrency') || 'USD';
}

function money(usd) {
    const currency = getCurrency();
    const decimalPlaces = ['LKR', 'INR'].includes(currency) ? 0 : 2;

    return symbols[currency] + (usd * rates[currency]).toFixed(decimalPlaces);
}

function showToast(message) {
    const toast = document.getElementById('toast');

    if (!toast) {
        return;
    }

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}

function updateCartCount() {
    const cart = readStore('toyCart', []);
    const cartCount = document.getElementById('cartCount');

    if (cartCount) {
        cartCount.textContent = cart.reduce(
            (total, item) => total + item.qty,
            0
        );
    }
}

function updatePrices() {
    document.querySelectorAll('[data-usd]').forEach((element) => {
        element.textContent = money(Number(element.dataset.usd));
    });
}

function getCollection() {
    const stored = readStore('toyCollection', null);

    if (
        stored &&
        typeof stored === 'object' &&
        !Array.isArray(stored)
    ) {
        return stored;
    }

    const legacy = readStore('toyWishlist', []);
    const migrated = {};

    legacy.forEach((id) => {
        migrated[id] = 'Interested';
    });

    writeStore('toyCollection', migrated);

    return migrated;
}

function getCollectionStatus(id) {
    const collection = getCollection();

    return collection[String(id)] || collection[id] || null;
}

function setCollectionStatus(id, status) {
    const collection = getCollection();
    const key = String(id);

    if (!status) {
        delete collection[key];
    } else {
        collection[key] = status;
    }

    writeStore('toyCollection', collection);

    writeStore(
        'toyWishlist',
        Object.keys(collection).map(Number)
    );

    document.dispatchEvent(new Event('wishlistChanged'));
    document.dispatchEvent(new Event('productStateChanged'));
}

function addToCart(id, quantity = 1, colour = 'Classic') {
    const product = products.find((item) => item.id === id);

    if (!product) {
        return;
    }

    const safeQuantity = Math.max(
        1,
        Number(quantity) || 1
    );

    const cart = readStore('toyCart', []);

    const existing = cart.find(
        (item) =>
            item.id === id &&
            item.colour === colour
    );

    if (existing) {
        existing.qty = Math.min(
            99,
            existing.qty + safeQuantity
        );
    } else {
        cart.push({
            id,
            qty: Math.min(99, safeQuantity),
            colour
        });
    }

    writeStore('toyCart', cart);

    updateCartCount();

    showToast(
        'Added to your cart! Your toy is waiting for you. 🧸'
    );
}

function toggleWishlist(id) {
    const currentStatus = getCollectionStatus(id);

    if (currentStatus) {
        setCollectionStatus(id, null);

        showToast(
            'Removed from your collection.'
        );
    } else {
        setCollectionStatus(id, 'Interested');

        showToast(
            'Added to your collection! 💜'
        );
    }
}

function likeProduct(id) {
    const likes = readStore('toyLikes', {});

    const product = products.find(
        (item) => item.id === id
    );

    if (!product) {
        return;
    }

    likes[id] =
        (likes[id] ?? product.likes) + 1;

    writeStore('toyLikes', likes);

    showToast(
        'Thanks for showing some love! ♥'
    );

    document.dispatchEvent(
        new Event('productStateChanged')
    );
}

function dislikeProduct(id) {
    const dislikes = readStore(
        'toyDislikes',
        {}
    );

    dislikes[id] =
        (dislikes[id] ?? 0) + 1;

    writeStore(
        'toyDislikes',
        dislikes
    );

    showToast(
        'Thanks — we will keep that in mind.'
    );
}

function stars(rating) {
    const roundedRating =
        Math.round(rating);

    const filled =
        '★'.repeat(roundedRating);

    const empty =
        '☆'.repeat(5 - roundedRating);

    return `
        <span
            class="stars"
            aria-label="${rating} out of 5 stars"
        >
            ${filled}${empty}
        </span>
        <strong>${rating}</strong>
    `;
}

function setupHeader() {
    const menuButton =
        document.getElementById('menuBtn');

    const navigation =
        document.getElementById('mainNav');

    if (menuButton && navigation) {
        menuButton.addEventListener(
            'click',
            () => {
                const open =
                    navigation.classList.toggle(
                        'open'
                    );

                menuButton.setAttribute(
                    'aria-expanded',
                    String(open)
                );
            }
        );

        navigation
            .querySelectorAll('a')
            .forEach((link) => {
                link.addEventListener(
                    'click',
                    () => {
                        navigation.classList.remove(
                            'open'
                        );

                        menuButton.setAttribute(
                            'aria-expanded',
                            'false'
                        );
                    }
                );
            });
    }

    const currency =
        document.getElementById('currency');

    if (currency) {
        currency.value = getCurrency();

        currency.addEventListener(
            'change',
            () => {
                localStorage.setItem(
                    'toyCurrency',
                    currency.value
                );

                location.reload();
            }
        );
    }

    const newsletter =
        document.getElementById(
            'newsletterForm'
        );

    if (newsletter) {
        newsletter.addEventListener(
            'submit',
            (event) => {
                event.preventDefault();

                const email =
                    document.getElementById(
                        'newsletterEmail'
                    ).value;

                localStorage.setItem(
                    'toyNewsletter',
                    email
                );

                newsletter.reset();

                showToast(
                    'Email sent successfully! Thank you for staying connected with Toy Haven. 🎉'
                );
            }
        );
    }

    updateCartCount();
    updatePrices();
}

function reveal() {
    const elements =
        document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
        elements.forEach((element) => {
            element.classList.add('visible');
        });

        return;
    }

    const observer =
        new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(
                            'visible'
                        );

                        observer.unobserve(
                            entry.target
                        );
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

    elements.forEach((element) => {
        observer.observe(element);
    });
}

function card(product) {
    const collectionStatus =
        getCollectionStatus(product.id);

    const likes =
        readStore('toyLikes', {});

    const isWishlisted =
        collectionStatus &&
        collectionStatus !== 'Not Interested';

    const likeCount =
        likes[product.id] ?? product.likes;

    return `
        <article class="product-card reveal visible">

            <a
                class="product-image"
                href="product-details.html?id=${product.id}"
            >
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >
            </a>

            <div class="product-content">

                <p class="product-category">
                    ${product.category}
                </p>

                <h3>
                    ${product.name}
                </h3>

                <p class="product-description">
                    ${product.description}
                </p>

                <div class="rating-row">
                    ${stars(product.rating)}
                </div>

                <div class="price-line">

                    <strong data-usd="${product.price}">
                        ${money(product.price)}
                    </strong>

                    <button
                        class="heart-button ${isWishlisted ? 'selected' : ''}"
                        data-wish="${product.id}"
                        aria-label="Add ${product.name} to collection"
                    >
                        ${isWishlisted ? '♥' : '♡'}
                    </button>

                </div>

                <div class="product-actions">

                    <button
                        class="btn btn-primary add-cart"
                        data-cart="${product.id}"
                        type="button"
                    >
                        🛒 Add to Cart
                    </button>

                    <button
                        class="btn btn-soft quick-view-button"
                        data-quick-view="${product.id}"
                        type="button"
                    >
                        Quick view
                    </button>

                </div>

                <a
                    class="detail-link"
                    href="product-details.html?id=${product.id}"
                >
                    Open full toy page →
                </a>

                <div class="social-row">

                    <button
                        type="button"
                        data-like="${product.id}"
                    >
                        ♥ ${likeCount} Likes
                    </button>

                    <button
                        type="button"
                        data-dislike="${product.id}"
                    >
                        Not interested
                    </button>

                </div>

            </div>

        </article>
    `;
}

function attachCardEvents() {
    document
        .querySelectorAll('[data-cart]')
        .forEach((button) => {

            button.addEventListener(
                'click',
                () => {

                    addToCart(
                        Number(button.dataset.cart)
                    );

                    button.textContent =
                        'Added ✓';

                    setTimeout(() => {
                        button.textContent =
                            '🛒 Add to Cart';
                    }, 1200);
                }
            );
        });

    document
        .querySelectorAll('[data-wish]')
        .forEach((button) => {

            button.addEventListener(
                'click',
                () => {
                    toggleWishlist(
                        Number(
                            button.dataset.wish
                        )
                    );
                }
            );
        });

    document
        .querySelectorAll('[data-like]')
        .forEach((button) => {

            button.addEventListener(
                'click',
                () => {
                    likeProduct(
                        Number(
                            button.dataset.like
                        )
                    );
                }
            );
        });

    document
        .querySelectorAll('[data-dislike]')
        .forEach((button) => {

            button.addEventListener(
                'click',
                () => {
                    dislikeProduct(
                        Number(
                            button.dataset.dislike
                        )
                    );
                }
            );
        });
}

function setupFaq() {
    document
        .querySelectorAll('.faq-q')
        .forEach((question) => {

            question.addEventListener(
                'click',
                () => {
                    question.classList.toggle(
                        'open'
                    );
                }
            );
        });
}

function setupHeroBanner() {
    const image =
        document.getElementById(
            'heroBannerImage'
        );

    if (!image) {
        return;
    }

    /*
     * All website files are stored in the
     * GitHub repository root.
     */
    const banners = [
        'banner-toys.webp',
        'banner-legos.webp',
        'banner-cars.webp',
        'banner-teddybears.webp',
        'banner-robot-space.webp'
    ];

    let index = 0;

    setInterval(() => {

        index =
            (index + 1) %
            banners.length;

        image.classList.add(
            'banner-changing'
        );

        setTimeout(() => {

            image.src =
                banners[index];

            image.classList.remove(
                'banner-changing'
            );

        }, 250);

    }, 3500);
}

document.addEventListener(
    'DOMContentLoaded',
    () => {

        setupHeader();
        reveal();
        setupFaq();
        setupHeroBanner();

        document.body.classList.add(
            'ready'
        );
    }
);
