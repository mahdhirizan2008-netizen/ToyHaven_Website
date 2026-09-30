function renderCart() {
    const box = document.getElementById('cartItems');

    if (!box) {
        return;
    }

    const cart = readStore('toyCart', []);

    if (!cart.length) {
        box.innerHTML = `
            <div class="empty-card">
                <h2>Your cart is empty.</h2>
                <p>Let us find a little something to make it happier.</p>
                <a class="btn btn-primary" href="products.html">Explore toys</a>
            </div>
        `;
        document.getElementById('cartSummary').innerHTML = '';
        return;
    }

    let total = 0;

    box.innerHTML = cart.map((item) => {
        const product = products.find((entry) => entry.id === item.id);
        const subtotal = product.price * item.qty;
        total += subtotal;

        return `
            <article class="cart-item">
                <img src="${product.image}" alt="${product.name}">
                <div>
                    <p class="product-category">${product.category}</p>
                    <h3>${product.name}</h3>
                    <p>Colour: ${item.colour}</p>
                    <div class="qty-controls">
                        <button data-minus="${item.id}" data-colour="${item.colour}">−</button>
                        <span>${item.qty}</span>
                        <button data-plus="${item.id}" data-colour="${item.colour}">+</button>
                    </div>
                </div>
                <strong>${money(subtotal)}</strong>
                <button class="remove-button" data-remove="${item.id}" data-colour="${item.colour}" aria-label="Remove item">
                    ×
                </button>
            </article>
        `;
    }).join('');

    document.getElementById('cartSummary').innerHTML = `
        <div class="summary-row">
            <span>Subtotal</span>
            <strong>${money(total)}</strong>
        </div>
        <div class="summary-row">
            <span>Delivery</span>
            <strong>Selected at checkout</strong>
        </div>
        <hr>
        <div class="summary-total">
            <span>Total</span>
            <strong>${money(total)}</strong>
        </div>
    `;

    box.querySelectorAll('[data-plus]').forEach((button) => {
        button.addEventListener('click', () => {
            changeQty(Number(button.dataset.plus), button.dataset.colour, 1);
        });
    });

    box.querySelectorAll('[data-minus]').forEach((button) => {
        button.addEventListener('click', () => {
            changeQty(Number(button.dataset.minus), button.dataset.colour, -1);
        });
    });

    box.querySelectorAll('[data-remove]').forEach((button) => {
        button.addEventListener('click', () => {
            removeItem(Number(button.dataset.remove), button.dataset.colour);
        });
    });

    updatePrices();
}

function changeQty(id, colour, amount) {
    const cart = readStore('toyCart', []);
    const item = cart.find((entry) => entry.id === id && entry.colour === colour);

    if (!item) {
        return;
    }

    item.qty += amount;

    if (item.qty < 1) {
        cart.splice(cart.indexOf(item), 1);
    }

    writeStore('toyCart', cart);
    renderCart();
    updateCartCount();
}

function removeItem(id, colour) {
    const cart = readStore('toyCart', []);
    const updatedCart = cart.filter((item) => !(item.id === id && item.colour === colour));

    writeStore('toyCart', updatedCart);
    renderCart();
    updateCartCount();
    showToast('Toy removed from your cart.');
}

document.addEventListener('DOMContentLoaded', () => {
    renderCart();

    document.getElementById('clearCart')?.addEventListener('click', () => {
        localStorage.removeItem('toyCart');
        renderCart();
        updateCartCount();
        showToast('Your cart has been cleared.');
    });
});
