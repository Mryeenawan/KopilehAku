const WHATSAPP_NUMBER = "";

const form = document.querySelector("#orderForm");
const coffeeSelect = document.querySelector("#coffeeSelect");
const quantityInput = document.querySelector("#quantityInput");
const deliveryArea = document.querySelector("#deliveryArea");
const customerName = document.querySelector("#customerName");
const addressInput = document.querySelector("#addressInput");
const noteInput = document.querySelector("#noteInput");
const extraMilk = document.querySelector("#extraMilk");
const noStraw = document.querySelector("#noStraw");
const addItemButton = document.querySelector("#addItemButton");
const clearCartButton = document.querySelector("#clearCartButton");
const cartItems = document.querySelector("#cartItems");
const summaryContent = document.querySelector("#summaryContent");
const whatsappLink = document.querySelector("#whatsappLink");
const mobileCartCount = document.querySelector("#mobileCartCount");

const cart = [];

const money = new Intl.NumberFormat("en-MY", {
  style: "currency",
  currency: "MYR",
});

function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `item-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function selectedOptionNumber(select, key) {
  return Number(select.selectedOptions[0].dataset[key] || 0);
}

function currentDrink() {
  const addOns = [];

  if (extraMilk.checked) addOns.push("Extra milk");
  if (noStraw.checked) addOns.push("No straw");

  return {
    id: createId(),
    drink: coffeeSelect.value,
    price: selectedOptionNumber(coffeeSelect, "price"),
    temperature: document.querySelector("input[name='temperature']:checked").value,
    sweetness: document.querySelector("input[name='sweetness']:checked").value,
    addOns,
    quantity: Math.max(1, Number(quantityInput.value || 1)),
  };
}

function cartSubtotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function cartQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function deliveryFee() {
  return selectedOptionNumber(deliveryArea, "fee");
}

function orderTotal() {
  return cartSubtotal() + deliveryFee();
}

function itemDetail(item) {
  const details = [item.temperature, item.sweetness, ...item.addOns];
  return details.join(", ");
}

function renderCart() {
  const count = cartQuantity();
  mobileCartCount.textContent = `${count} ${count === 1 ? "drink" : "drinks"}`;

  if (!cart.length) {
    cartItems.textContent = "No drinks added yet.";
    renderSummary();
    return;
  }

  const lines = cart
    .map(
      (item) => `
        <div class="cart-line">
          <div>
            <strong>${item.quantity}x ${escapeHtml(item.drink)}</strong>
            <small>${escapeHtml(itemDetail(item))}</small>
            <small>${money.format(item.price)} each</small>
          </div>
          <button class="remove-item" type="button" data-remove-id="${item.id}" aria-label="Remove ${escapeHtml(item.drink)}">x</button>
        </div>
      `,
    )
    .join("");

  cartItems.innerHTML = `
    ${lines}
    <div class="cart-total">
      <span>Drinks subtotal</span>
      <span>${money.format(cartSubtotal())}</span>
    </div>
  `;

  renderSummary();
}

function renderSummary(showCustomer = false) {
  if (!cart.length) {
    summaryContent.textContent = "Add at least one drink to preview the test order.";
    whatsappLink.classList.add("disabled");
    whatsappLink.setAttribute("aria-disabled", "true");
    whatsappLink.href = "#";
    return;
  }

  const fee = deliveryFee();
  const feeText = fee > 0 ? money.format(fee) : "Confirm first";
  const totalText = fee > 0 ? money.format(orderTotal()) : "Confirm delivery fee first";
  const customerRows = showCustomer
      ? `
      <div class="summary-row"><span>Name</span><span>${escapeHtml(customerName.value.trim() || "-")}</span></div>
      <div class="summary-row"><span>Address</span><span>${escapeHtml(addressInput.value.trim() || "-")}</span></div>
    `
    : "";
  const noteRow =
    showCustomer && noteInput.value.trim()
      ? `<div class="summary-row"><span>Note</span><span>${escapeHtml(noteInput.value.trim())}</span></div>`
      : "";

  summaryContent.innerHTML = `
    <div class="summary-list">
      <div class="summary-row"><span>Drinks</span><span>${cartQuantity()} item(s)</span></div>
      <div class="summary-row"><span>Subtotal</span><span>${money.format(cartSubtotal())}</span></div>
      <div class="summary-row"><span>Delivery</span><span>${deliveryArea.value}: ${feeText}</span></div>
      <div class="summary-row"><span>Total</span><span>${totalText}</span></div>
      ${customerRows}
      ${noteRow}
    </div>
  `;
}

function createWhatsAppMessage() {
  const lines = cart.map((item, index) => {
    return `${index + 1}. ${item.quantity}x ${item.temperature} ${item.drink} (${item.sweetness}${
      item.addOns.length ? `, ${item.addOns.join(", ")}` : ""
    })`;
  });
  const totalText = deliveryFee() > 0 ? money.format(orderTotal()) : "Confirm delivery fee first";

  return [
    "Hi Kopi Leh Aku, this is a test order from the website.",
    "",
    "Order:",
    ...lines,
    "",
    `Subtotal: ${money.format(cartSubtotal())}`,
    `Delivery area: ${deliveryArea.value}`,
    `Estimated total: ${totalText}`,
    "",
    `Name: ${customerName.value.trim()}`,
    `Address: ${addressInput.value.trim()}`,
    noteInput.value.trim() ? `Note: ${noteInput.value.trim()}` : "",
    "",
    "Testing only, not a real business order yet.",
  ]
    .filter((line) => line !== "")
    .join("\n");
}

function updateDraftLink() {
  const message = createWhatsAppMessage();
  const target = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}?text=` : "https://wa.me/?text=";

  whatsappLink.href = `${target}${encodeURIComponent(message)}`;
  whatsappLink.classList.remove("disabled");
  whatsappLink.removeAttribute("aria-disabled");
}

function resetDrinkOptions() {
  quantityInput.value = "1";
  document.querySelector("input[name='temperature'][value='Hot']").checked = true;
  document.querySelector("input[name='sweetness'][value='Normal sweet']").checked = true;
  extraMilk.checked = false;
  noStraw.checked = false;
}

addItemButton.addEventListener("click", () => {
  cart.push(currentDrink());
  resetDrinkOptions();
  renderCart();
});

clearCartButton.addEventListener("click", () => {
  cart.length = 0;
  renderCart();
});

cartItems.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-id]");
  if (!removeButton) return;

  const itemIndex = cart.findIndex((item) => item.id === removeButton.dataset.removeId);
  if (itemIndex >= 0) cart.splice(itemIndex, 1);
  renderCart();
});

document.querySelectorAll("[data-menu-pick]").forEach((button) => {
  button.addEventListener("click", () => {
    coffeeSelect.value = button.dataset.menuPick;
  });
});

["change", "input"].forEach((eventName) => {
  form.addEventListener(eventName, () => renderSummary());
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!cart.length) {
    cart.push(currentDrink());
    resetDrinkOptions();
  }

  renderCart();
  renderSummary(true);
  updateDraftLink();
});

renderCart();
