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

// ===== CLEAN URL ENGINE =====
// GitHub Pages has no server-side URL rewriting and no clean-url routing, so
// pages are served from their .html files. This engine:
//   1. Intercepts internal navigation and loads the real .html URL directly
//      (a full page load, so every page's own <base> resolves its assets
//      correctly and there is no client-side-render fragility).
//   2. After the page loads (DOMContentLoaded), rewrites the address bar to
//      the clean extensionless form via history.replaceState.
// A companion 404.html redirects direct visits from the clean URL to the
// .html file, and the DOMContentLoaded handler cleans the URL bar again.

(function() {
    var ASSET_RE = /\.(css|js|png|jpe?g|gif|webp|svg|ico|txt|xml|pdf|woff2?|map)$/i;

    function pathnameOf(href) {
        try {
            var a = document.createElement('a');
            a.href = href;
            return a.origin === window.location.origin ? a.pathname : null;
        } catch (e) {
            return null;
        }
    }

    function cleanFor(pathname) {
        var out = pathname || '/';
        if (out === '/index.html' || out === '/' || out === '/index') {
            out = '/';
        } else {
            out = out.replace(/\.html?$/i, '');
        }
        if (!out.startsWith('/')) out = '/' + out;
        if (out.length > 1 && out.endsWith('/')) out = out.slice(0, -1);
        if (out === '/index') out = '/';
        return out;
    }

    function htmlPathFor(cleanUrl) {
        if (cleanUrl === '/' || cleanUrl === '') return '/index.html';
        return cleanUrl + '.html';
    }

    function isInternalPage(href) {
        var p = pathnameOf(href);
        if (!p) return false;
        if (ASSET_RE.test(p)) return false;
        if (href.trim().startsWith('#')) return false;
        return true;
    }

    function refreshNavActive(currentPath) {
        var activePath = cleanFor(currentPath);
        document.querySelectorAll('.nav-links a').forEach(function(link) {
            var href = link.getAttribute('href');
            if (!href) return;
            var p = pathnameOf(href);
            var target = p ? cleanFor(p) : href;
            link.classList.toggle('active', target === activePath);
        });
    }

    document.addEventListener('click', function(e) {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
            return;
        }
        var el = e.target.closest ? e.target.closest('a') : null;
        if (!el) return;
        var href = el.getAttribute('href') || '';
        if (!href || href.startsWith('#') || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) {
            return;
        }
        if (href.indexOf('http') === 0 || href.indexOf('//') === 0) {
            return;
        }
        if (!isInternalPage(href)) return;
        var target = cleanFor(pathnameOf(href));
        e.preventDefault();
        window.location.href = htmlPathFor(target);
    });

    document.addEventListener('DOMContentLoaded', function() {
        var path = window.location.pathname;
        if (/\.html?$/i.test(path)) {
            history.replaceState(null, '', cleanFor(path));
            refreshNavActive(cleanFor(path));
        } else {
            refreshNavActive(cleanFor(path));
        }
    });
})();