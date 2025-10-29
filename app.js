// Contenido para app.js
// (Este es el script completo de tu index.html)

// --- Language Management ---
const langEnElements = document.querySelectorAll('.lang-en');
const langEsElements = document.querySelectorAll('.lang-es');
const langEnSwitch = document.getElementById('lang-en-switch');
const langEsSwitch = document.getElementById('lang-es-switch');
const messageTextarea = document.getElementById('message');

// --- Image Gallery Management ---
const galleryData = [
    {
        src: 'images/experience1.png',
        alt: 'Solar rooftop installation for industrial client',
        captionEN: 'Kiwapower, a company co-founded and co-managed by Becquerel Capital, delivers distributed solar energy as a service to dozens of premium industrial clients in Mexico.',
        captionES: 'Kiwapower, empresa cofundada y codirigida por Becquerel Capital, entrega energía solar distribuida como servicio a docenas de clientes industriales premium en México.'
    },
    {
        src: 'images/experience2.jpg',
        alt: 'Gas pipeline development in Jalisco, Mexico',
        captionEN: 'Compression station developed by GG Infraestructura in Mexico.',
        captionES: 'Estación de compresión desarrollada por GG Infraestructura en México.'
    },
    {
        src: 'images/experience3.jpg',
        alt: 'Gas compression station in Mexico',
        captionEN: 'Gas pipeline in Jalisco, Mexico, developed by GG Infraestructura from 2016 to 2018, currently supplying an 850 MW combined cycle plant.',
        captionES: 'Gasoducto en Jalisco, México, desarrollado por GG Infraestructura de 2016 a 2018, que actualmente abastece a una planta de ciclo combinado de 850 MW.'
    }
];

let currentImageIndex = 0;
const galleryImage = document.getElementById('gallery-image');
const galleryCaption = document.getElementById('gallery-caption');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

function updateGallery(lang) {
    // Esta comprobación evita errores en páginas que no tienen la galería
    if (!galleryImage) return; 
    
    const currentImage = galleryData[currentImageIndex];
    galleryImage.style.opacity = 0;
    setTimeout(() => {
        galleryImage.src = currentImage.src;
        galleryImage.alt = currentImage.alt;
        galleryCaption.textContent = lang === 'es' ? currentImage.captionES : currentImage.captionEN;
        galleryImage.style.opacity = 1;
    }, 300);
}

if(nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % galleryData.length;
        const currentLang = document.documentElement.lang || 'en';
        updateGallery(currentLang);
    });

    prevBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + galleryData.length) % galleryData.length;
        const currentLang = document.documentElement.lang || 'en';
        updateGallery(currentLang);
    });
}

function updateIndustryLinks() {
    const currentLang = document.documentElement.lang || 'en';
    document.querySelectorAll('.industry-card').forEach(card => {
        const baseHref = card.getAttribute('data-base-href');
        if (baseHref) {
            card.href = `${baseHref}?lang=${currentLang}`;
        }
    });
}

