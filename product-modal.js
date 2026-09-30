function ensureProductModal() {
    if (document.getElementById('productQuickView')) {
        return;
    }

    const modal = document.createElement('div');
    modal.id = 'productQuickView';
    modal.className = 'quick-view-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
        <div class="quick-view-backdrop" data-close-modal></div>
        <section class="quick-view-dialog" role="dialog" aria-modal="true" aria-labelledby="quickViewTitle">
            <button class="quick-view-close" type="button" aria-label="Close quick view" data-close-modal>×</button>
            <div class="quick-view-grid">
                <div class="quick-view-image-wrap">
                    <img id="quickViewImage" alt="">
                </div>
                <div class="quick-view-copy">
                    <p class="product-category" id="quickViewCategory"></p>
                    <h2 id="quickViewTitle"></h2>
                    <p class="quick-view-rating" id="quickViewRating"></p>
                    <p id="quickViewDescription"></p>
                    <strong class="quick-view-price" id="quickViewPrice"></strong>
                    <div class="quick-view-stock">In stock • Ready for your collection</div>
                    <div class="quick-view-actions">
                        <button class="btn btn-primary" id="quickViewCart">🛒 Add to Cart</button>
                        <button class="btn btn-soft" id="quickViewCollection">♡ Add to Collection</button>
                    </div>
                    <a class="detail-link" id="quickViewFullLink" href="#">Open full toy page →</a>
                </div>
            </div>
        </section>
    `;

    document.body.appendChild(modal);
}

function openProductModal(id) {
    const product = products.find((item) => item.id === Number(id));
    const modal = document.getElementById('productQuickView');

    if (!product || !modal) {
        return;
    }

    document.getElementById('quickViewImage').src = product.image;
    document.getElementById('quickViewImage').alt = product.name;
    document.getElementById('quickViewCategory').textContent = product.category;
    document.getElementById('quickViewTitle').textContent = product.name;
    document.getElementById('quickViewRating').textContent = `★ ${product.rating} • ${product.likes} likes`;
    document.getElementById('quickViewDescription').textContent = product.description;
    document.getElementById('quickViewPrice').textContent = money(product.price);
    document.getElementById('quickViewFullLink').href = `product-details.html?id=${product.id}`;

    const collectionButton = document.getElementById('quickViewCollection');
    const status = getCollectionStatus(product.id);
    collectionButton.textContent = status ? `♥ ${status}` : '♡ Add to Collection';

    document.getElementById('quickViewCart').onclick = () => {
        addToCart(product.id);
        closeProductModal();
    };

    collectionButton.onclick = () => {
        toggleWishlist(product.id);
        const updated = getCollectionStatus(product.id);
        collectionButton.textContent = updated ? `♥ ${updated}` : '♡ Add to Collection';
    };

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    requestAnimationFrame(() => document.querySelector('.quick-view-close')?.focus());
}

function closeProductModal() {
    const modal = document.getElementById('productQuickView');

    if (!modal) {
        return;
    }

    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
}

document.addEventListener('DOMContentLoaded', () => {
    ensureProductModal();

    document.addEventListener('click', (event) => {
        const quickView = event.target.closest('[data-quick-view]');

        if (quickView) {
            openProductModal(quickView.dataset.quickView);
            return;
        }

        if (event.target.closest('[data-close-modal]')) {
            closeProductModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeProductModal();
        }
    });
});
