function ensureProductModal() {
    if (document.getElementById('productQuickView')) {
        return;
    }

    const modal = document.createElement('div');

    modal.id = 'productQuickView';
    modal.className = 'quick-view-modal';
    modal.setAttribute('aria-hidden', 'true');

    modal.innerHTML = `
        <div
            class="quick-view-backdrop"
            data-close-modal>
        </div>

        <section
            class="quick-view-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quickViewTitle">

            <button
                class="quick-view-close"
                type="button"
                aria-label="Close quick view"
                data-close-modal>
                ×
            </button>

            <div class="quick-view-grid">

                <div class="quick-view-image-wrap">
                    <img
                        id="quickViewImage"
                        src=""
                        alt="">
                </div>

                <div class="quick-view-copy">

                    <p
                        class="product-category"
                        id="quickViewCategory">
                    </p>

                    <h2 id="quickViewTitle"></h2>

                    <p
                        class="quick-view-rating"
                        id="quickViewRating">
                    </p>

                    <p id="quickViewDescription"></p>

                    <strong
                        class="quick-view-price"
                        id="quickViewPrice">
                    </strong>

                    <div class="quick-view-stock">
                        In stock • Ready for your collection
                    </div>

                    <div class="quick-view-actions">

                        <button
                            class="btn btn-primary"
                            id="quickViewCart"
                            type="button">
                            🛒 Add to Cart
                        </button>

                        <button
                            class="btn btn-soft"
                            id="quickViewCollection"
                            type="button">
                            ♡ Add to Collection
                        </button>

                    </div>

                    <a
                        class="detail-link"
                        id="quickViewFullLink"
                        href="#">
                        Open full toy page →
                    </a>

                </div>

            </div>

        </section>
    `;

    document.body.appendChild(modal);
}


function openProductModal(id) {
    const product = products.find(
        (item) => item.id === Number(id)
    );

    const modal =
        document.getElementById('productQuickView');

    if (!product || !modal) {
        return;
    }

    const image =
        document.getElementById('quickViewImage');

    const category =
        document.getElementById('quickViewCategory');

    const title =
        document.getElementById('quickViewTitle');

    const rating =
        document.getElementById('quickViewRating');

    const description =
        document.getElementById('quickViewDescription');

    const price =
        document.getElementById('quickViewPrice');

    const fullLink =
        document.getElementById('quickViewFullLink');

    const cartButton =
        document.getElementById('quickViewCart');

    const collectionButton =
        document.getElementById('quickViewCollection');

    image.src = product.image;
    image.alt = product.name;

    category.textContent = product.category;

    title.textContent = product.name;

    rating.textContent =
        `★ ${product.rating} • ${product.likes} likes`;

    description.textContent = product.description;

    price.textContent = money(product.price);

    fullLink.href =
        `product-details.html?id=${product.id}`;

    /* Collection status */
    const status =
        getCollectionStatus(product.id);

    collectionButton.textContent =
        status
            ? `♥ ${status}`
            : '♡ Add to Collection';

    /* Add to cart */
    cartButton.onclick = () => {
        addToCart(product.id);
        closeProductModal();
    };

    /* Collection */
    collectionButton.onclick = () => {

        toggleWishlist(product.id);

        const updated =
            getCollectionStatus(product.id);

        collectionButton.textContent =
            updated
                ? `♥ ${updated}`
                : '♡ Add to Collection';
    };

    modal.classList.add('open');

    modal.setAttribute(
        'aria-hidden',
        'false'
    );

    document.body.classList.add('modal-open');

    requestAnimationFrame(() => {
        document
            .querySelector('.quick-view-close')
            ?.focus();
    });
}


function closeProductModal() {
    const modal =
        document.getElementById('productQuickView');

    if (!modal) {
        return;
    }

    modal.classList.remove('open');

    modal.setAttribute(
        'aria-hidden',
        'true'
    );

    document.body.classList.remove('modal-open');
}


document.addEventListener('DOMContentLoaded', () => {

    ensureProductModal();

    document.addEventListener('click', (event) => {

        const quickView =
            event.target.closest('[data-quick-view]');

        if (quickView) {
            openProductModal(
                quickView.dataset.quickView
            );

            return;
        }

        if (
            event.target.closest(
                '[data-close-modal]'
            )
        ) {
            closeProductModal();
        }
    });

    document.addEventListener('keydown', (event) => {

        if (event.key === 'Escape') {
            closeProductModal();
        }

    });

});
