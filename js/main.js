/**
 * Chatoras Food — Main JavaScript
 */

const MENU_CATEGORIES = [
  { id: 'pani-puri', label: 'Pani Puri', icon: '🥟' },
  { id: 'puff', label: 'Puff', icon: '🥐' },
  { id: 'vada-pav', label: 'Vada Pav', icon: '🍔' },
  { id: 'sandwich', label: 'Sandwich', icon: '🥪' },
  { id: 'dabeli', label: 'Dabeli', icon: '🌯' },
  { id: 'samosa', label: 'Samosa', icon: '🥟' },
  { id: 'drinks', label: 'Drinks', icon: '🥤' },
];

const MENU_ITEMS = [
  { name: 'Pani Puri (6pc)', price: '£1.99', category: 'pani-puri', tags: ['veg'] },
  { name: 'Sev Puri', price: '£2.99', category: 'pani-puri', tags: ['veg'] },
  { name: 'Dahi Puri', price: '£2.49', category: 'pani-puri', tags: ['veg'] },
  { name: 'Chatni Puri', price: '£2.49', category: 'pani-puri', tags: ['veg'] },
  { name: 'Cheese Sev Puri', price: '£3.49', category: 'pani-puri', tags: ['veg'] },
  { name: 'Plain Puff', price: '£1.99', category: 'puff', tags: ['veg'] },
  { name: 'Sev Puff', price: '£2.49', category: 'puff', tags: ['veg'] },
  { name: 'Peanut Puff', price: '£2.49', category: 'puff', tags: ['veg'] },
  { name: 'Schezwan Puff', price: '£2.49', category: 'puff', tags: ['spicy'] },
  { name: 'Mayo Puff', price: '£2.49', category: 'puff', tags: ['veg'] },
  { name: 'Peri Peri Puff', price: '£2.49', category: 'puff', tags: ['spicy'] },
  { name: 'Chilli Garlic Puff', price: '£2.49', category: 'puff', tags: ['spicy'] },
  { name: 'Extra Hot Puff', price: '£2.49', category: 'puff', tags: ['spicy'] },
  { name: 'Garlic Mayo Puff', price: '£2.49', category: 'puff', tags: ['veg'] },
  { name: 'Chatoras Special Puff', price: '£2.49', category: 'puff', tags: ['spicy'] },
  { name: 'Vada Pav', price: '£2.49', category: 'vada-pav', tags: ['spicy'] },
  { name: 'Cheese Vada Pav', price: '£2.99', category: 'vada-pav', tags: ['spicy'] },
  { name: 'Spicy Vada Pav', price: '£2.99', category: 'vada-pav', tags: ['spicy'] },
  { name: 'Chatoras Special Vada Pav', price: '£2.99', category: 'vada-pav', tags: ['spicy'] },
  { name: 'Veg Sandwich', price: '£3.99', category: 'sandwich', tags: ['veg'] },
  { name: 'Veg Grill Sandwich', price: '£4.99', category: 'sandwich', tags: ['veg'] },
  { name: 'Veg Cheese Sandwich', price: '£3.99', category: 'sandwich', tags: ['veg'] },
  { name: 'Veg Cheese Grill Sandwich', price: '£5.49', category: 'sandwich', tags: ['veg'] },
  { name: 'Dabeli', price: '£2.49', category: 'dabeli', tags: ['spicy'] },
  { name: 'Cheese Dabeli', price: '£2.99', category: 'dabeli', tags: ['spicy'] },
  { name: 'Chatoras Special Dabeli', price: '£2.99', category: 'dabeli', tags: ['spicy'] },
  { name: 'Bombay Bhel', price: '£3.49', category: 'samosa', tags: ['spicy'] },
  { name: 'Bombay Cheese Bhel', price: '£3.99', category: 'samosa', tags: ['spicy'] },
  { name: 'Samosa (2)', price: '£1.99', category: 'samosa', tags: ['spicy'] },
  { name: 'Samosa Chaat (2)', price: '£2.99', category: 'samosa', tags: ['spicy'] },
  { name: 'Masala Chai', price: '£1.99', category: 'drinks', tags: ['veg'] },
  { name: 'Coffee', price: '£1.99', category: 'drinks', tags: ['veg'] },
  { name: 'Water Bottle', price: '£1.19', category: 'drinks', tags: ['veg'] },
  { name: 'Coke Original', price: '£1.29', category: 'drinks', tags: ['veg'] },
  { name: 'Diet Coke', price: '£1.29', category: 'drinks', tags: ['veg'] },
  { name: 'Fanta', price: '£1.29', category: 'drinks', tags: ['veg'] },
  { name: 'Kashmiri Soda', price: '£1.49', category: 'drinks', tags: ['veg'] },
];

