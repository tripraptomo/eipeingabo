/** Shopify CDN: Minification failed

Line 16:0 Transforming class syntax to the configured target environment ("es5") is not supported yet
Line 17:13 Transforming object literal extensions to the configured target environment ("es5") is not supported yet
Line 30:6 Transforming object literal extensions to the configured target environment ("es5") is not supported yet
Line 45:7 Transforming object literal extensions to the configured target environment ("es5") is not supported yet
Line 52:16 Transforming object literal extensions to the configured target environment ("es5") is not supported yet
Line 65:21 Transforming object literal extensions to the configured target environment ("es5") is not supported yet
Line 80:21 Transforming object literal extensions to the configured target environment ("es5") is not supported yet
Line 80:37 Transforming default arguments to the configured target environment ("es5") is not supported yet
Line 84:17 Transforming object literal extensions to the configured target environment ("es5") is not supported yet
Line 85:4 Transforming const to the configured target environment ("es5") is not supported yet
... and 2 more hidden warnings

**/
class CartNotification extends HTMLElement {
    constructor() {
        super();

        this.notification = document.getElementById('cart-notification');
        this.header = document.querySelector('sticky-header');
        this.onBodyClick = this.handleBodyClick.bind(this);

        this.notification.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
        this.querySelectorAll('button[type="button"]').forEach((closeButton) =>
            closeButton.addEventListener('click', this.close.bind(this))
        );
    }

    open() {
        this.notification.classList.add('animate', 'active');

        this.notification.addEventListener(
            'transitionend',
            () => {
                this.notification.focus();
                trapFocus(this.notification);
            }, {
                once: true
            }
        );

        document.body.addEventListener('click', this.onBodyClick);
    }

    close() {
        this.notification.classList.remove('active');
        document.body.removeEventListener('click', this.onBodyClick);

        removeTrapFocus(this.activeElement);
    }

    renderContents(parsedState) {
        this.cartItemKey = parsedState.key;
        this.getSectionsToRender().forEach((section) => {
            document.getElementById(section.id).innerHTML = this.getSectionInnerHTML(
                parsedState.sections[section.id],
                section.selector
            );
        });

        if (this.header) this.header.reveal();
        this.open();
    }

    getSectionsToRender() {
        return [{
                id: 'cart-notification-product',
                selector: `[id="cart-notification-product-${this.cartItemKey}"]`,
            },
            {
                id: 'cart-notification-button',
            },
            {
                id: 'cart-icon-bubble',
            },
        ];
    }

    getSectionInnerHTML(html, selector = '.shopify-section') {
        return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
    }

    handleBodyClick(evt) {
        const target = evt.target;
        if (target !== this.notification && !target.closest('cart-notification')) {
            const disclosure = target.closest('details-disclosure, header-menu');
            this.activeElement = disclosure ? disclosure.querySelector('summary') : null;
            this.close();
        }
    }

    setActiveElement(element) {
        this.activeElement = element;
    }
}

customElements.define('cart-notification', CartNotification);