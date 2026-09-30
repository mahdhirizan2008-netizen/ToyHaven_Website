function renderShop() {
    const grid = document.getElementById('productGrid');

    if (!grid) {
        return;
    }

    let list = [...products];

    const search =
        (
            document.getElementById('productSearch')?.value || ''
        ).toLowerCase();

    const category =
        document.getElementById('categoryFilter')?.value || 'All';

    const sort =
        document.getElementById('sortProducts')?.value || 'recommended';

    if (search) {
        list = list.filter((product) => {
            const text =
                `${product.name} ${product.category} ${product.description}`;

            return text.toLowerCase().includes(search);
        });
    }

    if (category !== 'All') {
        list = list.filter(
            (product) => product.category === category
        );
    }

    if (sort === 'low') {
        list.sort((a, b) => a.price - b.price);
    }

    if (sort === 'high') {
        list.sort((a, b) => b.price - a.price);
    }

    if (sort === 'rating') {
        list.sort((a, b) => b.rating - a.rating);
    }

    grid.innerHTML = list.map(card).join('');

    attachCardEvents();
    updatePrices();

    document
        .getElementById('noResults')
        ?.classList.toggle(
            'hidden',
            list.length > 0
        );
}

function setupShop() {
    const params =
        new URLSearchParams(location.search);

    const category =
        params.get('category');

    const categoryFilter =
        document.getElementById('categoryFilter');

    if (category && categoryFilter) {
        categoryFilter.value = category;
    }

    [
        'productSearch',
        'categoryFilter',
        'sortProducts'
    ].forEach((id) => {

        const element =
            document.getElementById(id);

        if (element) {

            const eventName =
                id === 'productSearch'
                    ? 'input'
                    : 'change';

            element.addEventListener(
                eventName,
                renderShop
            );
        }
    });

    renderShop();
}

function homeProducts() {
    const grid =
        document.getElementById('homeProducts');

    if (!grid) {
        return;
    }

    grid.innerHTML =
        products
            .slice(0, 10)
            .map(card)
            .join('');

    attachCardEvents();
    updatePrices();
}

function featured() {
    const box =
        document.getElementById(
            'featuredProduct'
        );

    if (!box) {
        return;
    }

    const startOfYear =
        new Date(
            new Date().getFullYear(),
            0,
            0
        );

    const dayOfYear =
        Math.floor(
            (Date.now() - startOfYear) /
            86400000
        );

    const product =
        products[
            dayOfYear % products.length
        ];

    box.innerHTML = `
        <article class="featured-card reveal visible">

            <img
                src="${product.image}"
                alt="${product.name}"
            >

            <div>

                <p class="eyebrow">
                    FEATURED PRODUCT OF THE DAY
                </p>

                <h2>
                    ${product.name}
                </h2>

                <p>
                    ${product.description}
                </p>

                <div>
                    ${stars(product.rating)}
                </div>

                <strong
                    class="featured-price"
                    data-usd="${product.price}"
                >
                    ${money(product.price)}
                </strong>

                <div class="button-row">

                    <button
                        class="btn btn-primary"
                        id="featuredAdd"
                        type="button"
                    >
                        🛒 Add to Cart
                    </button>

                    <a
                        class="btn btn-soft"
                        href="product-details.html?id=${product.id}"
                    >
                        View details
                    </a>

                </div>

            </div>

        </article>
    `;

    const featuredButton =
        document.getElementById(
            'featuredAdd'
        );

    if (featuredButton) {
        featuredButton.addEventListener(
            'click',
            () => {
                addToCart(product.id);
            }
        );
    }

    updatePrices();
}

document.addEventListener(
    'DOMContentLoaded',
    () => {
        setupShop();
        homeProducts();
        featured();
    }
);
