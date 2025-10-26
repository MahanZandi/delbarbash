/* ===============================
   1. ELEMENT SELECTORS
   =============================== */
const els = {
  menu: document.getElementById("hamburger-menu"),
  content: document.getElementById("hamburger-content"),
  menuLinks: document.querySelectorAll("#menu-items nav a"),
  subMenu: document.getElementById("subMenuhamburger-content"),
  subcategorieSubMenu: document.getElementById("subcategories-subMenu-content"),
  backdrop: document.getElementById("hamburger-backdrop"),
  openBtn: document.getElementById("hamburger-btn"),
  closeBtn: document.getElementById("hamburger-close"),

  searchBtn: document.getElementById("searchburger-btn"),
  searchBox: document.getElementById("searchbox-Mobile"),
  searchCloseBtn: document.getElementById("mobile-search-close"),
  searchBackdrop: document.getElementById("sticky-backdrop-mobile"),
};

/* ===============================
   2. MENU DATA
   =============================== */
const menuData = {
  categories: {
    title: "دسته بندی محصولات",
    items: [
      {
        id: 1, title: "مراقبت از پوست", icon: "./public/icons/icon-lipstick.png", href: "#skincare",
        subcategories: [
          { name: "پاک‌کننده", items: ["پن صابون", "ژل شستشو", "میکسلار واتر", "تونر", "اسکراب", "همه محصولات پاک‌کننده"] },
          { name: "مرطوب‌کننده", items: ["کرم روز", "کرم شب", "سرم", "لوسیون بدن", "کرم دور چشم", "همه محصولات مرطوب‌کننده"] },
          { name: "محافظت", items: ["کرم ضد آفتاب", "کرم ضد لک", "کرم ضد چروک", "کرم دور چشم", "همه محصولات محافظت"] },
          { name: "ماسک", items: ["ماسک صورت", "ماسک دور چشم", "ماسک لب", "ماسک بدن", "همه محصولات ماسک"] },
          { name: "ابزار", items: ["براش صورت", "اسفنج", "دستگاه پاکسازی", "ابزار ماساژ", "همه ابزار مراقبت"] },
          { name: "تخصصی", items: ["محصولات ضد پیری", "محصولات روشن‌کننده", "محصولات آکنه", "محصولات حساس", "همه محصولات تخصصی"] },
        ],
      },
      {
        id: 2, title: "آرایشی و بهداشتی", icon: "./public/icons/icon-perfume.png", href: "#cosmetics",
        subcategories: [
          { name: "چشم", items: ["سایه", "ریمل", "ریمل رنگی", "خط چشم", "خط چشم رنگی", "مداد چشم", "مداد هاشور ابرو", "مژه", "فرمژه", "صابون ابرو", "همه محصولات چشم"] },
          { name: "لب", items: ["رژ لب جامد", "رژ لب مایع", "پک رژ لب", "بالم لب", "برق لب", "تینت لب", "لیپ گلاس", "خط لب", "حجم دهنده لب", "همه محصولات لب"] },
          { name: "صورت", items: ["کرم پودر", "کوشن", "بی بی کرم", "کانتور و کانسیلر", "هایلایتر", "پنکک", "پرایمر", "رژگونه", "فیکساتور", "لیفت صورت", "همه محصولات صورت"] },
          { name: "ناخن", items: ["لاک", "ناخن مصنوعی", "ابزار ناخن", "ست مانیکور", "همه محصولات ناخن"] },
          { name: "ابزار آرایشی", items: ["براش پد", "کیف آرایش", "تراش", "همه ابزار آرایشی"] },
          { name: "دیگر ملزومات", items: ["پک آرایشی", "رنگ مو", "مو کلیپسی", "همه محصولات آرایشی"] },
        ],
      },
      { id: 3, title: "لباس و پوشاک", icon: "./public/icons/icon-clothing.png", href: "#clothing" },
      { id: 4, title: "لوازم خانگی", icon: "./public/icons/icon-cup.png", href: "#home" },
      { id: 5, title: "لوازم الکتریکی", icon: "./public/icons/icon-lightning-.png", href: "#electric" },
      { id: 6, title: "لوازم برقی", icon: "./public/icons/icon-hair-dryer.png", href: "#appliances" },
      { id: 7, title: "خورشیدی", icon: "./public/icons/icon-solar.png", href: "#solar" },
      { id: 8, title: "دارو و مکمل", icon: "./public/icons/icon-drugs.png", href: "#pharmacy" },
    ],
  },
};


