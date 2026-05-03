// ==========================================
// DHM DISTRIBUIDORA - Sistema Local v2026
// ==========================================

const STORAGE_KEY = 'dhm_products';
const AUTH_KEY    = 'dhm_authenticated';
const ADMIN_USER  = 'admin';
const ADMIN_PASS  = 'dhm2024';
const BACKUP_KEY = 'dhm_last_backup';
const CHANGE_KEY = 'dhm_last_change';


// ==========================================
// BACKUP AUTOMÁTICO INTELIGENTE
// ==========================================

function registerChange() {
    const now = Date.now();
    localStorage.setItem(CHANGE_KEY, now);

    const lastBackup = localStorage.getItem(BACKUP_KEY);

    // Si nunca hizo backup → preguntar directo
    if (!lastBackup) {
        askForBackup();
        return;
    }

    const diff = now - parseInt(lastBackup);

    // 10 minutos (podés cambiarlo)
    const TEN_MIN = 10 * 60 * 1000;

    if (diff > TEN_MIN) {
        askForBackup();
    }
}

let backupCooldown = false;

function askForBackup() {
    if (backupCooldown) return;

    backupCooldown = true;

    setTimeout(() => {
        const confirmBackup = confirm("💾 ¿Querés hacer un backup del catálogo?");

        if (confirmBackup) {
            backupData();
            localStorage.setItem(BACKUP_KEY, Date.now());
        }

        // cooldown de 30 segundos
        setTimeout(() => {
            backupCooldown = false;
        }, 30000);

    }, 500);
}

// ── Contador correlativo de ID ─────────────────────────────
function getNextCode() {
    const products = getProducts();
    if (products.length === 0) return 1;
    const nums = products
        .map(p => parseInt(p.code))
        .filter(n => !isNaN(n));
    return nums.length ? Math.max(...nums) + 1 : products.length + 1;
}

function formatCode(n) {
    return String(n).padStart(4, '0'); // 0001, 0042, 1234
}

// ==========================================
// ALMACENAMIENTO
// ==========================================
function getProducts() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    registerChange(); // 👈 NUEVO
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ==========================================
// CATÁLOGO
// ==========================================
function loadCatalog() {
    const products = getProducts();
    loadCategories(products);
    renderCatalogProducts(products);

    document.getElementById('searchInput').addEventListener('input', filterCatalog);
    document.getElementById('categoryFilter').addEventListener('change', filterCatalog);

    const modal = document.getElementById('imageModal');
    modal.addEventListener('click', e => { if (e.target.id === 'imageModal') closeImageModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeImageModal(); });
}

function loadCategories(products) {
    const sel = document.getElementById('categoryFilter');
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))].sort();
    sel.innerHTML = '<option value="">Todas las categorías</option>';
    cats.forEach(c => sel.innerHTML += `<option value="${c}">${c}</option>`);
}

function filterCatalog() {
    let products = getProducts();
    const term = document.getElementById('searchInput').value.toLowerCase();
    const cat  = document.getElementById('categoryFilter').value;
    if (term) products = products.filter(p =>
        p.name.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term)) ||
        (p.code && p.code.includes(term))
    );
    if (cat) products = products.filter(p => p.category === cat);
    renderCatalogProducts(products);
}

function renderCatalogProducts(products) {
    const container = document.getElementById('productList');
    const countEl   = document.getElementById('productCount');
    countEl.textContent = products.length;

    if (!products.length) {
        container.innerHTML = '<div class="no-products">No se encontraron productos</div>';
        return;
    }

    products.sort((a, b) => a.name.localeCompare(b.name));

    container.innerHTML = products.map(p => `
        <div class="product-item${p.noStock ? ' out-of-stock' : ''}">
            <div class="product-image-wrap">
                <img src="${p.image || 'images/placeholder.png'}"
                     class="product-image"
                     onclick="openImageModal('${p.image || 'images/placeholder.png'}')"
                     onerror="this.src='images/placeholder.png'">
                ${p.noStock ? '<span class="badge-no-stock">Sin stock</span>' : ''}
            </div>
            <div class="product-info">
                <div class="product-name">${p.name}</div>
                ${p.code ? `<div class="product-code">Cód: ${p.code}</div>` : ''}
                ${p.category ? `<div class="product-category">${p.category}</div>` : ''}
                ${p.description ? `<div class="product-description">${p.description}</div>` : ''}
            </div>
            <div class="product-price">$${formatPrice(p.price)}</div>
        </div>
    `).join('');
}