function setLanguage(lang) {
    localStorage.setItem('landpower_lang', lang); 
    if (lang === 'en') {
        langEnElements.forEach(el => el.style.display = 'inline');
        langEsElements.forEach(el => el.style.display = 'none');
        if(langEnSwitch) { // Comprobación de seguridad
            langEnSwitch.classList.add('active-lang');
            langEnSwitch.classList.remove('inactive-lang');
        }
        if(langEsSwitch) { // Comprobación de seguridad
            langEsSwitch.classList.add('inactive-lang');
            langEsSwitch.classList.remove('active-lang');
        }
        document.documentElement.lang = 'en';
        if (messageTextarea) messageTextarea.placeholder = messageTextarea.getAttribute('placeholder-en');
    } else if (lang === 'es') {
        langEnElements.forEach(el => el.style.display = 'none');
        langEsElements.forEach(el => el.style.display = 'inline');
        if(langEsSwitch) { // Comprobación de seguridad
            langEsSwitch.classList.add('active-lang');
            langEsSwitch.classList.remove('inactive-lang');
        }
        if(langEnSwitch) { // Comprobación de seguridad
            langEnSwitch.classList.add('inactive-lang');
            langEnSwitch.classList.remove('active-lang');
        }
        document.documentElement.lang = 'es';
        if (messageTextarea) messageTextarea.placeholder = messageTextarea.getAttribute('placeholder-es');
    }
    
    // Estas funciones solo se ejecutarán si los elementos existen en la página actual
    updateIndustryLinks();
    if (galleryImage) {
        updateGallery(lang);
    }

    // Actualiza los enlaces de las sub-páginas
    document.querySelectorAll('a[href*=".html"]').forEach(link => {
        // Evita modificar los enlaces que ya maneja 'updateIndustryLinks'
        if (link.classList.contains('industry-card')) return;
        
        try {
            // Clona la URL para no modificar la original en bucles
            let href = link.getAttribute('href');
            if (!href || !href.includes('.html')) return; // Salta si no es un enlace HTML

            let destURL = new URL(href, window.location.origin);
            destURL.searchParams.set('lang', lang);

            if (href.includes('#')) {
                let [base, hash] = href.split('#');
                let newBase = new URL(base, window.location.origin);
                newBase.searchParams.set('lang', lang);
                link.href = newBase.pathname + newBase.search + '#' + hash;
            } else {
                link.href = destURL.pathname + destURL.search;
            }
        } catch(e) { 
            // Falla silenciosamente para enlaces no estándar (ej. mailto:)
        }
    });
}

function lpShowToast(message, variant='success') {
  const toast = document.getElementById('lp-toast');
  const card = document.getElementById('lp-toast-card');
  if (!toast || !card) return;
  
  if (variant === 'error') {
    card.classList.remove('bg-green-600');
    card.classList.add('bg-red-600');
    card.textContent = '✖ ' + message;
  } else {
    card.classList.remove('bg-green-600');
    card.classList.add('bg-green-600');
    card.textContent = '✅ ' + message;
  }

  toast.classList.remove('hidden');
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 200ms ease';
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.classList.add('hidden'), 200);
  }, 3500);
}

document.addEventListener('DOMContentLoaded', () => {
    // --- Language Setup ---
    const urlParams = new URLSearchParams(window.location.search);
    const langFromURL = urlParams.get('lang');
    // Unificamos el 'localStorage' para que funcione en todas las páginas
    const langFromStorage = localStorage.getItem('landpower_lang'); 
    const initialLang = langFromURL || langFromStorage || 'en';
    setLanguage(initialLang);

    // --- Mobile Menu (Solo existe en index.html) ---
    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn) {
        const mobileMenu = document.getElementById('mobile-menu');
        const menuOpenIcon = document.getElementById('menu-open-icon');
        const menuCloseIcon = document.getElementById('menu-close-icon');
        const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            menuOpenIcon.classList.toggle('hidden');
            menuCloseIcon.classList.toggle('hidden');
        });

        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuOpenIcon.classList.remove('hidden');
                menuCloseIcon.classList.add('hidden');
            });
        });
    }

    // --- Contact Form Logic (Solo existe en index.html) ---
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const sendBtn = document.getElementById('send-btn');
            const currentLang = document.documentElement.lang || 'en';
            const originalTextEN = 'Send';
            const originalTextES = 'Enviar';
        
            sendBtn.disabled = true;
            if (currentLang === 'es') {
                sendBtn.querySelector('.lang-es').textContent = 'Enviando...';
            } else {
                sendBtn.querySelector('.lang-en').textContent = 'Sending...';
            }
        
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });
        
                if (response.ok) {
                    lpShowToast(currentLang === 'es' ? 'Enviado' : 'Sent', 'success');
                    form.reset();
                } else {
                    lpShowToast(currentLang === 'es' ? 'Hubo un error. Inténtalo de nuevo.' : 'An error occurred. Please try again.', 'error');
                }
            } catch (error) {
                lpShowToast(currentLang === 'es' ? 'Error de conexión. Inténtalo de nuevo.' : 'Connection error. Please try again.', 'error');
            } finally {
                sendBtn.disabled = false;
                sendBtn.querySelector('.lang-en').textContent = originalTextEN;
                sendBtn.querySelector('.lang-es').textContent = originalTextES;
            }
        });
    }
});