/* ===============================
   3. HELPER FUNCTIONS
   =============================== */
function toggleBodyScroll(disable) {
  document.body.style.overflow = disable ? "hidden" : "auto";
}
function fadeIn(el) { el.classList.replace("opacity-0", "opacity-100"); }
function fadeOut(el) { el.classList.replace("opacity-100", "opacity-0"); }
function slideIn(el) { el.classList.replace("translate-x-full", "translate-x-0"); }
function slideOut(el) { el.classList.replace("translate-x-0", "translate-x-full"); }

// ---- Search helpers (جدید) ----
function initSearchUI() {
  if (!els.searchBox) return;
  els.searchBox.style.opacity = "0";
  els.searchBox.style.transform = "scaleY(0)";
  els.searchBox.style.transformOrigin = "top";
  els.searchBox.style.transition = "all 0.3s ease";
}
function openSearch() {
  if (!els.searchBtn || !els.searchBox) return;
  els.searchBtn.classList.add("hidden");
  els.searchBox.style.opacity = "1";
  els.searchBox.style.transform = "scaleY(1)";
  els.searchBackdrop?.classList.add("search-active"); 
  // فوکوس روی ورودی (در صورت وجود)
  const input = els.searchBox.querySelector("input");
  setTimeout(() => input?.focus(), 300);
}
function closeSearch() {
  if (!els.searchBtn || !els.searchBox) return;
  els.searchBtn.classList.remove("hidden")
  els.searchBox.style.opacity = "0";
  els.searchBox.style.transform = "scaleY(0)";
  els.searchBackdrop?.classList.remove("search-active");
}


/* ===============================
   4. CORE MENU ACTIONS
   =============================== */
function openHamburgerMenu() {
  if (!els.menu || !els.content || !els.backdrop) return;
  els.menu.classList.remove("hidden");
  toggleBodyScroll(true);
  fadeIn(els.backdrop);
  slideIn(els.content);
}
function closeHamburgerMenu() {
  fadeOut(els.backdrop);
  slideOut(els.content);
  slideOut(els.subMenu);
  slideOut(els.subcategorieSubMenu);
  setTimeout(() => {
    els.menu.classList.add("hidden");
    toggleBodyScroll(false);
  }, 300);
}

/* ===============================
   5. SUBMENU HANDLING
   =============================== */
function openSubMenu(title, items) {
  els.content.classList.replace("translate-x-0", "translate-x-full");
  renderSubMenu(title, items);
  slideIn(els.subMenu);
}
function closeSubMenu() {
  slideOut(els.subMenu);
  els.content.classList.replace("translate-x-full", "translate-x-0");
}
function openSubCategories(title, subcategories) {
  els.subMenu.classList.replace("translate-x-0", "translate-x-full");
  renderSubCategories(title, subcategories);
  slideIn(els.subcategorieSubMenu);
}
function closeSubCategories() {
  slideOut(els.subcategorieSubMenu);
  els.subMenu.classList.replace("translate-x-full", "translate-x-0");
}

/* ===============================
   6. SUBMENU RENDERING
   =============================== */
function renderSubMenu(title, items) {
  if (!els.subMenu) return;
  els.subMenu.innerHTML = `
    <div class="p-6 ">
      <div class="flex items-center gap-3 mb-6">
        <button id="subMenu-close" class="w-8 h-8 border border-primary-600 rounded-full flex items-center justify-center">
          <img src="./public/icons/arrow-back-icon.png" alt="Back" />
        </button>
        <h2 class="font-medium text-primary-600">${title}</h2>
      </div>
      <nav class="flex flex-col gap-[34px]"></nav>
    </div>
  `;
  const nav = els.subMenu.querySelector("nav");

  items.forEach((item) => {
    const hasSubs = !!item.subcategories;
    const link = document.createElement("a");
    link.href = "#";
    link.className =
      "flex items-center justify-between text-gray-800 hover:text-primary-600 transition-colors w-full text-right";
    link.innerHTML = `
    <span class="flex items-center gap-2">
      <img src="${item.icon}" alt="${item.title}" class="w-7 h-7 object-contain" />
      <span class="text-[#9A6767]">${item.title}</span>
    </span>
    ${hasSubs ? '<i class="fa-solid fa-chevron-left text-primary-600"></i>' : ""}
  `;
    link.addEventListener("click", (e) => {
      e.preventDefault();
      if (hasSubs) openSubCategories(item.title, item.subcategories);
    });
    nav.appendChild(link);
  });

  els.subMenu.querySelector("#subMenu-close").addEventListener("click", closeSubMenu);
}