// ── Modal imagen ───────────────────────────────────────────
function openImageModal(src) {
    const modal = document.getElementById('imageModal');
    // catálogo usa modalImg, admin usa modalImage
    const img = document.getElementById('modalImg') || document.getElementById('modalImage');
    img.src = src;
    modal.classList.add('active');
}

function closeImageModal() {
    const m = document.getElementById('imageModal');
    if (m) m.classList.remove('active');
}

// ==========================================
// PANEL ADMIN
// ==========================================
function loadAdminPanel() {
    renderAdminProducts(getProducts());
    loadAdminCategories();
    setupAdminEventListeners();
    updateCategoryDatalist();
}

function setupAdminEventListeners() {
    document.getElementById('productForm').addEventListener('submit', handleAddProduct);

    document.getElementById('productImage').addEventListener('change', e => previewImage(e.target, 'imagePreview'));
    document.getElementById('editImage').addEventListener('change', e => previewImage(e.target, 'editImagePreview'));

    document.getElementById('adminSearch').addEventListener('input', filterAdminProducts);
    document.getElementById('deleteAllBtn').addEventListener('click', deleteAllProducts);
    document.getElementById('load950Btn').addEventListener('click', load950Products);

    // CSV
    const csvBtn = document.getElementById('loadCsvBtn');
    if (csvBtn) csvBtn.addEventListener('click', loadFromCSV);

    // Exportar
    const xlsBtn = document.getElementById('exportExcelBtn');
    if (xlsBtn) xlsBtn.addEventListener('click', exportToExcel);
    const pdfBtn = document.getElementById('exportPdfBtn');
    if (pdfBtn) pdfBtn.addEventListener('click', exportToPDF);

    // Modal editar — TODOS los cierres
    const closeBtn = document.querySelector('#editModal .close-modal');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    document.getElementById('editModal').addEventListener('click', e => {
        if (e.target.id === 'editModal') closeModal();
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeModal();
    });

    document.getElementById('editForm').addEventListener('submit', handleEditProduct);
}

// ── Agregar producto ───────────────────────────────────────
function handleAddProduct(e) {
    e.preventDefault();

    const name        = document.getElementById('productName').value.trim();
    const price       = parseFloat(document.getElementById('productPrice').value);
    const category    = document.getElementById('productCategory').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    const imageInput  = document.getElementById('productImage');

    if (!name || isNaN(price)) { alert('Completá nombre y precio'); return; }

    const product = {
        id:          generateId(),
        code:        formatCode(getNextCode()),
        name, price, category, description,
        image:       '',
        noStock:     false,
    };

    if (imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = ev => { product.image = ev.target.result; saveProduct(product); };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        saveProduct(product);
    }
}

