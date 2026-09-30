function getProduct() {
    const id = Number(new URLSearchParams(location.search).get('id'));
    return products.find((product) => product.id === id) || products[0];
}

function renderDetails() {
    const product = getProduct();

    document.title = `${product.name} | Toy Haven`;
    document.getElementById('detailTitle').textContent = product.name;
    document.getElementById('detailSubtitle').textContent = product.description;

    document.getElementById('detailMain').innerHTML = `
        <div class="details-layout">
            <div class="details-image-card reveal visible">
                <img src="${product.image}" alt="${product.name}">
            </div>

            <div class="details-copy reveal visible">
                <p class="eyebrow">${product.category}</p>
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <div>${stars(product.rating)} • ${product.likes} Likes</div>
                <div class="details-price" data-usd="${product.price}">${money(product.price)}</div>

                <div class="choice-group">
                    <span>Choose a colour</span>
                    <div class="colour-options">
                        <button class="colour-option active">Classic</button>
                        <button class="colour-option">Blue</button>
                        <button class="colour-option">Yellow</button>
                        <button class="colour-option">Pink</button>
                    </div>
                    <p id="selectedColour">✓ Classic selected</p>
                </div>

                <label class="quantity-label">
                    Quantity
                    <input id="detailQty" type="number" min="1" value="1">
                </label>

                <div class="button-row">
                    <button class="btn btn-primary" id="detailCart">🛒 Add selected toy</button>
                    <button class="btn btn-soft" id="detailWish">♡ Add to wishlist</button>
                </div>

                <div class="feature-note">
                    <strong>Inside this collection</strong>
                    <span>Explore up to 10 related favourites below.</span>
                </div>
            </div>
        </div>
    `;

    document.querySelectorAll('.colour-option').forEach((button) => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.colour-option').forEach((option) => {
                option.classList.remove('active');
            });

            button.classList.add('active');
            document.getElementById('selectedColour').textContent = `✓ ${button.textContent} selected`;
        });
    });

    document.getElementById('detailCart').addEventListener('click', () => {
        const quantity = Math.max(1, Number(document.getElementById('detailQty').value));
        const colour = document.querySelector('.colour-option.active').textContent;
        addToCart(product.id, quantity, colour);
    });

    document.getElementById('detailWish').addEventListener('click', () => {
        toggleWishlist(product.id);
    });

    renderRelated(product);
    renderReviews(product);
    updatePrices();
}

function renderRelated(product) {
    const grid = document.getElementById('relatedGrid');

    if (!grid) {
        return;
    }

    const related = products
        .filter((item) => item.category === product.category && item.id !== product.id)
        .slice(0, 10);

    grid.innerHTML = related.map(card).join('');
    attachCardEvents();
    updatePrices();
}

function renderReviews(product) {
    const area = document.getElementById('reviewCommentArea');
    const reviews = readStore(`reviews-${product.id}`, [
        {
            name: 'Toy Haven shopper',
            rating: 5,
            text: 'Such a lovely addition to our collection!'
        }
    ]);
    const comments = readStore(`comments-${product.id}`, []);

    area.innerHTML = `
        <div class="review-comments">
            <div>
                <p class="eyebrow">REVIEWS</p>
                <h2>What shoppers are saying.</h2>

                <div>
                    ${reviews.map((review) => `
                        <article class="review-card">
                            <div>${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                            <strong>${review.name}</strong>
                            <p>${review.text}</p>
                        </article>
                    `).join('')}
                </div>

                <form id="reviewForm" class="mini-form">
                    <h3>Leave a review</h3>
                    <label>
                        Your name
                        <input name="name" required>
                    </label>
                    <label>
                        Rating
                        <select name="rating" required>
                            <option value="">Choose</option>
                            <option>5</option>
                            <option>4</option>
                            <option>3</option>
                            <option>2</option>
                            <option>1</option>
                        </select>
                    </label>
                    <label>
                        Review
                        <textarea name="text" required></textarea>
                    </label>
                    <button class="btn btn-primary">Send review</button>
                </form>
            </div>

            <div>
                <p class="eyebrow">COMMENTS</p>
                <h2>Join the conversation.</h2>

                <div>
                    ${comments.length
                        ? comments.map((comment) => `
                            <p class="comment-card">
                                <strong>${comment.name}:</strong> ${comment.text}
                            </p>
                        `).join('')
                        : '<p class="empty">No comments yet. Be the first to say hello.</p>'}
                </div>

                <form id="commentForm" class="mini-form">
                    <label>
                        Your name
                        <input name="name" required>
                    </label>
                    <label>
                        Comment
                        <textarea name="text" required></textarea>
                    </label>
                    <button class="btn btn-dark">Post comment</button>
                </form>
            </div>
        </div>
    `;

    document.getElementById('reviewForm').addEventListener('submit', (event) => {
        event.preventDefault();

        const details = Object.fromEntries(new FormData(event.target));
        const list = readStore(`reviews-${product.id}`, []);

        list.push({
            name: details.name,
            rating: Number(details.rating),
            text: details.text
        });

        writeStore(`reviews-${product.id}`, list);
        event.target.reset();
        showToast('Thank you for sharing your review! ⭐');
        renderReviews(product);
    });

    document.getElementById('commentForm').addEventListener('submit', (event) => {
        event.preventDefault();

        const details = Object.fromEntries(new FormData(event.target));
        const list = readStore(`comments-${product.id}`, []);

        list.push({
            name: details.name,
            text: details.text
        });

        writeStore(`comments-${product.id}`, list);
        event.target.reset();
        showToast('Your comment has been posted successfully!');
        renderReviews(product);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('detailMain')) {
        renderDetails();
    }
});