/* ===============================
   7. SUBCATEGORY ACCORDION RENDERING
   =============================== */
function renderSubCategories(title, subcategories) {
  if (!els.subcategorieSubMenu) return;
  const red = "#C41818";

  // Render the container of the subcategory slide
  els.subcategorieSubMenu.innerHTML = `
    <div class="p-6">
      <div class="flex items-center gap-3 mb-6">
        <button id="subcategories-close" class="w-8 h-8 border border-primary-600 rounded-full flex items-center justify-center">
          <img src="./public/icons/arrow-back-icon.png" alt="Back" />
        </button>
        <h2 class="font-medium text-primary-600">${title}</h2>
      </div>
      <div id="categories-accordion"></div>
    </div>
  `;

  const root = els.subcategorieSubMenu.querySelector("#categories-accordion");

  // Loop through each subcategory and create an accordion card
  subcategories.forEach((cat) => {
    const card = document.createElement("div");
    card.className = "rounded-xl overflow-hidden bg-transparent mb-3";
    card.innerHTML = `
      <button
        id="btn-${cat.name}"
        class="w-full flex items-center justify-between px-4 py-3 text-white font-medium text-sm rounded-[10px]"
        style="background:${red}"
        data-acc-trigger
        aria-expanded="false"
        aria-controls="panel-${cat.name}">
        <span>${cat.name}</span>
        <svg class="caret w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <div id="panel-${cat.name}" class="max-h-0 overflow-hidden transition-[max-height] duration-300 ease-in-out bg-transparent">
        <div class="py-3 space-y-2 bg-transparent">
          ${cat.items.map(i => `
            <button class="w-full text-right text-sm px-3 py-2 rounded-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
              ${i}
            </button>
          `).join('')}
        </div>
      </div>
    `;
    root.appendChild(card);
  });

  // Accordion logic: open/close panels when clicking the button
  (function () {
    const allowMultiple = false;
    const triggers = Array.from(root.querySelectorAll("[data-acc-trigger]"));

    // Function to open/close a single panel
    function setOpen(trigger, open) {
      const panelId = trigger.getAttribute("aria-controls");
      const panel = document.getElementById(panelId);
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
      trigger.querySelector(".caret").style.transform = open ? "rotate(180deg)" : "rotate(0deg)";
      panel.style.maxHeight = open ? panel.scrollHeight + "px" : "0px";
    }

    // Toggle panel when clicking
    function toggle(trigger) {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      if (!allowMultiple) triggers.forEach((t) => t !== trigger && setOpen(t, false));
      setOpen(trigger, !isOpen);
    }

    // Bind click event to each trigger
    triggers.forEach((btn) => {
      btn.addEventListener("click", () => toggle(btn));
      setOpen(btn, false);
    });
  })();

  // Back button: close the subcategory slide and return to previous submenu
  els.subcategorieSubMenu.querySelector("#subcategories-close")
    .addEventListener("click", closeSubCategories);
}

/* ===============================
   8. EVENT BINDINGS
   =============================== */
function initMenuEvents() {
  const openBtn = document.getElementById("hamburger-btn");
  console.log("openBtn :", openBtn)
  openBtn?.addEventListener("click", openHamburgerMenu);
  els.closeBtn?.addEventListener("click", closeHamburgerMenu);
  els.backdrop?.addEventListener("click", closeHamburgerMenu);

  els.menuLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const text = link.querySelector("span")?.textContent.trim();
      const subMenuData = Object.values(menuData).find((m) => m.title === text);
      if (subMenuData) {
        e.preventDefault();
        openSubMenu(subMenuData.title, subMenuData.items);
      }
    });
  });

   // ---- Mobile search ----
  if (els.searchBtn && els.searchBox && els.searchCloseBtn) {
    els.searchBtn.addEventListener("click", openSearch);
    els.searchCloseBtn.addEventListener("click", closeSearch);
  }
}

/* ===============================
   9. INIT ON PAGE LOAD
   =============================== */
document.addEventListener("DOMContentLoaded", () => {
  initSearchUI();     
  initMenuEvents();   
});

