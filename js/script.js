let PRODUCTS = [];
const state = {
    products: [],
    cart: []
};

/* ---------- Load products from JSON file ---------- */
fetch('data/products.json')
    .then(res => res.json())
    .then(data => {
        PRODUCTS = data;
        initApp();
    })
    .catch(err => {
        console.error("Error loading products.json", err);
        document.getElementById('productsGrid').innerHTML = "<p style='color:red;'>Failed to load products.</p>";
    });

/* ---------- Initialize App ---------- */
function initApp() {
    document.getElementById('year').textContent = new Date().getFullYear();
    state.products = PRODUCTS.slice();
    renderCategoryCards();
    renderProducts();
}

/* ---------- Render Category Cards ---------- */
function renderCategoryCards() {
    const container = document.getElementById('categoriesArea');
    const categories = [...new Set(PRODUCTS.map(p => p.category))]; // unique categories
    container.innerHTML = categories.map(cat => `
    <div class="col-md-2 mb-3">
      <div class="cat-card" onclick="filterByCategory('${cat}')">
        ${cat}
      </div>
    </div>
  `).join('');
}

/* ---------- Render Products ---------- */
function renderProducts(productsList = state.products) {
    const container = document.getElementById('productsGrid');
    if (!productsList.length) {
        container.innerHTML = "<p class='text-center text-muted'>No products found.</p>";
        return;
    }

    container.innerHTML = productsList.map(p => `
    <div class="col-md-3">
      <div class="product-card">
        <div class="product-thumb">
          <img src="${p.image}" alt="${p.name}">
        </div>
        <div class="p-3">
          <h5>${p.name}</h5>
          ${p.type ? `<p>Type: ${p.type}</p>` : ''}
          ${p.ml ? `<p>Size: ${p.ml} ml</p>` : ''}
          ${p.color ? `<p>Color: ${p.color}</p>` : ''}
          ${p.units ? `<p>Units: ${p.units}</p>` : ''}
          <p class="price-badge">£${p.price}</p>
        </div>
      </div>
    </div>
  `).join('');
}

/* ---------- Category Filter ---------- */
function filterByCategory(cat) {
    state.products = PRODUCTS.filter(p => p.category === cat);
    renderProducts(state.products);
}

/* ---------- Search & Filters ---------- */
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const minPriceInput = document.getElementById('minPrice');
const maxPriceInput = document.getElementById('maxPrice');

[searchInput, sortSelect, minPriceInput, maxPriceInput].forEach(el => {
    el.addEventListener('input', applyFilters);
});

function applyFilters() {
    let filtered = PRODUCTS.slice();

    // Category filter handled by buttons, optional extension if needed
    // const category = document.getElementById('categoryFilter').value;
    // if (category && category !== "All") filtered = filtered.filter(p => p.category === category);

    // Search filter
    const search = searchInput.value.toLowerCase();
    if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search));

    // Min/max price
    const min = parseFloat(minPriceInput.value);
    const max = parseFloat(maxPriceInput.value);
    if (!isNaN(min)) filtered = filtered.filter(p => p.price >= min);
    if (!isNaN(max)) filtered = filtered.filter(p => p.price <= max);

    // Sorting
    const sort = sortSelect.value;
    if (sort === 'priceLowHigh') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'priceHighLow') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'nameAZ') filtered.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'nameZA') filtered.sort((a, b) => b.name.localeCompare(a.name));

    state.products = filtered;
    renderProducts(filtered);
}