function saveProduct(product) {
    const products = getProducts();
    products.push(product);
    saveProducts(products);
    document.getElementById('productForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
    renderAdminProducts(products);
    updateCategoryDatalist();
    alert('Producto agregado correctamente');
}

// ── Render admin ───────────────────────────────────────────
function renderAdminProducts(products) {
    const container = document.getElementById('adminProductList');
    const totalEl   = document.getElementById('totalProducts');
    totalEl.textContent = products.length;

    if (!products.length) {
        container.innerHTML = '<div class="no-products">No hay productos. Agregá uno o cargá desde CSV.</div>';
        return;
    }

    products.sort((a, b) => a.name.localeCompare(b.name));

    container.innerHTML = products.map(p => `
        <div class="admin-product-item${p.noStock ? ' out-of-stock' : ''}" data-id="${p.id}">
            <div class="admin-product-image-wrap">
                <img src="${p.image || 'images/placeholder.png'}"
                     alt="${p.name}"
                     class="admin-product-image"
                     onerror="this.src='images/placeholder.png'">
                ${p.noStock ? '<span class="badge-no-stock">Sin stock</span>' : ''}
            </div>
            <div class="admin-product-info">
                <div class="admin-product-code">Cód: ${p.code || '—'}</div>
                <div class="admin-product-name">${p.name}</div>
                <div class="admin-product-price">$${formatPrice(p.price)}</div>
                ${p.category ? `<div style="font-size:12px;color:#666;">${p.category}</div>` : ''}
            </div>
            <div class="admin-product-actions">
                <button class="btn-edit"   onclick="openEditModal('${p.id}')">Editar</button>
                <button class="btn-delete" onclick="deleteProduct('${p.id}')">Eliminar</button>
            </div>
        </div>
    `).join('');
}

function filterAdminProducts() {
    let products = getProducts();
    const term = document.getElementById('adminSearch').value.toLowerCase();
    if (term) products = products.filter(p =>
        p.name.toLowerCase().includes(term) ||
        (p.category && p.category.toLowerCase().includes(term)) ||
        (p.code && p.code.includes(term))
    );
    renderAdminProducts(products);
}

// ── Modal editar ───────────────────────────────────────────
function openEditModal(id) {
    const product = getProducts().find(p => p.id === id);
    if (!product) return;

    updateCategoryDatalist();

    document.getElementById('editId').value          = product.id;
    document.getElementById('editName').value        = product.name;
    document.getElementById('editPrice').value       = product.price;
    document.getElementById('editCategory').value    = product.category || '';
    document.getElementById('editDescription').value = product.description || '';
    document.getElementById('editNoStock').checked   = product.noStock || false;

    const preview = document.getElementById('editImagePreview');
    preview.innerHTML = product.image ? `<img src="${product.image}">` : '';

    document.getElementById('editModal').classList.add('active');
}

function closeModal() {
    document.getElementById('editModal').classList.remove('active');
    document.getElementById('editForm').reset();
    document.getElementById('editImagePreview').innerHTML = '';
}

function handleEditProduct(e) {
    e.preventDefault();

    const id          = document.getElementById('editId').value;
    const name        = document.getElementById('editName').value.trim();
    const price       = parseFloat(document.getElementById('editPrice').value);
    const category    = document.getElementById('editCategory').value.trim();
    const description = document.getElementById('editDescription').value.trim();
    const noStock     = document.getElementById('editNoStock').checked;
    const imageInput  = document.getElementById('editImage');

    let products = getProducts();
    const index  = products.findIndex(p => p.id === id);
    if (index === -1) return;

    products[index] = { ...products[index], name, price, category, description, noStock };

    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = ev => {
            products[index].image = ev.target.result;
            saveProducts(products);
            renderAdminProducts(products);
            loadAdminCategories();
            closeModal();
            alert('Producto actualizado');
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        saveProducts(products);
        renderAdminProducts(products);
        closeModal();
        alert('Producto actualizado');
    }
}

// ── Eliminar ───────────────────────────────────────────────
function deleteProduct(id) {
    if (!confirm('¿Eliminar este producto?')) return;
    let products = getProducts().filter(p => p.id !== id);
    saveProducts(products);
    renderAdminProducts(products);
}

function deleteAllProducts() {
    if (!confirm('¿Eliminar TODOS los productos? Esta acción no se puede deshacer.')) return;
    if (!confirm('Segunda confirmación: ¿eliminar todo?')) return;
    saveProducts([]);
    renderAdminProducts([]);
}

// ── Imagen preview ─────────────────────────────────────────
function previewImage(input, previewId) {
    if (!input.files[0]) return;
    const reader = new FileReader();
    reader.onload = e => {
        document.getElementById(previewId).innerHTML = `<img src="${e.target.result}" alt="Preview">`;
    };
    reader.readAsDataURL(input.files[0]);
}

// ── CSV ────────────────────────────────────────────────────
function loadFromCSV() {
    const fileInput = document.getElementById('csvFile');
    if (!fileInput || !fileInput.files[0]) { alert('Seleccioná un archivo CSV primero'); return; }

    const reader = new FileReader();
    reader.onload = e => {
        const csv   = e.target.result;
        const lines = csv.split('\n').filter(l => l.trim());
        const start = lines[0].toLowerCase().includes('nombre') ? 1 : 0;
        const products = getProducts();
        let added = 0;

        for (let i = start; i < lines.length; i++) {
            const parts = lines[i].split(',').map(p => p.trim().replace(/^"|"$/g, ''));
            if (parts.length >= 2 && parts[0]) {
                products.push({
                    id:          generateId(),
                    code:        formatCode(getNextCode() + added),
                    name:        parts[0],
                    price:       parseFloat(parts[1]) || 0,
                    category:    parts[2] || '',
                    description: parts[3] || '',
                    image:       parts[4] || '',
                    noStock:     false,
                });
                added++;
            }
        }

        saveProducts(products);
        renderAdminProducts(products);
        alert(`Se cargaron ${added} productos desde el CSV`);
    };
    reader.readAsText(fileInput.files[0]);
}

function exportToExcel() {
    let products = getProducts();

    if (!products.length) {
        alert('No hay productos');
        return;
    }

    // 🔥 ORDEN PRO
    products.sort((a, b) => {
        if (a.noStock !== b.noStock) {
            return a.noStock ? 1 : -1;
        }
        return a.name.localeCompare(b.name, 'es');
    });

    const fecha = new Date().toLocaleDateString('es-AR');

    const rows = products.map(p => {
        const img = p.image
            ? `<img src="${p.image}" width="70" height="70">`
            : '';

        return `
        <tr>
            <td class="code">${p.code || '—'}</td>
            <td class="img-cell">${img}</td>
            <td class="name">
                ${p.name}
                ${p.noStock ? '<div style="color:red;font-size:11px;">SIN STOCK</div>' : ''}
            </td>
            <td class="price">$${formatPrice(p.price)}</td>
        </tr>`;
    }).join('');

    const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel">
    <head>
        <meta charset="UTF-8">
        <style>
            table { border-collapse: collapse; }

            th {
                background:#1e3a8a;
                color:white;
                height:80px;
                text-align:center;
            }

            td, th {
                border:1px solid #ccc;
                padding:0;
                vertical-align:middle;
            }

            .code {
                width:80px;
                height:80px;
                text-align:center;
                font-family:monospace;
                font-weight:600;
            }

            .img-cell {
                width:80px;
                height:80px;
                text-align:center;
            }

            .img-cell img {
                width:70px;
                height:70px;
                display:block;
                margin:auto;
            }

            .name {
                width:400px;
                padding:10px;
                font-size:13px;
            }

            .price {
                width:120px;
                text-align:right;
                padding-right:10px;
                color:#16a34a;
                font-weight:700;
            }
        </style>
    </head>
    <body>
        <h2>DHM Distribuidora - ${fecha}</h2>

        <table>
            <tr>
                <th>Código</th>
                <th>Imagen</th>
                <th>Producto</th>
                <th>Precio</th>
            </tr>
            ${rows}
        </table>
    </body>
    </html>
    `;

    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `Catalogo_DHM_${new Date().toISOString().slice(0,10)}.xls`;
    a.click();

    URL.revokeObjectURL(url);
}

// ==========================================
// EXPORTAR PDF CON LOGO + MENSAJE
// ==========================================
function exportToPDF() {
    let products = getProducts();

    if (!products.length) {
        alert('No hay productos');
        return;
    }

    // 🔥 ORDEN PRO
    products.sort((a, b) => {
        if (a.noStock !== b.noStock) {
            return a.noStock ? 1 : -1;
        }
        return a.name.localeCompare(b.name, 'es');
    });

    const fecha = new Date().toLocaleDateString('es-AR');

    const rows = products.map(p => {
        const img = p.image
            ? `<img src="${p.image}" style="width:60px;height:60px;object-fit:cover;border-radius:6px;">`
            : '—';

        return `
        <tr>
            <td style="text-align:center;font-family:monospace;">${p.code || '—'}</td>
            <td style="text-align:center;">${img}</td>
            <td>
                ${p.name}
                ${p.noStock ? '<div style="color:red;font-size:11px;">SIN STOCK</div>' : ''}
            </td>
            <td style="text-align:right;color:#16a34a;font-weight:bold;">
                $${formatPrice(p.price)}
            </td>
        </tr>`;
    }).join('');

    const win = window.open('', '_blank');

    win.document.write(`
    <html>
    <head>
        <title>Catálogo</title>
    </head>
    <body style="font-family:Arial; padding:20px;">

        <!-- HEADER -->
        <div style="display:flex; align-items:center; gap:15px; margin-bottom:15px;">
            <img src="images/logo-dhm.png" style="height:60px;">
            <div>
                <h2 style="margin:0;">DHM Distribuidora</h2>
                <div style="font-size:13px;color:#555;">Catálogo actualizado - ${fecha}</div>
            </div>
        </div>

        <!-- MENSAJE -->
        <div style="
            background:#fff3cd;
            padding:10px;
            border:1px solid #ffeeba;
            border-radius:6px;
            margin-bottom:15px;
            font-size:13px;
        ">
            🔎 Buscá productos por nombre o código usando <b>Ctrl + F</b>
        </div>

        <!-- TABLA -->
        <table border="1" style="border-collapse:collapse;width:100%">
            <tr style="background:#1e3a8a;color:white;">
                <th>Código</th>
                <th>Imagen</th>
                <th>Producto</th>
                <th>Precio</th>
            </tr>
            ${rows}
        </table>

        <script>
            window.onload = () => window.print();
        <\/script>

    </body>
    </html>
    `);

    win.document.close();
}

// ==========================================
// 950 PRODUCTOS DE EJEMPLO
// ==========================================
function load950Products() {
    if (!confirm('Esto agregará 950 productos de ejemplo. ¿Continuar?')) return;

    const categories = ['Herramientas Eléctricas','Iluminación LED','Cables y Conductores','Material Eléctrico','Ferretería General','Plomería','Pinturería','Construcción','Jardinería','Automotor','Seguridad','Hogar'];
    const productTypes = {
        'Herramientas Eléctricas': ['Amoladora Angular','Taladro Percutor','Atornillador','Sierra Circular','Sierra Caladora','Lijadora Orbital','Pulidora','Soldadora Inverter','Compresor de Aire','Hidrolavadora','Rotomartillo','Esmeril de Banco','Pistola de Calor','Fresadora','Cepillo Eléctrico','Ingletadora'],
        'Iluminación LED': ['Plafón LED Redondo','Plafón LED Cuadrado','Panel LED Embutir','Panel LED Aplicar','Reflector LED','Tubo LED','Lámpara LED Bulbo','Lámpara LED Vela','Tira LED','Dicroica LED','Aplique LED Exterior','Farola LED','Proyector LED','Luz de Emergencia LED','Spot LED'],
        'Cables y Conductores': ['Cable Unipolar','Cable Bipolar','Cable TPR','Cable Taller','Cable Subterráneo','Cable Coaxil','Cable UTP','Cable HDMI','Cable USB','Cordón Paralelo','Cable Telefónico','Cable Audio','Alambre Galvanizado','Cable Acero','Manguera Corrugada'],
        'Material Eléctrico': ['Interruptor Simple','Interruptor Doble','Tomacorriente','Enchufe','Ficha Macho','Ficha Hembra','Portalámpara','Caja de Luz','Tablero Eléctrico','Disyuntor','Termomagnética','Contactor','Temporizador','Fotocélula','Dimmer','Sensor de Movimiento'],
        'Ferretería General': ['Tornillo Autoperforante','Tornillo Madera','Tornillo Machine','Clavo','Arandela','Tuerca','Bulón','Remache','Candado','Cerradura','Bisagra','Manija','Picaporte','Pasador','Cadena','Mosquetón','Cáncamo','Grampas'],
        'Plomería': ['Caño PVC','Caño PPR','Codo PVC','Codo PPR','Curva PVC','Te PVC','Te PPR','Unión PVC','Cupla PPR','Válvula Esférica','Válvula Retención','Flotante','Canilla','Grifo','Flexible','Sifón','Pileta','Rejilla','Trampa','Sellador'],
        'Pinturería': ['Pintura Látex Interior','Pintura Látex Exterior','Esmalte Sintético','Convertidor de Óxido','Fondo Blanco','Sellador','Enduído','Pincel','Rodillo','Bandeja','Lija','Espátula','Cinta de Papel','Diluyente','Aguarrás','Thinner','Barniz','Laca'],
        'Construcción': ['Cemento','Arena','Cal','Yeso','Adhesivo para Cerámicos','Pastina','Membrana Líquida','Membrana Asfáltica','Hidrófugo','Impermeabilizante','Malla PRFV','Hierro','Alambre de Atar','Ladrillo','Block','Vigueta','Bovedilla'],
        'Jardinería': ['Manguera Riego','Aspersor','Pico Riego','Tijera Podar','Serrucho Poda','Rastrillo','Pala','Azada','Machete','Guantes Jardinería','Maceta','Sustrato','Fertilizante','Insecticida','Herbicida','Bordeadora','Cortadora Césped'],
        'Automotor': ['Aceite Motor','Filtro Aceite','Filtro Aire','Filtro Combustible','Bujía','Batería','Lámpara Auto','Fusible','Terminal','Precinto','Cinta Aisladora','Limpia Contactos','Lubricante','Grasa','Líquido Frenos','Refrigerante','Lavaparabrisas'],
        'Seguridad': ['Casco','Guante','Zapato Seguridad','Antiparras','Protector Auditivo','Máscara Soldar','Barbijo','Chaleco Reflectivo','Arnés','Soga Seguridad','Extintor','Detector Humo','Cámara Seguridad','Alarma','Candado de Seguridad','Cinta Peligro'],
        'Hogar': ['Percha','Organizador','Caja Plástica','Contenedor','Escoba','Balde','Secador Piso','Trapo Piso','Guante Limpieza','Bolsa Residuos','Esponja','Cepillo','Plumero','Escalera'],
    };
    const brands = ['Stanley','Black+Decker','Bosch','Makita','DeWalt','Philco','Gamma','Dowen Pagio','Einhell','Skil','Dremel','Tramontina','Bremen','Neo','Lusqtoff','Gladiator','Argentec','Tigre','Amanco','Acqua'];
    const specs  = ['115mm','125mm','180mm','230mm','13mm','10mm','12V','18V','20V','220V','500W','750W','1000W','1500W','6W','9W','12W','18W','24W','30W','50W','100W','1.5mm','2.5mm','4mm','6mm','10mm','16mm','25mm','50m','100m','1L','4L','20L','1kg','5kg','25kg','50kg'];

    const products = getProducts();
    let count = 0;
    while (count < 950) {
        for (const cat of categories) {
            if (count >= 950) break;
            for (const type of (productTypes[cat] || ['Producto'])) {
                if (count >= 950) break;
                products.push({
                    id:       generateId(),
                    code:     formatCode(getNextCode() + count),
                    name:     `${type} ${brands[Math.floor(Math.random()*brands.length)]} ${specs[Math.floor(Math.random()*specs.length)]}`,
                    price:    Math.floor(Math.random() * 50000) + 500,
                    category: cat,
                    description: '',
                    image:    '',
                    noStock:  false,
                });
                count++;
            }
        }
    }
    saveProducts(products);
    renderAdminProducts(products);
    alert(`Se cargaron ${count} productos de ejemplo`);
}

// ==========================================
// AUTH
// ==========================================
function checkAuth() {
    if (localStorage.getItem(AUTH_KEY) === 'true') {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display  = 'block';
        loadAdminPanel();
    } else {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('adminPanel').style.display  = 'none';
    }
}

function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        localStorage.setItem(AUTH_KEY, 'true');
        checkAuth();
    } else {
        alert('Usuario o contraseña incorrectos');
    }
}

function logout() {
    localStorage.removeItem(AUTH_KEY);
    location.reload();
}

// ==========================================
// UTILIDADES
// ==========================================
function formatPrice(price) {
    return Number(price).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function updateCategoryDatalist() {
    const dl = document.getElementById('categories');
    if (!dl) return;
    const cats = [...new Set(getProducts().map(p => p.category).filter(Boolean))];
    dl.innerHTML = cats.map(c => `<option value="${c}">`).join('');
}

function loadAdminCategories() {
    const sel = document.getElementById('productCategory');
    if (!sel) return;
    const cats = [...new Set(getProducts().map(p => p.category).filter(Boolean))].sort();
    sel.innerHTML = '<option value="">Seleccionar categoría</option>' +
        cats.map(c => `<option value="${c}">${c}</option>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('editForm');
    if (form) {
        // admin.html
        checkAuth();
    }
});

function backupData() {
    const data = localStorage.getItem('dhm_products');

    if (!data) {
        alert('No hay datos para guardar');
        return;
    }

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup_dhm.json';
    a.click();

    URL.revokeObjectURL(url);
}

function restoreData() {
    const input = document.getElementById('restoreFile');
    input.click();

    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(ev) {
            try {
                localStorage.setItem('dhm_products', ev.target.result);
                alert('Backup restaurado correctamente');
                location.reload();
            } catch {
                alert('Error al cargar backup');
            }
        };
        reader.readAsText(file);
    };
}


fetch('productos.json')
  .then(res => res.json())
  .then(data => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    loadCatalog();
  });
