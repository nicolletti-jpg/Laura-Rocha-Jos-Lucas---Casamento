// Script de interatividade leve

// Menu mobile se existir
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Animação de entrada suave
window.addEventListener('load', () => {
    document.querySelectorAll('.hero-image, .hero-text, .hero-quote, .section-title, .detail-box, .quote-box, .location-item, .method-box, .btn-prev, .btn-next, .btn-home').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.animation = `slideInUp 0.8s ease ${index * 0.05}s forwards`;
    });
});

// ===== Carrinho de presentes (presente pages) =====
function formatBRL(v){
    return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(v||0));
}

function getCart(){
    return JSON.parse(localStorage.getItem('cart')||'[]');
}

function saveCart(cart){
    localStorage.setItem('cart', JSON.stringify(cart));
}

function getRemoved(){
    return JSON.parse(localStorage.getItem('removedIds')||'[]');
}

function saveRemoved(arr){
    localStorage.setItem('removedIds', JSON.stringify(arr));
}

function addToCart(item){
    const cart = getCart();
    if(cart.some(i => String(i.id) === String(item.id))){
        alert('Este presente já está no carrinho.');
        return;
    }
    cart.push(item);
    saveCart(cart);
    // hide product card and disable button
    const card = document.querySelector(`.product-card[data-id="${item.id}"]`);
    if(card) {
        card.classList.add('hidden');
        const btn = card.querySelector('.btn-add');
        if(btn) btn.disabled = true;
    }
    const removed = getRemoved();
    if(!removed.includes(String(item.id))) removed.push(String(item.id));
    saveRemoved(removed);
}

document.addEventListener('click', (e)=>{
    if(e.target && e.target.classList.contains('btn-add')){
        const btn = e.target;
        btn.disabled = true;
        const id = btn.dataset.id;
        const card = document.querySelector(`.product-card[data-id="${id}"]`);
        if(!card) return;
        const name = card.querySelector('h3')?.textContent || `Presente ${id}`;
        const desc = card.querySelector('.product-desc')?.textContent || '';
        const srcEl = card.querySelector('img');
        const src = srcEl ? srcEl.getAttribute('src') : '';
        const price = Number(card.dataset.price || 0);
        addToCart({id, name, desc, price, src});
    }
});

// On presentes page load hide items already added
window.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('.product-card').forEach(card=>{
        const id = card.dataset.id;
        const removed = getRemoved();
        if(removed.includes(String(id))){
            card.classList.add('hidden');
        }
        // update price display if dataset.price present
        const price = Number(card.dataset.price || 0);
        const priceEl = card.querySelector('.price');
        if(priceEl) priceEl.textContent = formatBRL(price);
    });
});

