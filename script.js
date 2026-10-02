(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const productData = [
    {name:"Tequila Nightclub (MLO)",category:"mlo",price:29.99},
    {name:"Tequila UI (ESX/QB)",category:"script",price:24.99},
    {name:"Luxury Car Pack",category:"upgrade",price:19.99},
    {name:"Tequila Weapon Pack",category:"gun",price:14.99},
    {name:"Starter Freebie Pack",category:"free",price:0}
  ];
  const state = { cart: [] };
  const toast = $("#toast");
  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.t);
    showToast.t = setTimeout(() => toast.classList.remove("show"), 2200);
  };
  const shotRain = $("#shotRain");
  if (shotRain) {
    for (let i = 0; i < 22; i++) {
      const el = document.createElement("span");
      el.className = "falling-shot";
      el.textContent = "🥃";
      el.style.left = (Math.random()*100).toFixed(2) + "%";
      el.style.fontSize = (18 + Math.random()*15).toFixed(0) + "px";
      el.style.animationDuration = (11 + Math.random()*10).toFixed(2) + "s";
      el.style.animationDelay = (-Math.random()*19).toFixed(2) + "s";
      el.style.setProperty("--drift", ((Math.random()*96)-48).toFixed(0)+"px");
      shotRain.appendChild(el);
    }
  }
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) {
    let last = 0;
    const sparkles = ["✦","✧","✶","✷","✹","❋"];
    document.addEventListener("pointermove", e => {
      const now = performance.now();
      if (now-last < 16) return;
      last = now;
      for (let i=0;i<3;i++) {
        const sp = document.createElement("span");
        sp.className = "cursor-sparkle";
        sp.textContent = sparkles[Math.floor(Math.random()*sparkles.length)];
        sp.style.left = (e.clientX + Math.random()*18 - 9) + "px";
        sp.style.top = (e.clientY + Math.random()*18 - 9) + "px";
        sp.style.fontSize = (9 + Math.random()*11) + "px";
        sp.style.setProperty("--x", ((Math.random()*46)-23)+"px");
        sp.style.setProperty("--y", (-(12+Math.random()*28))+"px");
        document.body.appendChild(sp);
        setTimeout(()=>sp.remove(),820);
      }
    }, {passive:true});
  }
  const categoryTrack = $("#categoryTrack");
  if (categoryTrack) {
    const originals = [...categoryTrack.children];
    originals.forEach(node => categoryTrack.appendChild(node.cloneNode(true)));
  }
  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");
  menuToggle?.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  const cards = $$(".product-card");
  const sideLinks = $$(".side-link");
  const categoryButtons = $$(".category-card");
  function filterProducts(filter) {
    cards.forEach(card => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
    sideLinks.forEach(btn => btn.classList.toggle("active", btn.dataset.filter === filter));
    $("#featured")?.scrollIntoView({behavior:"smooth",block:"start"});
    showToast(filter === "all" ? "Showing all products." : "Showing " + filter.toUpperCase() + " products.");
  }
  sideLinks.forEach(btn => btn.addEventListener("click", () => filterProducts(btn.dataset.filter)));
  categoryButtons.forEach(btn => btn.addEventListener("click", () => filterProducts(btn.dataset.filter)));
  $("#viewAll")?.addEventListener("click", () => filterProducts("all"));
  const overlay = $("#overlay");
  const drawer = $("#cartDrawer");
  const cartItems = $("#cartItems");
  const cartTotal = $("#cartTotal");
  const cartCount = $("#basketCount");
  function openCart() {
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden","false");
    overlay.classList.add("show");
  }
  function closeCart() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden","true");
    overlay.classList.remove("show");
  }
  function renderCart() {
    cartCount.textContent = state.cart.length;
    if (!state.cart.length) {
      cartItems.innerHTML = '<div class="empty-cart">Your basket is empty.<br>Add a TEQUILA5M drop.</div>';
      cartTotal.textContent = "$0.00";
      return;
    }
    cartItems.innerHTML = state.cart.map((item,i)=>`
      <div class="cart-item">
        <div><strong>${item.name}</strong><small>$${item.price.toFixed(2)}</small></div>
        <button class="remove-item" type="button" data-index="${i}" aria-label="Remove ${item.name}">×</button>
      </div>`).join("");
    cartTotal.textContent = "$" + state.cart.reduce((s,x)=>s+x.price,0).toFixed(2);
    $$(".remove-item",cartItems).forEach(btn => btn.addEventListener("click", () => {
      state.cart.splice(Number(btn.dataset.index),1);
      renderCart();
      showToast("Removed from basket.");
    }));
  }
  $$(".add-button").forEach(btn => btn.addEventListener("click", () => {
    state.cart.push({name:btn.dataset.name,price:Number(btn.dataset.price)});
    renderCart();
    openCart();
    showToast(btn.dataset.name + " added to basket.");
  }));
  $("#basketButton")?.addEventListener("click", openCart);
  $("#closeCart")?.addEventListener("click", closeCart);
  overlay?.addEventListener("click", closeCart);
  $("#clearCart")?.addEventListener("click", () => {
    state.cart = [];
    renderCart();
    showToast("Basket cleared.");
  });
  renderCart();
  const searchDialog = $("#searchDialog");
  const searchInput = $("#searchInput");
  const searchResults = $("#searchResults");
  $("#searchButton")?.addEventListener("click", () => {
    if (typeof searchDialog.showModal === "function") searchDialog.showModal();
    setTimeout(()=>searchInput?.focus(),20);
  });
  searchInput?.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();
    const matches = q ? productData.filter(p => p.name.toLowerCase().includes(q) || p.category.includes(q)) : [];
    searchResults.innerHTML = matches.length
      ? matches.map(p=>`<div class="search-result"><b>${p.name}</b><small>${p.category.toUpperCase()} • $${p.price.toFixed(2)}</small></div>`).join("")
      : q ? '<div class="search-result"><small>No matching products.</small></div>' : "";
  });
  $("#accountButton")?.addEventListener("click", () => showToast("Account action is ready to connect to Tebex login."));
  $("#newsletterForm")?.addEventListener("submit", e => {
    e.preventDefault();
    const input = $("#newsletterEmail");
    if (!input.value.trim()) return;
    showToast("You're on the TEQUILA5M drop list.");
    input.value = "";
  });
  $$(".main-nav a").forEach(link => link.addEventListener("click", () => {
    $$(".main-nav a").forEach(a=>a.classList.remove("active"));
    link.classList.add("active");
    mainNav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded","false");
  }));
})();