document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
        });
    });

    const btnTop = document.getElementById('scroll-to-top');
    const btnBottom = document.getElementById('scroll-to-bottom');

    if (btnTop) {
        btnTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (btnBottom) {
        btnBottom.addEventListener('click', () => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });
    }

    // --- 3. Search Logic Shell ---
    const searchInput = document.getElementById('site-search');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.toLowerCase();
                console.log("Searching for:", query);
                executeSearch(query);
            }
        });
    }
});

function executeSearch(query) {
    const blogCards = document.querySelectorAll('.card');
    blogCards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        if (title.includes(query)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

// --- NEW: MODAL CONTROL LOGIC ---
// This part was missing, which is why the popups weren't appearing.

function openModal(id) {
    const overlay = document.getElementById('modal-overlay');
    const allModals = document.querySelectorAll('.modal-content');
    
    // 1. Show the main dark overlay
    overlay.style.display = 'flex';
    
    // 2. Hide all modal contents first (reset)
    allModals.forEach(modal => {
        modal.style.display = 'none';
    });
    
    // 3. Show only the specific modal clicked
    const targetModal = document.getElementById(id);
    if (targetModal) {
        targetModal.style.display = 'block';
    }
    
    // 4. Disable background scrolling while popup is active
    document.body.style.overflow = 'hidden';
}

function closeAllModals() {
    const overlay = document.getElementById('modal-overlay');
    
    // Hide the overlay
    overlay.style.display = 'none';
    
    // Re-enable background scrolling
    document.body.style.overflow = 'auto';
}

// Close popup if user presses the "Escape" key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAllModals();
    }
});