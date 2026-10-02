(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const products = [
    { name: "Tequila Nightclub (MLO)", category: "mlo", price: 29.99 },
    { name: "Tequila UI (ESX/QB)", category: "script", price: 24.99 },
    { name: "Luxury Car Pack", category: "upgrade", price: 19.99 },
    { name: "Tequila Weapon Pack", category: "gun", price: 14.99 },
    { name: "TEQUILA5M Free Starter Pack", category: "free", price: 0 }
  ];

  const state = { cart: [] };
  const toast = $("#toast");

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function initEffects() {
    const shotRain = $("#shotRain");
    if (shotRain) {
      for (let i = 0; i < 22; i++) {
        const shot = document.createElement("span");
        shot.className = "falling-shot";
        shot.textContent = "🥃";
        shot.style.left = (Math.random() * 100).toFixed(2) + "%";
        shot.style.fontSize = (18 + Math.random() * 16).toFixed(0) + "px";
        shot.style.animationDuration = (11 + Math.random() * 10).toFixed(2) + "s";
        shot.style.animationDelay = (-Math.random() * 20).toFixed(2) + "s";
        shot.style.setProperty("--drift", ((Math.random() * 96) - 48).toFixed(0) + "px");
        shotRain.appendChild(shot);
      }
    }

    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const sparkleIcons = ["✦", "✧", "✶", "✷", "✹", "❋"];
    let lastSpark = 0;

    document.addEventListener("pointermove", (event) => {
      const now = performance.now();
      if (now - lastSpark < 16) return;
      lastSpark = now;

      for (let i = 0; i < 3; i++) {
        const sparkle = document.createElement("span");
        sparkle.className = "cursor-sparkle";
        sparkle.textContent = sparkleIcons[Math.floor(Math.random() * sparkleIcons.length)];
        sparkle.style.left = (event.clientX + Math.random() * 20 - 10) + "px";
        sparkle.style.top = (event.clientY + Math.random() * 20 - 10) + "px";
        sparkle.style.fontSize = (9 + Math.random() * 12).toFixed(0) + "px";
        sparkle.style.setProperty("--sx", ((Math.random() * 48) - 24).toFixed(0) + "px");
        sparkle.style.setProperty("--sy", (-(12 + Math.random() * 30)).toFixed(0) + "px");
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 820);
      }
    }, { passive: true });
  }

  function initCategorySlider() {
    const viewport = $("#categoryViewport");
    const track = $("#categoryTrack");
    if (!viewport || !track) return;

    const originals = [...track.children];
    originals.forEach((card) => track.appendChild(card.cloneNode(true)));

    const nudge = (direction) => {
      track.style.animationPlayState = "paused";
      viewport.scrollBy({ left: direction * 290, behavior: "smooth" });
      clearTimeout(nudge.timer);
      nudge.timer = setTimeout(() => {
        viewport.scrollTo({ left: 0, behavior: "smooth" });
        track.style.animationPlayState = "";
      }, 1200);
    };

    $("#slidePrev")?.addEventListener("click", () => nudge(-1));
    $("#slideNext")?.addEventListener("click", () => nudge(1));
  }

  function initFiltering() {
    const productCards = $$(".product-card");

    function applyFilter(filter) {
      productCards.forEach((card) => {
        card.hidden = filter !== "all" && card.dataset.category !== filter;
      });

      $$(".side-filter").forEach((button) => {
        button.classList.toggle("active", button.dataset.filter === filter);
      });

      if (filter === "all") {
        showToast("Showing all TEQUILA5M products.");
      } else {
        showToast("Showing " + filter.toUpperCase() + " products.");
      }

      $("#featured")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    document.addEventListener("click", (event) => {
      const categoryButton = event.target.closest(".category-card[data-filter]");
      if (categoryButton) applyFilter(categoryButton.dataset.filter);

      const sideButton = event.target.closest(".side-filter[data-filter]");
      if (sideButton) applyFilter(sideButton.dataset.filter);

      const navFilter = event.target.closest(".nav a[data-filter]");
      if (navFilter) {
        event.preventDefault();
        applyFilter(navFilter.dataset.filter);
      }
    });

    $("#viewAll")?.addEventListener("click", () => applyFilter("all"));
  }

  function initCart() {
    const drawer = $("#cartDrawer");
    const overlay = $("#overlay");
    const count = $("#basketCount");
    const items = $("#cartItems");
    const total = $("#cartTotal");

    function openCart() {
      drawer?.classList.add("open");
      drawer?.setAttribute("aria-hidden", "false");
      overlay?.classList.add("show");
    }

    function closeCart() {
      drawer?.classList.remove("open");
      drawer?.setAttribute("aria-hidden", "true");
      overlay?.classList.remove("show");
    }

    function renderCart() {
      if (!items || !count || !total) return;

      count.textContent = String(state.cart.length);

      if (!state.cart.length) {
        items.innerHTML = '<div class="empty-cart">Your basket is empty.<br>Add something from the featured drops.</div>';
        total.textContent = "$0.00";
        return;
      }

      items.innerHTML = state.cart.map((item, index) => (
        '<div class="cart-item">' +
          '<div><strong>' + item.name + '</strong><small>$' + item.price.toFixed(2) + '</small></div>' +
          '<button class="remove-item" type="button" data-index="' + index + '" aria-label="Remove ' + item.name + '">×</button>' +
        '</div>'
      )).join("");

      total.textContent = "$" + state.cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

      $$(".remove-item", items).forEach((button) => {
        button.addEventListener("click", () => {
          state.cart.splice(Number(button.dataset.index), 1);
          renderCart();
          showToast("Removed from basket.");
        });
      });
    }

    $$(".add-btn").forEach((button) => {
      button.addEventListener("click", () => {
        state.cart.push({
          name: button.dataset.name,
          price: Number(button.dataset.price)
        });
        renderCart();
        openCart();
        showToast(button.dataset.name + " added to basket.");
      });
    });

    $("#basketBtn")?.addEventListener("click", openCart);
    $("#closeCart")?.addEventListener("click", closeCart);
    overlay?.addEventListener("click", closeCart);
    $("#clearCart")?.addEventListener("click", () => {
      state.cart = [];
      renderCart();
      showToast("Basket cleared.");
    });

    renderCart();
  }

  function initSearch() {
    const dialog = $("#searchDialog");
    const input = $("#searchInput");
    const results = $("#searchResults");

    $("#searchBtn")?.addEventListener("click", () => {
      if (dialog && typeof dialog.showModal === "function") {
        dialog.showModal();
        setTimeout(() => input?.focus(), 30);
      }
    });

    input?.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();
      if (!results) return;

      if (!query) {
        results.innerHTML = "";
        return;
      }

      const matches = products.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );

      results.innerHTML = matches.length
        ? matches.map((product) => (
            '<div class="search-result"><b>' + product.name + '</b>' +
            '<small>' + product.category.toUpperCase() + ' • $' + product.price.toFixed(2) + '</small></div>'
          )).join("")
        : '<div class="search-result"><small>No matching products.</small></div>';
    });
  }

  function initProductModal() {
    const dialog = $("#productDialog");
    const title = $("#productModalTitle");

    $$(".product-main").forEach((button) => {
      button.addEventListener("click", () => {
        if (title) title.textContent = button.dataset.product || "Product";
        if (dialog && typeof dialog.showModal === "function") dialog.showModal();
      });
    });

    $("#closeProduct")?.addEventListener("click", () => dialog?.close());
  }

  function initNavigation() {
    const menu = $("#mobileMenu");
    const nav = $("#mainNav");

    menu?.addEventListener("click", () => {
      const open = nav?.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(Boolean(open)));
    });

    $$(".nav a").forEach((link) => {
      link.addEventListener("click", () => {
        $$(".nav a").forEach((item) => item.classList.remove("active"));
        link.classList.add("active");
        nav?.classList.remove("open");
        menu?.setAttribute("aria-expanded", "false");
      });
    });

    $("#accountBtn")?.addEventListener("click", () => {
      showToast("Account button is interactive in this frontend preview.");
    });
  }

  function initNewsletter() {
    $("#newsletterForm")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = $("#email");
      if (!input || !input.value.trim()) return;
      showToast("You're on the TEQUILA5M drop list.");
      input.value = "";
    });
  }

  initEffects();
  initCategorySlider();
  initFiltering();
  initCart();
  initSearch();
  initProductModal();
  initNavigation();
  initNewsletter();
})();