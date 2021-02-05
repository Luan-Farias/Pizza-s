const cart = [];
const modal = {
    qt: 1,
    key: 0,
};

const qs = el => document.querySelector(el);
const qsa = el => document.querySelectorAll(el);

//Listagens das pizzas
pizzaJson.map((item, index) => {
    const pizzaItem = qs('.models .pizza-item').cloneNode(true);

    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem
        .querySelector('.pizza-item--img img')
        .setAttribute('alt', item.name);
    pizzaItem.querySelector(
        '.pizza-item--price'
    ).innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', e => {
        e.preventDefault();
        modal.qt = 1;
        modal.key = index;

        qs('.pizzaBig img').src = item.img;
        qs('.pizzaBig img').setAttribute('alt', item.name);
        qs('.pizzaInfo h1').innerHTML = item.name;
        qs('.pizzaInfo--desc').innerHTML = item.description;
        qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${item.price.toFixed(2)}`;
        qs('.pizzaInfo--size.selected').classList.remove('selected');

        qsa('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = item.sizes[sizeIndex];
        });

        qs('.pizzaInfo--qt').innerHTML = modal.qt;

        qs('.pizzaWindowArea').style.opacity = 0;
        qs('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => (qs('.pizzaWindowArea').style.opacity = 1), 200);
    });

    qs('.pizza-area').append(pizzaItem);
});

//Eventos no html
function closeModal() {
    qs('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => (qs('.pizzaWindowArea').style.display = 'none'), 500);
}
qsa('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach(item =>
    item.addEventListener('click', closeModal)
);
qs('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modal.qt > 1) {
        modal.qt--;
        qs('.pizzaInfo--qt').innerHTML = modal.qt;
    }
});
qs('.pizzaInfo--qtmais').addEventListener('click', () => {
    modal.qt++;
    qs('.pizzaInfo--qt').innerHTML = modal.qt;
});
qsa('.pizzaInfo--size').forEach(size => {
    size.addEventListener('click', () => {
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});
qs('.pizzaInfo--addButton').addEventListener('click', () => {
    const size = parseInt(
        qs('.pizzaInfo--size.selected').getAttribute('data-key')
    );
    const indentifier = pizzaJson[modal.key].id + '@' + size;
    const cartItem = cart.find(item => item.indentifier == indentifier);
    if (cartItem) {
        cartItem.qt += modal.qt;
    } else {
        cart.push({
            indentifier,
            id: pizzaJson[modal.key].id,
            size,
            qt: modal.qt,
        });
    }
    updateCart();
    closeModal();
});

qs('.menu-openner').addEventListener('click', () =>
    cart.length > 0 ? (qs('aside').style.left = 0) : false
);
qs('.menu-closer').addEventListener(
    'click',
    () => (qs('aside').style.left = '100vw')
);

function updateCart() {
    qs('.menu-openner span').innerHTML = cart.length;

    if (!cart.length > 0) {
        qs('aside').classList.remove('show');
        qs('aside').style.left = '100vw';
        return;
    }
    qs('aside').classList.add('show');
    qs('.cart').innerHTML = '';

    const cartInfo = {
        subtotal: 0,
        desconto: 0,
        total: 0,
    };

    cart.map((itemCart, key) => {
        const pizzaItem = pizzaJson.find(item => item.id == itemCart.id);
        cartInfo.subtotal += pizzaItem.price * itemCart.qt;
        const cartItem = qs('.models .cart--item').cloneNode(true);

        switch (itemCart.size) {
            case 0:
                pizzaItem.pizzaSizeName = 'P';
                break;
            case 1:
                pizzaItem.pizzaSizeName = 'M';
                break;
            case 2:
                pizzaItem.pizzaSizeName = 'G';
                break;
        }
        const pizzaName = `${pizzaItem.name} (${pizzaItem.pizzaSizeName})`;

        cartItem.querySelector('img').src = pizzaItem.img;
        cartItem.querySelector('img').setAttribute('alt', pizzaItem.name);
        cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
        cartItem.querySelector('.cart--item--qt').innerHTML = itemCart.qt;
        cartItem
            .querySelector('.cart--item-qtmenos')
            .addEventListener('click', () => {
                if (itemCart.qt > 1) {
                    itemCart.qt--;
                } else {
                    cart.splice(key, 1);
                }
                updateCart();
            });
        cartItem
            .querySelector('.cart--item-qtmais')
            .addEventListener('click', () => {
                itemCart.qt++;
                updateCart();
            });

        cartInfo.desconto = cartInfo.subtotal * 0.1;
        cartInfo.total = cartInfo.subtotal - cartInfo.desconto;

        qs('.subtotal span:last-child').innerHTML = cartInfo.subtotal.toFixed(
            2
        );
        qs('.total span:last-child').innerHTML = cartInfo.total.toFixed(2);
        qs('.desconto span:last-child').innerHTML = cartInfo.desconto.toFixed(
            2
        );

        qs('.cart').append(cartItem);
    });
}