function renderMenuItem(item) {
  const tag = item.tags[0];
  const isSpicy = tag === 'spicy';
  const tagLabel = isSpicy ? 'Spicy' : 'Pure Veg';
  const tagClass = isSpicy ? 'menu-item__tag--spicy' : 'menu-item__tag--veg';

  return `
    <li class="menu-item">
      <span class="menu-item__name">${item.name}</span>
      <span class="menu-item__tag ${tagClass}" title="${tagLabel}" aria-label="${tagLabel}">${isSpicy ? '🌶' : '🌿'}</span>
      <span class="menu-item__line" aria-hidden="true"></span>
      <span class="menu-item__price">${item.price}</span>
    </li>
  `;
}

function renderCategoryBlock(category, items, index) {
  const isDense = items.length >= 6;
  const minPrice = Math.min(...items.map(item => parseFloat(item.price.replace('£', ''))));

  return `
    <section class="menu-category reveal${isDense ? ' menu-category--dense' : ''}" data-category="${category.id}" style="transition-delay: ${index * 60}ms">
      <header class="menu-category__head">
        <div class="menu-category__title-wrap">
          <span class="menu-category__icon" aria-hidden="true">${category.icon}</span>
          <h3 class="menu-category__title">${category.label}</h3>
        </div>
        <span class="menu-category__meta">from £${minPrice.toFixed(2)}</span>
      </header>
      <ul class="menu-category__list">
        ${items.map(renderMenuItem).join('')}
      </ul>
    </section>
  `;
}

function updateMenuStats(filter = 'all') {
  const el = document.getElementById('menuStats');
  if (!el) return;

  const items = filter === 'all'
    ? MENU_ITEMS
    : MENU_ITEMS.filter(i => i.category === filter);

  const count = items.length;
  const label = filter === 'all' ? `${count} dishes · ${MENU_CATEGORIES.length} categories` : `${count} ${MENU_CATEGORIES.find(c => c.id === filter)?.label || ''} items`;
  el.textContent = label;
}

function renderMenu(filter = 'all') {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;

  const categories = filter === 'all'
    ? MENU_CATEGORIES
    : MENU_CATEGORIES.filter(c => c.id === filter);

  grid.classList.toggle('menu__grid--single', filter !== 'all');

  const html = categories.map((cat, i) => {
    const items = MENU_ITEMS.filter(item => item.category === cat.id);
    return renderCategoryBlock(cat, items, i);
  }).join('');

  grid.style.opacity = '0';
  grid.style.transform = 'translateY(6px)';

  requestAnimationFrame(() => {
    grid.innerHTML = html;
    updateMenuStats(filter);
    observeRevealElements(grid.querySelectorAll('.reveal'));

    requestAnimationFrame(() => {
      grid.style.opacity = '1';
      grid.style.transform = 'translateY(0)';
    });
  });
}

function initMenuFilters() {
  const filters = document.querySelectorAll('.menu__filter');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(f => {
        f.classList.remove('active');
        f.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      renderMenu(btn.dataset.filter);
    });
  });
}

function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  const links = nav?.querySelectorAll('.nav__link, .nav__mobile-btn');
  let scrollY = 0;

  const preventBackgroundScroll = e => {
    if (!nav?.classList.contains('open')) return;
    if (nav.contains(e.target)) return;
    e.preventDefault();
  };

  const lockBackgroundScroll = () => {
    document.addEventListener('touchmove', preventBackgroundScroll, { passive: false });
    document.addEventListener('wheel', preventBackgroundScroll, { passive: false });
  };

  const unlockBackgroundScroll = () => {
    document.removeEventListener('touchmove', preventBackgroundScroll);
    document.removeEventListener('wheel', preventBackgroundScroll);
  };

  const setNavOpen = isOpen => {
    nav?.classList.toggle('open', isOpen);
    toggle?.classList.toggle('open', isOpen);
    toggle?.setAttribute('aria-expanded', String(isOpen));
    document.documentElement.classList.toggle('mobile-nav-open', isOpen);
    document.body.classList.toggle('mobile-nav-open', isOpen);

    if (isOpen) {
      scrollY = window.scrollY;
      document.body.style.top = `-${scrollY}px`;
      lockBackgroundScroll();
    } else {
      document.body.style.top = '';
      window.scrollTo(0, scrollY);
      unlockBackgroundScroll();
    }
  };

  toggle?.addEventListener('click', () => {
    setNavOpen(!nav?.classList.contains('open'));
  });

  links?.forEach(link => {
    link.addEventListener('click', () => setNavOpen(false));
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav?.classList.contains('open')) {
      setNavOpen(false);
    }
  });

  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 1025px)').matches) {
      setNavOpen(false);
    }
  }, { passive: true });
}

