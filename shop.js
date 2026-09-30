function renderShop() {
    const grid = document.getElementById('productGrid');

    if (!grid) {
        return;
    }

    let list = [...products];

    const search =
        (document.getElementById('productSearch')?.value || '')
            .trim()
            .toLowerCase();

    const category =
        document.getElementById('categoryFilter')?.value || 'All';

    const sort =
        document.getElementById('sortProducts')?.value || 'recommended';

    /* Search products */
    if (search) {
        list = list.filter((product) => {
            const text = `
                ${product.name}
                ${product.category}
                ${product.description}
            `;

            return text.toLowerCase().includes(search);
        });
    }

    /* Filter by category */
    if (category !== 'All') {
        list = list.filter((product) => {
            return product.category === category;
        });
    }

    /* Sort products */
    if (sort === 'low') {
        list.sort((a, b) => a.price - b.price);
    }

    if (sort === 'high') {
        list.sort((a, b) => b.price - a.price);
    }

    if (sort === 'rating') {
        list.sort((a, b) => b.rating - a.rating);
    }

    /* Display products */
    grid.innerHTML = list.map(card).join('');

    /* Reconnect buttons after rendering */
    attachCardEvents();

    /* Update currency prices */
    updatePrices();

    /* Show/hide no results message */
    const noResults = document.getElementById('noResults');

    if (noResults) {
        noResults.classList.toggle('hidden', list.length > 0);
    }
}


function setupShop() {
    const params =
        new URLSearchParams(window.location.search);

    const requestedCategory =
        params.get('category');

    const categoryFilter =
        document.getElementById('categoryFilter');

    /* Allow category links from other pages */
    if (requestedCategory && categoryFilter) {
        const validOption =
            Array.from(categoryFilter.options)
                .some(
                    (option) =>
                        option.value === requestedCategory
                );

        if (validOption) {
            categoryFilter.value =
                requestedCategory;
        }
    }

    /* Search */
    const searchInput =
        document.getElementById('productSearch');

    if (searchInput) {
        searchInput.addEventListener(
            'input',
            renderShop
        );
    }

    /* Category filter */
    if (categoryFilter) {
        categoryFilter.addEventListener(
            'change',
            renderShop
        );
    }

    /* Sort */
    const sortProducts =
        document.getElementById('sortProducts');

    if (sortProducts) {
        sortProducts.addEventListener(
            'change',
            renderShop
        );
    }

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
        document.getElementById('featuredProduct');

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
        <article
            class="featured-card reveal visible"
            aria-labelledby="featuredProductTitle">

            <img
                src="${product.image}"
                alt="${product.name}"
                loading="lazy">

            <div>

                <p class="eyebrow">
                    FEATURED PRODUCT OF THE DAY
                </p>

                <h2 id="featuredProductTitle">
                    ${product.name}
                </h2>

                <p>
                    ${product.description}
                </p>

                <div
                    class="featured-rating"
                    aria-label="Product rating: ${product.rating} out of 5 stars">

                    ${stars(product.rating)}

                </div>

                <strong
                    class="featured-price"
                    data-usd="${product.price}">
                    ${money(product.price)}
                </strong>

                <div class="button-row">

                    <button
                        class="btn btn-primary"
                        id="featuredAdd"
                        type="button">
                        🛒 Add to Cart
                    </button>

                    <a
                        class="btn btn-soft"
                        href="product-details.html?id=${product.id}">
                        View details
                    </a>

                </div>

            </div>

        </article>
    `;

    const featuredAdd =
        document.getElementById('featuredAdd');

    if (featuredAdd) {
        featuredAdd.addEventListener(
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
