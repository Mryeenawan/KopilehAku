# Kopi Leh Aku

Coffee delivery website for Kopi Leh Aku around Bintulu.

This is a static GitHub Pages-ready site. Orders are prepared as WhatsApp messages for manual confirmation.

## Menu

- Cappuccino
- Latte
- Buttercreme Latte
- Vietnam Coffee

Each menu item can be selected as hot or cold, with sweetness and simple add-on choices.

## Prototype Features

- Multi-item cart
- Sweetness choices
- Extra milk and no-straw options
- Bintulu delivery area fee estimate
- Customer name, address, and note fields
- WhatsApp draft message for manual confirmation

## Before Public Launch

Update these business details before sharing widely:

- Set the real WhatsApp number in `script.js`:
  ```js
  whatsappNumber: "60XXXXXXXXX",
  ```
- Confirm drink prices in `MENU_ITEMS`.
- Confirm delivery fees in `index.html`.
- Confirm opening hours in the page copy and `BUSINESS` settings.
- Replace illustration assets with real product photos if available.
- Test the full order flow on mobile.

## Test Locally

Open `index.html` in a browser.

## GitHub Pages

This repo includes a GitHub Pages workflow at `.github/workflows/pages.yml`.

1. Push this repository to GitHub.
2. Open repository settings.
3. Go to Pages.
4. Set the source to GitHub Actions.
5. Push to `master` or run the workflow manually.