function initScrollEffects() {
  const header = document.getElementById('header');
  const announce = document.querySelector('.announcement-bar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const getScrollOffset = () => {
    const headerH = header?.offsetHeight || 72;
    const announceH = announce?.offsetHeight || 36;
    return headerH + announceH + 12;
  };

  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 20);

    const offset = getScrollOffset();
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - offset;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });
}

function observeRevealElements(elements) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.06, rootMargin: window.matchMedia('(max-width: 768px)').matches ? '0px 0px -20px 0px' : '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

function initScrollReveal() {
  document.querySelectorAll('.reveal').forEach(el => {
    if (!el.classList.contains('visible')) {
      observeRevealElements([el]);
    }
  });
}

function initTilt3D(elements) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const cards = elements || document.querySelectorAll('[data-tilt]');

  cards.forEach(card => {
    if (card.dataset.tiltBound) return;
    card.dataset.tiltBound = 'true';

    const inner = card.querySelector('.tilt-card__inner');
    if (!inner) return;

    const maxTilt = parseFloat(card.dataset.tiltMax) || 10;
    const isHero = card.classList.contains('hero__card');
    const baseX = 0;
    const baseY = 0;
    const scaleHover = isHero ? 1.02 : 1.02;

    const applyTransform = (rx, ry, scale = 1) => {
      inner.style.transform =
        `rotateX(${baseX + rx}deg) rotateY(${baseY + ry}deg) scale3d(${scale}, ${scale}, ${scale})`;
    };

    applyTransform(0, 0, 1);

    card.addEventListener('mouseenter', () => {
      inner.style.transition = 'transform 0.08s ease-out';
    });

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * maxTilt;
      const rotateY = (x - 0.5) * maxTilt;
      applyTransform(rotateX, rotateY, scaleHover);
    });

    card.addEventListener('mouseleave', () => {
      inner.style.transition = 'transform 0.55s cubic-bezier(0.23, 1, 0.32, 1)';
      applyTransform(0, 0, 1);
    });
  });
}

function initHeroParallax() {
  const pivot = document.getElementById('heroStagePivot');
  if (!pivot || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(max-width: 768px)').matches) return;

  window.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    pivot.style.transform = `rotateY(${x * 2}deg) rotateX(${-y * 2}deg)`;
  }, { passive: true });
}

function initFooter() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function initMenuLightbox() {
  const lightbox = document.getElementById('menuLightbox');
  if (!lightbox) return;

  const triggers = document.querySelectorAll('[data-menu-zoom]');
  const closeEls = lightbox.querySelectorAll('[data-menu-lightbox-close]');
  let lastTrigger = null;

  const open = trigger => {
    lastTrigger = trigger;
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => {
      lightbox.classList.add('menu-lightbox--open');
    });
    document.body.classList.add('menu-lightbox-open');
    lightbox.querySelector('.menu-lightbox__close')?.focus();
  };

  const close = () => {
    lightbox.classList.remove('menu-lightbox--open');
    document.body.classList.remove('menu-lightbox-open');
    lightbox.setAttribute('aria-hidden', 'true');

    window.setTimeout(() => {
      lightbox.hidden = true;
      lastTrigger?.focus();
      lastTrigger = null;
    }, 350);
  };

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => open(trigger));
  });

  closeEls.forEach(el => {
    el.addEventListener('click', close);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !lightbox.hidden) {
      close();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderMenu();
  initMenuFilters();
  initMobileNav();
  initScrollEffects();
  initScrollReveal();
  initTilt3D();
  initHeroParallax();
  initFooter();
  initMenuLightbox();
});
