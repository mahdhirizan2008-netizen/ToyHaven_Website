function renderWishlist() {
    const grid = document.getElementById('wishlistGrid');

    if (!grid) {
        return;
    }

    const collection = getCollection();

    const activeFilter =
        document.querySelector('[data-interest-filter].active');

    const filter =
        activeFilter?.dataset.interestFilter || 'all';

    const list = products.filter((product) => {
        const status = getCollectionStatus(product.id);

        return (
            status &&
            (filter === 'all' || status === filter)
        );
    });

    grid.innerHTML = list.map((product) => {

        const status =
            getCollectionStatus(product.id);

        const label =
            status || 'Interested';

        return `
            <article class="product-card collection-card reveal visible">

                <a
                    class="product-image"
                    href="product-details.html?id=${product.id}">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy">

                </a>

                <div class="product-content">

                    <p class="product-category">
                        ${product.category}
                    </p>

                    <h3>
                        ${product.name}
                    </h3>

                    <div class="collection-status ${label
                        .toLowerCase()
                        .replace(' ', '-')}">
                        ${label}
                    </div>

                    <p class="product-description">
                        ${product.description}
                    </p>

                    <div class="price-line">

                        <strong data-usd="${product.price}">
                            ${money(product.price)}
                        </strong>

                        <button
                            class="heart-button selected"
                            data-remove-collection="${product.id}"
                            aria-label="Remove ${product.name} from collection"
                            type="button">
                            ♥
                        </button>

                    </div>

                    <div class="collection-actions">

                        <button
                            class="btn btn-soft collection-status-button"
                            data-status-id="${product.id}"
                            data-status="Interested"
                            type="button">
                            Interested
                        </button>

                        <button
                            class="btn btn-soft collection-status-button"
                            data-status-id="${product.id}"
                            data-status="Owned"
                            type="button">
                            Owned
                        </button>

                        <button
                            class="btn btn-soft collection-status-button"
                            data-status-id="${product.id}"
                            data-status="Not Interested"
                            type="button">
                            Not Interested
                        </button>

                    </div>

                    <div class="product-actions">

                        <button
                            class="btn btn-primary"
                            data-collection-cart="${product.id}"
                            type="button">
                            🛒 Add to Cart
                        </button>

                        <a
                            class="btn btn-soft"
                            href="product-details.html?id=${product.id}">
                            View toy
                        </a>

                    </div>

                </div>

            </article>
        `;

    }).join('');

    const emptyMessage =
        document.getElementById('wishlistEmpty');

    const filteredEmpty =
        document.getElementById('wishlistFilteredEmpty');

    if (emptyMessage) {
        emptyMessage.classList.toggle(
            'hidden',
            list.length > 0 ||
            filter !== 'all' ||
            Object.keys(collection).length > 0
        );
    }

    if (filteredEmpty) {
        filteredEmpty.classList.toggle(
            'hidden',
            list.length > 0 ||
            filter === 'all'
        );
    }

    grid
        .querySelectorAll('[data-status-id]')
        .forEach((button) => {

            const id =
                Number(button.dataset.statusId);

            const status =
                button.dataset.status;

            button.classList.toggle(
                'active',
                getCollectionStatus(id) === status
            );

            button.addEventListener(
                'click',
                () => {

                    setCollectionStatus(
                        id,
                        status
                    );

                    const product =
                        products.find(
                            (item) => item.id === id
                        );

                    showToast(
                        `${product?.name} marked as ${status}.`
                    );

                    renderWishlist();
                }
            );
        });

    grid
        .querySelectorAll('[data-remove-collection]')
        .forEach((button) => {

            button.addEventListener(
                'click',
                () => {

                    const id =
                        Number(
                            button.dataset.removeCollection
                        );

                    setCollectionStatus(
                        id,
                        null
                    );

                    showToast(
                        'Removed from your collection.'
                    );

                    renderWishlist();
                }
            );
        });

    grid
        .querySelectorAll('[data-collection-cart]')
        .forEach((button) => {

            button.addEventListener(
                'click',
                () => {

                    addToCart(
                        Number(
                            button.dataset.collectionCart
                        )
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

    updatePrices();
}


document.addEventListener(
    'DOMContentLoaded',
    () => {

        document
            .querySelectorAll(
                '[data-interest-filter]'
            )
            .forEach((button) => {

                button.addEventListener(
                    'click',
                    () => {

                        document
                            .querySelectorAll(
                                '[data-interest-filter]'
                            )
                            .forEach((item) => {

                                item.classList.remove(
                                    'active'
                                );

                            });

                        button.classList.add(
                            'active'
                        );

                        renderWishlist();
                    }
                );

            });

        renderWishlist();

        document.addEventListener(
            'wishlistChanged',
            renderWishlist
        );

        document.addEventListener(
            'productStateChanged',
            renderWishlist
        );

    }
);
