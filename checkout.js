function renderCheckout() {
    const box = document.getElementById('checkoutSummary');

    if (!box) {
        return;
    }

    const cart = readStore('toyCart', []);

    if (!cart.length) {
        box.innerHTML = '<div class="empty-card"><h3>Your cart is empty.</h3><p>Add a toy before checking out.</p></div>';
        return;
    }

    let total = 0;

    box.innerHTML = cart.map((item) => {
        const product = products.find((entry) => entry.id === item.id);

        if (!product) {
            return '';
        }

        const subtotal = product.price * item.qty;
        total += subtotal;

        return `
            <div class="summary-row checkout-summary-item">
                <span>${product.name} × ${item.qty}</span>
                <strong>${money(subtotal)}</strong>
            </div>
        `;
    }).join('') + `
        <hr>
        <div class="summary-total">
            <span>Total</span>
            <strong>${money(total)}</strong>
        </div>
    `;
}

function clearCheckoutErrors(form) {
    form.querySelectorAll('.field-error').forEach((element) => element.remove());
    form.querySelectorAll('.field-invalid').forEach((element) => element.classList.remove('field-invalid'));
}

function showCheckoutError(field, message) {
    field.classList.add('field-invalid');

    const error = document.createElement('span');
    error.className = 'field-error';
    error.textContent = message;
    field.insertAdjacentElement('afterend', error);
}

function validateCheckout(form) {
    clearCheckoutErrors(form);

    const values = Object.fromEntries(new FormData(form));
    let valid = true;

    const name = form.elements.name;
    const email = form.elements.email;
    const phone = form.elements.phone;
    const address = form.elements.address;
    const country = form.elements.country;
    const payment = form.elements.payment;

    if (!values.name?.trim() || values.name.trim().length < 2) {
        showCheckoutError(name, 'Please enter your full name.');
        valid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email || '')) {
        showCheckoutError(email, 'Please enter a valid email address.');
        valid = false;
    }

    if (!/^[0-9+()\s-]{7,18}$/.test(values.phone || '')) {
        showCheckoutError(phone, 'Please enter a valid phone number.');
        valid = false;
    }

    if (!values.address?.trim() || values.address.trim().length < 10) {
        showCheckoutError(address, 'Please enter a complete delivery address.');
        valid = false;
    }

    if (!values.country) {
        showCheckoutError(country, 'Please select a country.');
        valid = false;
    }

    if (!values.payment) {
        showCheckoutError(payment, 'Please select a payment method.');
        valid = false;
    }

    return valid;
}

function setupCheckout() {
    const form = document.getElementById('checkoutForm');

    if (!form) {
        return;
    }

    form.addEventListener('input', (event) => {
        if (event.target.matches('input, textarea, select')) {
            event.target.classList.remove('field-invalid');
            event.target.nextElementSibling?.classList.contains('field-error') && event.target.nextElementSibling.remove();
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const cart = readStore('toyCart', []);

        if (!cart.length) {
            showToast('Your cart is empty. Please choose a toy first.');
            return;
        }

        if (!validateCheckout(form)) {
            showToast('Please correct the highlighted checkout fields.');
            return;
        }

        const details = Object.fromEntries(new FormData(form));
        const orderReference = `TH-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`;
        const orders = readStore('toyOrders', []);

        orders.push({
            order: orderReference,
            details,
            cart,
            date: new Date().toISOString()
        });

        writeStore('toyOrders', orders);
        localStorage.removeItem('toyCart');

        form.classList.add('hidden');
        document.getElementById('orderNumber').textContent = `Order reference: ${orderReference}`;
        document.getElementById('orderSuccess').classList.remove('hidden');

        updateCartCount();
        showToast('Order sent successfully! Thank you for your purchase! 🎉');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderCheckout();
    setupCheckout();
});
